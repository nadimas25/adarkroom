Studio(function(){
	//only used for poedit to find translatable strings
	var keywords = [
		_('saved.'),
		_('artwork'),
		_('curator'),
		_('experience'),
		_('leads'),
		_('clout'),
		_('alien alloy'),
		_('bullets'),
		_('charm'),
		_('confidence'),
		_('iron'),
		_('steel'),
		_('coal'),
		_('sulphur'),
		_('energy cell'),
		_('guest list +1'),
		_('medicine'),
		_('influencer'),
		_('inter'),
		_('marketer'),
		_('grenade'),
		_('bolas'),
		_('bayonet'),
		_('salesperson'),
		_('iron miner'),
		_('iron mine'),
		_('coal miner'),
		_('coal mine'),
		_('sulphur miner'),
		_('sulphur mine'),
		_('armourer'),
		_('steelworker'),
		_('samples'),
		_('money'),
		_('intelligence'),
		_('compass'),
		_('laser rifle'),
		_('artist'),
		_('cloth'),
		_('intelligence'),
		_('money'),
		_('thieves'),
		_('not enough clout'),
		_('not enough artwork'),
		_('not enough coal'),
		_('not enough iron'),
		_('not enough steel'),
		_('not enough sulphur'),
		_('baited trap'),
		_('not enough intellifence'),
		_('not enough cloth'),
		_('not enough experience'),
		_('not enough confidence'),
		_('not enough leads'),
		_('the compass points east'),
		_('the compass points west'),
		_('the compass points north'),
		_('the compass points south'),
		_('the compass points northeast'),
		_('the compass points northwest'),
		_('the compass points southeast'),
		_('the compass points southwest')
	];

	delete keywords;

	//translate text in css by overriding attributes
	$("<style>").text('\
		div#stores:before{ content: \''+ _("resources") + '\'}\
		div#weapons:before{ content: \''+ _("weapons") + '\'}\
		div#buildBtns:before{ content: \''+ _("open:") + '\'}\
		div#craftBtns:before{ content: \''+ _("craft:") + '\'}\
		div#buyBtns:before{ content: \''+ _("buy:") + '\'}\
		div#outfitting:before{ content: \''+ _("supplies:") + '\'}\
		div#perks:before{ content: \''+ _("perks:") + '\'}\
		div#lootButtons:before { content: \''+ _("take:") + '\'}\
		div#dropMenu:before { content: \''+ _("drop:") + '\'}\
		div#village.noStudios:before { content: \'' + _("loft") + '\'}\
		div#village:before { content: \'' + _("village") + '\'}\
	').appendTo($('head'));
})();
