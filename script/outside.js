/**
 * Module that registers the outdoors functionality
 */
var Outside = {
	name: _("Outside"),

	_STORES_OFFSET: 0,
	_GATHER_DELAY: 60,
	_TRAPS_DELAY: 90,
	_POP_DELAY: [0.5, 3],

	_INCOME: {
		'artist': {
			name: _('artist'),
			delay: 10,
			stores: {
				'artwork': 1
			}
		},
		'influencer': {
			name: _('influencer'),
			delay: 10,
			stores: {
				'clout': 0.5,
				'leads': 0.5
			}
		},
		'intern': {
			name: _('intern'),
			delay: 10,
			stores: {
				'leads': -1,
				'bait': 1
			}
		},
		'marketer': {
			name: _('marketer'),
			delay: 10,
			stores: {
				'clout': -5,
				'confidence': 1
			}
		},
		'salesperson': {
			name: _('salesperson'),
			delay: 10,
			stores: {
				'leads': -5,
				'artwork': -5,
				'money': 1
			}
		},
		'iron miner': {
			name: _('iron miner'),
			delay: 10,
			stores: {
				'money': -1,
				'iron': 1
			}
		},
		'coal miner': {
			name: _('coal miner'),
			delay: 10,
			stores: {
				'money': -1,
				'coal': 1
			}
		},
		'sulphur miner': {
			name: _('sulphur miner'),
			delay: 10,
			stores: {
				'money': -1,
				'sulphur': 1
			}
		},
		'steelworker': {
			name: _('steelworker'),
			delay: 10,
			stores: {
				'iron': -1,
				'coal': -1,
				'steel': 1
			}
		},
		'armourer': {
			name: _('armourer'),
			delay: 10,
			stores: {
				'steel': -1,
				'sulphur': -1,
				'bullets': 1
			}
		}
	},

	TrapDrops: [
		{
			rollUnder: 0.5,
			name: 'clout',
			message: _('some clout')
		},
		{
			rollUnder: 0.75,
			name: 'leads',
			message: _('a few leads')
		},
		{
			rollUnder: 0.85,
			name: 'intelligence',
			message: _('gained intelligence')
		},
		{
			rollUnder: 0.93,
			name: 'experience',
			message: _('gained experience')
		},
		{
			rollUnder: 0.995,
			name: 'cloth',
			message: _('tattered cloth')
		},
		{
			rollUnder: 1.0,
			name: 'charm',
			message: _('a crudely made charm')
		}
	],

	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);

		if(Engine._debug) {
			this._GATHER_DELAY = 0;
			this._TRAPS_DELAY = 0;
		}

		// Create the outside tab
		this.tab = Header.addLocation(_("A New Space"), "outside", Outside);

		// Create the Outside panel
		this.panel = $('<div>').attr('id', "outsidePanel")
			.addClass('location')
			.appendTo('div#locationSlider');

		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Outside.handleStateUpdates);

		if(typeof $SM.get('features.location.outside') == 'undefined') {
			$SM.set('features.location.outside', true);
			if(!$SM.get('game.buildings')) $SM.set('game.buildings', {});
			if(!$SM.get('game.population')) $SM.set('game.population', 0);
			if(!$SM.get('game.workers')) $SM.set('game.workers', {});
		}

		this.updateVillage();
		Outside.updateWorkersView();

		Engine.updateSlider();

		// Create the gather button
		new Button.Button({
			id: 'gatherButton',
			text: _("get artwork"),
			click: Outside.gatherArtwork,
			cooldown: Outside._GATHER_DELAY,
			width: '80px'
		}).appendTo('div#outsidePanel');
	},

	getMaxPopulation: function() {
		return $SM.get('game.buildings["studio"]', true) * 4;
	},

	increasePopulation: function() {
		var space = Outside.getMaxPopulation() - $SM.get('game.population');
		if(space > 0) {
			var num = Math.floor(Math.random()*(space/2) + space/2);
			if(num === 0) num = 1;
			if(num == 1) {
				Notifications.notify(null, _('an artist occupies a studio'));
			} else if(num < 5) {
				Notifications.notify(null, _('a group of artists take up in one of the studios.'));
			} else if(num < 10) {
				Notifications.notify(null, _('an art collective arrives, pale and skinny from the woes of trying to do it on their own.'));
			} else if(num < 30) {
				Notifications.notify(null, _('many artists rent studios, the world is too tough without gallery representation.'));
			} else {
				Notifications.notify(null, _("the studio's are booming, there is even a waitlist."));
			}
			Engine.log('population increased by ' + num);
			$SM.add('game.population', num);
		}
		Outside.schedulePopIncrease();
	},

	killVillagers: function(num) {
		$SM.add('game.population', num * -1);
		if($SM.get('game.population') < 0) {
			$SM.set('game.population', 0);
		}
		var remaining = Outside.getNumArtists();
		if(remaining < 0) {
			var gap = -remaining;
			for(var k in $SM.get('game.workers')) {
				var numWorkers = $SM.get('game.workers["'+k+'"]');
				if(numWorkers < gap) {
					gap -= numWorkers;
					$SM.set('game.workers["'+k+'"]', 0);
				} else {
					$SM.add('game.workers["'+k+'"]', gap * -1);
					break;
				}
			}
		}
	},

	schedulePopIncrease: function() {
		var nextIncrease = Math.floor(Math.random()*(Outside._POP_DELAY[1] - Outside._POP_DELAY[0])) + Outside._POP_DELAY[0];
		Engine.log('next population increase scheduled in ' + nextIncrease + ' minutes');
		Outside._popTimeout = Engine.setTimeout(Outside.increasePopulation, nextIncrease * 60 * 1000);
	},

	updateWorkersView: function() {
		var workers = $('div#workers');

		// If our population is 0 and we don't already have a workers view,
		// there's nothing to do here.
		if(!workers.length && $SM.get('game.population') === 0) return;

		var needsAppend = false;
		if(workers.length === 0) {
			needsAppend = true;
			workers = $('<div>').attr('id', 'workers').css('opacity', 0);
		}

		var numArtists = $SM.get('game.population');
		var artist = $('div#workers_row_artist', workers);

		for(var k in $SM.get('game.workers')) {
			var workerCount = $SM.get('game.workers["'+k+'"]');
			var row = $('div#workers_row_' + k.replace(' ', '-'), workers);
			if(row.length === 0) {
				row = Outside.makeWorkerRow(k, workerCount);

				var curPrev = null;
				workers.children().each(function(i) {
					var child = $(this);
					var cName = child.attr('id').substring(12).replace('-', ' ');
					if(cName != 'artist') {
						if(cName < k && (curPrev == null || cName > curPrev)) {
							curPrev = cName;
						}
					}
				});
				if(curPrev == null && artist.length === 0) {
					row.prependTo(workers);
				}
				else if(curPrev == null)
				{
					row.insertAfter(artist);
				}
				else
				{
					row.insertAfter(workers.find('#workers_row_' + curPrev.replace(' ', '-')));
				}

			} else {
				$('div#' + row.attr('id') + ' > div.row_val > span', workers).text(workerCount);
			}
			numArtists -= workerCount;
			if(workerCount === 0) {
				$('.dnBtn', row).addClass('disabled');
				$('.dnManyBtn', row).addClass('disabled');
			} else {
				$('.dnBtn', row).removeClass('disabled');
				$('.dnManyBtn', row).removeClass('disabled');
			}
		}

		if(artist.length === 0) {
			artist = Outside.makeWorkerRow('artist', numArtists);
			artist.prependTo(workers);
		} else {
			$('div#workers_row_artist > div.row_val > span', workers).text(numArtists);
		}

		if(numArtists === 0) {
			$('.upBtn', '#workers').addClass('disabled');
			$('.upManyBtn', '#workers').addClass('disabled');
		} else {
			$('.upBtn', '#workers').removeClass('disabled');
			$('.upManyBtn', '#workers').removeClass('disabled');
		}


		if(needsAppend && workers.children().length > 0) {
			workers.appendTo('#outsidePanel').animate({opacity:1}, 300, 'linear');
		}
	},

	getNumArtists: function() {
		var num = $SM.get('game.population');
		for(var k in $SM.get('game.workers')) {
			num -= $SM.get('game.workers["'+k+'"]');
		}
		return num;
	},

	makeWorkerRow: function(key, num) {
		name = Outside._INCOME[key].name;
		if(!name) name = key;
		var row = $('<div>')
			.attr('key', key)
			.attr('id', 'workers_row_' + key.replace(' ','-'))
			.addClass('workerRow');
		$('<div>').addClass('row_key').text(name).appendTo(row);
		var val = $('<div>').addClass('row_val').appendTo(row);

		$('<span>').text(num).appendTo(val);

		if(key != 'artist') {
			$('<div>').addClass('upManyBtn').appendTo(val).click([10], Outside.increaseWorker);
			$('<div>').addClass('upBtn').appendTo(val).click([1], Outside.increaseWorker);
			$('<div>').addClass('dnBtn').appendTo(val).click([1], Outside.decreaseWorker);
			$('<div>').addClass('dnManyBtn').appendTo(val).click([10], Outside.decreaseWorker);
		}

		$('<div>').addClass('clear').appendTo(row);

		var tooltip = $('<div>').addClass('tooltip bottom right').appendTo(row);
		var income = Outside._INCOME[key];
		for(var s in income.stores) {
			var r = $('<div>').addClass('storeRow');
			$('<div>').addClass('row_key').text(_(s)).appendTo(r);
			$('<div>').addClass('row_val').text(Engine.getIncomeMsg(income.stores[s], income.delay)).appendTo(r);
			r.appendTo(tooltip);
		}

		return row;
	},

	increaseWorker: function(btn) {
		var worker = $(this).closest('.workerRow').attr('key');
		if(Outside.getNumArtists() > 0) {
			var increaseAmt = Math.min(Outside.getNumArtists(), btn.data);
			Engine.log('increasing ' + worker + ' by ' + increaseAmt);
			$SM.add('game.workers["'+worker+'"]', increaseAmt);
		}
	},

	decreaseWorker: function(btn) {
		var worker = $(this).closest('.workerRow').attr('key');
		if($SM.get('game.workers["'+worker+'"]') > 0) {
			var decreaseAmt = Math.min($SM.get('game.workers["'+worker+'"]') || 0, btn.data);
			Engine.log('decreasing ' + worker + ' by ' + decreaseAmt);
			$SM.add('game.workers["'+worker+'"]', decreaseAmt * -1);
		}
	},

	updateVillageRow: function(name, num, village) {
		var id = 'building_row_' + name.replace(' ', '-');
		var row = $('div#' + id, village);
		if(row.length === 0 && num > 0) {
			row = $('<div>').attr('id', id).addClass('storeRow');
			$('<div>').addClass('row_key').text(_(name)).appendTo(row);
			$('<div>').addClass('row_val').text(num).appendTo(row);
			$('<div>').addClass('clear').appendTo(row);
			var curPrev = null;
			village.children().each(function(i) {
				var child = $(this);
				if(child.attr('id') != 'population') {
					var cName = child.attr('id').substring(13).replace('-', ' ');
					if(cName < name && (curPrev == null || cName > curPrev)) {
						curPrev = cName;
					}
				}
			});
			if(curPrev == null) {
				row.prependTo(village);
			} else {
				row.insertAfter('#building_row_' + curPrev.replace(' ', '-'));
			}
		} else if(num > 0) {
			$('div#' + row.attr('id') + ' > div.row_val', village).text(num);
		} else if(num === 0) {
			row.remove();
		}
	},

	updateVillage: function(ignoreStores) {
		var village = $('div#village');
		var population = $('div#population');
		var needsAppend = false;
		if(village.length === 0) {
			needsAppend = true;
			village = $('<div>').attr('id', 'village').css('opacity', 0);
			population = $('<div>').attr('id', 'population').appendTo(village);
		}

		for(var k in $SM.get('game.buildings')) {
			if(k == 'trap') {
				var numTraps = $SM.get('game.buildings["'+k+'"]');
				var numBait = $SM.get('stores.bait', true);
				var traps = numTraps - numBait;
				traps = traps < 0 ? 0 : traps;
				Outside.updateVillageRow(k, traps, village);
				Outside.updateVillageRow('baited trap', numBait > numTraps ? numTraps : numBait, village);
			} else {
				if(Outside.checkWorker(k)) {
					Outside.updateWorkersView();
				}
				Outside.updateVillageRow(k, $SM.get('game.buildings["'+k+'"]'), village);
			}
		}
		/// TRANSLATORS : pop is short for population.
		population.text(_('pop ') + $SM.get('game.population') + '/' + this.getMaxPopulation());

		var hasPeeps;
		if($SM.get('game.buildings["studio"]', true) === 0) {
			hasPeeps = false;
			village.addClass('noStudios');
		} else {
			hasPeeps = true;
			village.removeClass('noStudios');
		}

		if(needsAppend && village.children().length > 1) {
			village.appendTo('#outsidePanel');
			village.animate({opacity:1}, 300, 'linear');
		}

		if(hasPeeps && typeof Outside._popTimeout == 'undefined') {
			Outside.schedulePopIncrease();
		}

		this.setTitle();

		if(!ignoreStores && Engine.activeModule === Outside && village.children().length > 1) {
			$('#storesContainer').css({top: village.height() + 26 + Outside._STORES_OFFSET + 'px'});
		}
	},

	checkWorker: function(name) {
		var jobMap = {
			'office': ['influencer', 'intern'],
			'social media': ['marketer'],
			'sales pipeline': ['salesperson'],
			'iron mine': ['iron miner'],
			'coal mine': ['coal miner'],
			'sulphur mine': ['sulphur miner'],
			'steelworks': ['steelworker'],
			'armoury' : ['armourer']
		};

		var jobs = jobMap[name];
		var added = false;
		if(typeof jobs == 'object') {
			for(var i = 0, len = jobs.length; i < len; i++) {
				var job = jobs[i];
				if(typeof $SM.get('game.buildings["'+name+'"]') == 'number' &&
						typeof $SM.get('game.workers["'+job+'"]') != 'number') {
					Engine.log('adding ' + job + ' to the workers list');
					$SM.set('game.workers["'+job+'"]', 0);
					added = true;
				}
			}
		}
		return added;
	},

	updateVillageIncome: function() {
		for(var worker in Outside._INCOME) {
			var income = Outside._INCOME[worker];
			var num = worker == 'artist' ? Outside.getNumArtists() : $SM.get('game.workers["'+worker+'"]');
			if(typeof num == 'number') {
				var stores = {};
				if(num < 0) num = 0;
				var tooltip = $('.tooltip', 'div#workers_row_' + worker.replace(' ', '-'));
				tooltip.empty();
				var needsUpdate = false;
				var curIncome = $SM.getIncome(worker);
				for(var store in income.stores) {
					stores[store] = income.stores[store] * num;
					if(curIncome[store] != stores[store]) needsUpdate = true;
					var row = $('<div>').addClass('storeRow');
					$('<div>').addClass('row_key').text(_(store)).appendTo(row);
					$('<div>').addClass('row_val').text(Engine.getIncomeMsg(stores[store], income.delay)).appendTo(row);
					row.appendTo(tooltip);
				}
				if(needsUpdate) {
					$SM.setIncome(worker, {
						delay: income.delay,
						stores: stores
					});
				}
			}
		}
		Room.updateIncomeView();
	},

	updateTrapButton: function() {
		var btn = $('div#trapsButton');
		if($SM.get('game.buildings["trap"]', true) > 0) {
			if(btn.length === 0) {
				new Button.Button({
					id: 'trapsButton',
					text: _("check traps"),
					click: Outside.checkTraps,
					cooldown: Outside._TRAPS_DELAY,
					width: '80px'
				}).appendTo('div#outsidePanel');
			} else {
				Button.setDisabled(btn, false);
			}
		} else {
			if(btn.length > 0) {
				Button.setDisabled(btn, true);
			}
		}
	},

	setTitle: function() {
		var numStudios = $SM.get('game.buildings["studio"]', true);
		var title;
		if(numStudios === 0) {
			title = _("A New Space");
		} else if(numStudios == 1) {
			title = _("A Lonely Studio");
		} else if(numStudios <= 4) {
			title = _("An Art Collective");
		} else if(numStudios <= 8) {
			title = _("A Vanity Gallery");
		} else if(numStudios <= 14) {
			title = _("A Commercial Gallery");
		} else {
			title = _("A Museum");
		}

		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('#location_outside').text(title);
	},

	onArrival: function(transition_diff) {
		Outside.setTitle();
		if(!$SM.get('game.outside.seenForest')) {
			Notifications.notify(Outside, _("a new space, ah, the possibilities are endless..."));
			$SM.set('game.outside.seenForest', true);
		}
		Outside.updateTrapButton();
		Outside.updateVillage(true);

		Engine.moveStoresView($('#village'), transition_diff);
	},

	gatherArtwork: function() {
		Notifications.notify(Outside, _("artists are scattered all over the city, so many artworks to collect"));
		var gatherAmt = $SM.get('game.buildings["cart"]', true) > 0 ? 50 : 10;
		$SM.add('stores.artwork', gatherAmt);
	},

	checkTraps: function() {
		var drops = {};
		var msg = [];
		var numTraps = $SM.get('game.buildings["trap"]', true);
		var numBait = $SM.get('stores.bait', true);
		var numDrops = numTraps + (numBait < numTraps ? numBait : numTraps);
		for(var i = 0; i < numDrops; i++) {
			var roll = Math.random();
			for(var j in Outside.TrapDrops) {
				var drop = Outside.TrapDrops[j];
				if(roll < drop.rollUnder) {
					var num = drops[drop.name];
					if(typeof num == 'undefined') {
						num = 0;
						msg.push(drop.message);
					}
					drops[drop.name] = num + 1;
					break;
				}
			}
		}
        /// TRANSLATORS : Mind the whitespace at the end.
		var s = _('the traps contain ');
		for(var i = 0, len = msg.length; i < len; i++) {
			if(len > 1 && i > 0 && i < len - 1) {
				s += ", ";
			} else if(len > 1 && i == len - 1) {
                /// TRANSLATORS : Mind the whitespaces at the beginning and end.
				s += _(" and ");
			}
			s += msg[i];
		}

		var baitUsed = numBait < numTraps ? numBait : numTraps;
		drops['bait'] = -baitUsed;

		Notifications.notify(Outside, s);
		$SM.addM('stores', drops);
	},

	handleStateUpdates: function(e){
		if(e.category == 'stores'){
			Outside.updateVillage();
		} else if(e.stateName.indexOf('game.workers') === 0 || e.stateName.indexOf('game.population') === 0){
			Outside.updateVillage();
			Outside.updateWorkersView();
			Outside.updateVillageIncome();
		};
	},

	scrollSidebar: function(direction, reset) {

		if( typeof reset != "undefined" ){
			$('#village').css('top', '0px');
			$('#storesContainer').css('top', '224px');
			Outside._STORES_OFFSET = 0;
			return false;
		}

		var momentum = 10;

		// If they hit up, we scroll everything down
		if( direction == 'up' )
			momentum = momentum * -1;

		/* Let's stop scrolling if the top or bottom bound is in the viewport, based on direction */
		if( direction == 'down' && inView( direction, $('#village') ) ){

			return false;

		}else if( direction == 'up' && inView( direction, $('#storesContainer') ) ){

			return false;

		}

		scrollByX( $('#village'), momentum );
		scrollByX( $('#storesContainer'), momentum );
		Outside._STORES_OFFSET += momentum;

	}
};
