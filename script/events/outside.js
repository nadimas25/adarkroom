/**
 * Events that can occur when the Outside module is active
 **/
Events.Outside = [
	{ /* Ruined traps */
	title: _('A Ruined Trap'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.buildings["trap"]', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					_('some of the traps have been torn apart.'),
					_('large prints lead away, into the forest.')
				],
				onLoad: function() {
					var numWrecked = Math.floor(Math.random() * $SM.get('game.buildings["trap"]', true)) + 1;
					$SM.add('game.buildings["trap"]', -numWrecked);
					Outside.updateVillage();
					Outside.updateTrapButton();
				},
				notification: _('some traps have been destroyed'),
				blink: true,
				buttons: {
					'track': {
						text: _('track them'),
						nextScene: {0.5: 'nothing', 1: 'catch'}
					},
					'ignore': {
						text: _('ignore them'),
						nextScene: 'end'
					}
				}
			},
			'nothing': {
				text: [
					_('the tracks disappear after just a few minutes.'),
					_('the forest is silent.')
				],
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			},
			'catch': {
				text: [
					_('not far from the village lies a large beast, its fur matted with blood.'),
					_('it puts up little resistance before the knife.')
				],
				reward: {
					clout: 100,
					leads: 100,
					experience: 10
				},
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			}
		}
	},
	{
		title: _('Unhappiness'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.buildings["studio"]', true) > 0 && $SM.get('game.population', true) > 5;
		},
		scenes: {
			'start': {
				text: [
					_('unhappiness spreads through one of the studio.'),
					_('all artists in the studio have left.')
				],
				notification: _('unhappiness is spreading'),
				blink: true,
				onLoad: function() {
					var population = $SM.get('game.population', true);
					var studios = $SM.get('game.buildings["studio"]', true);
					$SM.set('game.buildings["studio"]', (huts - 1));
					Outside.killVillagers(4);
				},
				buttons: {
					'mourn': {
						text: _('mourn'),
						notification: _('some artists have been lost'),
						nextScene: 'end'
					}
				}
			}
		}
	},
	{ /* Sickness */
		title: _('Sickness'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.population', true) > 10 && $SM.get('game.population', true) < 50 && $SM.get('stores.medicine', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					_('a sickness is spreading through the village.'),
					_('medicine is needed immediately.')
				],

				blink: true,
				buttons: {
					'heal': {
						text: _('1 medicine'),
						cost: { 'medicine' : 1 },
						nextScene: {1: 'healed'}
					},
					'ignore': {
						text: _('ignore it'),
						nextScene: {1: 'death'}
					}
				}
			},
			'healed': {
				text: [
					_('the sickness is cured in time.')
				],
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			},
			'death': {
				text: [
					_('the sickness spreads through the village.'),
					_('the days are spent with burials.'),
					_('the nights are rent with screams.')
				],
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * 20) + 1;
					Outside.killVillagers(numKilled);
				},
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			}
		}
	},

	{ /* Plague */
		title: _('Plague'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.population', true) > 50 && $SM.get('stores.medicine', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					_('a terrible plague is fast spreading through the village.'),
					_('medicine is needed immediately.')
				],
				blink: true,
				buttons: {
					/* Because there is a serious need for medicine, the price is raised. */
					'buyMedicine': {
						text: _('buy medicine'),
						cost: { 'scales': 70,
								'experience': 50 },
						reward: { 'medicine': 1 }
					},
					'heal': {
						text: _('5 medicine'),
						cost: { 'medicine' : 5 },
						nextScene: {1: 'healed'}
					},
					'ignore': {
						text: _('do nothing'),
						nextScene: {1: 'death'}
					}
				}
			},
			'healed': {
				text: [
					_('the plague is kept from spreading.'),
					_('only a few die.'),
					_('the rest bury them.')
				],
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * 5) + 2;
					Outside.killVillagers(numKilled);
				},
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			},
			'death': {
				text: [
					_('the plague rips through the village.'),
					_('the nights are rent with screams.'),
					_('the only hope is a quick death.')
				],
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * 80) + 10;
					Outside.killVillagers(numKilled);
				},
				buttons: {
					'end': {
						text: _('go home'),
						nextScene: 'end'
					}
				}
			}
		}
	},

	{ /* Gallery attack */
		title: _('A Gallery Attacks'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.population', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					 _('workers from a commercial gallery blitz you, trying to lure your artists away.'),
					 _('the fight is short and costly, but the gallerists are repelled.'),
					 _('the artists retreat to mourn those who were lost to exploitation.')
				],
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * 10) + 1;
					Outside.killVillagers(numKilled);
				},
				reward: {
					clout: 100,
					leads: 100,
					experience: 10
				},
				blink: true,
				buttons: {
					'end': {
						text: _('back to work'),
						nextScene: 'end'
					}
				}
			}
		}
	},

	{ /* Start-up attack */
		title: _('Instagram Attacks'),
		isAvailable: function() {
			return Engine.activeModule == Outside && $SM.get('game.population', true) > 0 && $SM.get('game.cityCleared');
		},
		scenes: {
			'start': {
				text: [
					_('an email chain is making its rounds.'),
					_('Instagram employees have found a way to get your artist\'s contact info.'),
					_('after threat of a lawsuit, they are driven away, but not without losses.')
				],
				onLoad: function() {
					var numKilled = Math.floor(Math.random() * 40) + 1;
					Outside.killVillagers(numKilled);
				},
				reward: {
					bullets: 10,
					'money': 50
				},

				blink: true,
				buttons: {
					'end': {
						text: _('back to work'),
						nextScene: 'end'
					}
				}
			}
		}
	}
];
