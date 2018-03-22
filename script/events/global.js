/**
 * Events that can occur when any module is active (Except World. It's special.)
 **/
Events.Global = [
	{ /* Plagiarist */
		title: _('The Plagiarist'),
		isAvailable: function() {
			return (Engine.activeModule == Room || Engine.activeModule == Outside) && $SM.get('game.thieves') == 1;
		},
		scenes: {
			'start': {
				text: [
					_('people show you images of another artist\'s artwork.'),
					_("they say one of your own has been ripping this artist off."),
					_('say he shouldn\'t be invited to exhibit anymore.')
				],
				notification: _('a plagiarist is caught'),
				blink: true,
				buttons: {
					'exile': {
						text: _('exhile him'),
						nextScene: {1: 'exhile'}
					},
					'forgive': {
						text: _('forgive him'),
						nextScene: {1: 'forgive'}
					}
				}
			},
			'exhile': {
				text: [
					_('everyone deletes him from their contacts and social media. the point is made'),
					_('in the next few days, embarrassed and ashamed, he deactivates his Instagram.')
				],
				onLoad: function() {
					$SM.set('game.thieves', 2);
					$SM.remove('income.thieves');
					$SM.addPerk('stealthy');

				},
				buttons: {
					'leave': {
						text: _('leave'),
						nextScene: 'end'
					}
				}
			},
			'forgive': {
				text: [
					_("the artist appreciates your mercy. promises to make you a bunch of money"),
					_("turns out he is a liar, should never have trusted him. he is never heard from again")
				],
				onLoad: function() {
					$SM.set('game.thieves', 2);
					$SM.remove('income.thieves');
					$SM.addM('stores', $SM.get('game.stolen'));
				},
				buttons: {
					'leave': {
						text: _('leave'),
						nextScene: 'end'
					}
				}
			}
		}
	}
];
