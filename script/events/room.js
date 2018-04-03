/**
 * Events that can occur when the Room module is active
 **/
Events.Room = [
	{ /* The Sales Rep  --  Merchant */
		title: _('The Sales Rep'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.clout', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					_('a sales rep appears, briefcase in hand and talking on a blutooth headset.'),
					_("says he has materials and resources that can help, for the right price of course")
				],
				notification: _('a sales rep arrives, looking to sell'),
				blink: true,
				buttons: {
					'buyScales': {
						text: _('buy intelligence'),
						cost: { 'clout': 100 },
						reward: { 'intelligence': 1 }
					},
					'buyTeeth': {
						text: _('buy experience'),
						cost: { 'clout': 200 },
						reward: { 'experience': 1 }
					},
					'buySamples': {
						text: _('give free samples'),
						cost: { 'clout': 5 },
						reward: { 'samples': 1 },
						notification: _('discounts are more effective with free samples.')
					},
					'buyCompass': {
						available: function() {
							return $SM.get('stores.compass', true) < 1;
						},
						text: _('buy compass'),
						cost: { fur: 300, scales: 15, teeth: 5 },
						reward: { 'compass': 1 },
						notification: _('the old compass is dented and dusty, but it looks to work.'),
						onChoose: Path.openPath
					},
					'goodbye': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			}
		}
	},
	{ /* Noises Outside  --  gain artworks/clout */
		title: _('Noises'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.artwork');
		},
		scenes: {
			'start': {
				text: [
					_('outside the gallery, shuffling noises can be heard.'),
					_("can't tell what they're up to.")
				],
				notification: _('strange noises can be heard outside the gallery'),
				blink: true,
				buttons: {
					'investigate': {
						text: _('investigate'),
						nextScene: { 0.3: 'stuff', 1: 'nothing' }
					},
					'ignore': {
						text: _('ignore them'),
						nextScene: 'end'
					}
				}
			},
			'nothing': {
				text: [
					_('vague shapes move, just out of sight.'),
					_('the sounds stop.')
				],
				buttons: {
					'backinside': {
						text: _('go back inside'),
						nextScene: 'end'
					}
				}
			},
			'stuff': {
				reward: { artwork: 100, fur: 10 },
				text: [
					_('a bundle of artworks lies just beyond the threshold, the word must be spreading.'),
					_('some poor artists must have left these here. must be hoping for some exposure')
				],
				buttons: {
					'backinside': {
						text: _('go back inside'),
						nextScene: 'end'
					}
				}
			}
		}
	},
	{ /* Noises Inside  --  trade artworks for better good */
		title: _('Noises'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.artwork');
		},
		scenes: {
			start: {
				text: [
					_('scratching noises can be heard from the storage room.'),
					_('something\'s in there.')
				],
				notification: _('something\'s in the store room'),
				blink: true,
				buttons: {
					'investigate': {
						text: _('investigate'),
						nextScene: { 0.8: 'experience', 1: 'cloth' }
					},
					'ignore': {
						text: _('ignore them'),
						nextScene: 'end'
					}
				}
			},
			experience: {
				text: [
					_('some artworks are missing.'),
					_('you\'ve learned a lesson, security is important to prevent theft')
				],
				onLoad: function() {
					var numArtwork = $SM.get('stores.artwork', true);
					numArtwork = Math.floor(numArtwork * 0.1);
					if(numArtwork === 0) numArtwork = 1;
					var numTeeth = Math.floor(numArtwork / 5);
					if(numTeeth === 0) numTeeth = 1;
					$SM.addM('stores', {'artwork': -numArtwork, 'experience': numTeeth});
				},
				buttons: {
					'leave': {
						text: _('leave'),
						nextScene: 'end'
					}
				}
			},
			cloth: {
				text: [
					_('some artworks are missing.'),
					_('the ground is littered with scraps of cloth')
				],
				onLoad: function() {
					var numArtwork = $SM.get('stores.artwork', true);
					numArtwork = Math.floor(numArtwork * 0.1);
					if(numArtwork === 0) numArtwork = 1;
					var numCloth = Math.floor(numArtwork / 5);
					if(numCloth === 0) numCloth = 1;
					$SM.addM('stores', {'artwork': -numArtwork, 'cloth': numCloth});
				},
				buttons: {
					'leave': {
						text: _('leave'),
						nextScene: 'end'
					}
				}
			}
		}
	},
	{ /* The Art Collective  --  trade clout for better good */
		title: _('The Art Collective'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.fur');
		},
		scenes: {
			start: {
				text: [
					_('an art collective arrives.'),
					_('they ask for any spare clout to help with their operation.')
				],
				notification: _('an art collective arrives'),
				blink: true,
				buttons: {
					'50clout': {
						text: _('give 50'),
						cost: {fur: 50},
						nextScene: { 0.5: 'intelligence', 0.8: 'experience', 1: 'cloth' }
					},
					'100clout': {
						text: _('give 100'),
						cost: {fur: 100},
						nextScene: { 0.5: 'experience', 0.8: 'intelligence', 1: 'cloth' }
					},
					'deny': {
						text: _('turn them away'),
						nextScene: 'end'
					}
				}
			},
			intelligence: {
				reward: { intelligence: 20 },
				text: [
					_('the art collective expresses their thanks.'),
					_('leave you with some knowledge they\'ve gained.')
				],
				buttons: {
					'leave': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			},
			experience: {
				reward: { experience: 20 },
				text: [
					_('the art collective expresses their thanks.'),
					_('another meeting under you belt.')
				],
				buttons: {
					'leave': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			},
			cloth: {
				reward: { cloth: 20 },
				text: [
					_('the art collective expresses their thanks.'),
					_('leaves some scraps of cloth behind.')
				],
				buttons: {
					'leave': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			}
		}
	},

	{ /* Art Agent --  artwork gambling */
		title: _('The Art Agent'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.artwork');
		},
		scenes: {
			start: {
				text: [
					_('an art agent emails with a proposition. says if you give her artworks, she\'ll be back with more work'),
					_("curator's not sure she's to be trusted.")
				],
				notification: _('an art agent emails'),
				blink: true,
				buttons: {
					'100artwork': {
						text: _('give 100'),
						cost: {artwork: 100},
						nextScene: { 1: '100artwork'}
					},
					'500artwork': {
						text: _('give 500'),
						cost: {artwork: 500},
						nextScene: { 1: '500artwork' }
					},
					'deny': {
						text: _('turn her away'),
						nextScene: 'end'
					}
				}
			},
			'100artwork': {
				text: [
					_('the agent doesn\'t say anything, she unlocks her blackberry and walk away')
				],
				onLoad: function() {
					if(Math.random() < 0.5) {
						Engine.setTimeout(function() {
							$SM.add('stores.artwork', 300);
							Notifications.notify(Room, _('the agent emails back, she\'s secured many artworks for the gallery.'));
						}, 60 * 1000);
					}
				},
				buttons: {
					'leave': {
						text: _('email thanks'),
						nextScene: 'end'
					}
				}
			},
			'500artwork': {
				text: [
					_('the agent doesn\'t say anything, she unlocks her blackberry and walk away ')
				],
				onLoad: function() {
					if(Math.random() < 0.3) {
						Engine.setTimeout(function() {
							$SM.add('stores.artwork', 1500);
							Notifications.notify(Room, _('the agent emails back, she\'s secured many artworks for the gallery.'));
						}, 60 * 1000);
					}
				},
				buttons: {
					'leave': {
						text: _('email thanks'),
						nextScene: 'end'
					}
				}
			}
		}
	},

	{ /* Marketing Agency  --  clout gambling */
		title: _('The Marketing Agency'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.fur');
		},
		scenes: {
			start: {
				text: [
					_('a marketing agency emails with a proposition. says if they can use some of your hard earned clout, they\'ll be back with more'),
					_("builder's not sure about the brand association.")
				],
				notification: _('a marketing agency emails'),
				blink: true,
				buttons: {
					'100clout': {
						text: _('give 100'),
						cost: {fur: 100},
						nextScene: { 1: '100clout'}
					},
					'500clout': {
						text: _('give 500'),
						cost: {fur: 500},
						nextScene: { 1: '500clout' }
					},
					'deny': {
						text: _('turn them away'),
						nextScene: 'end'
					}
				}
			},
			'100clout': {
				text: [
					_('the agency says thanks, puts your logo on some promotional materials')
				],
				onLoad: function() {
					if(Math.random() < 0.5) {
						Engine.setTimeout(function() {
							$SM.add('stores.fur', 300);
							Notifications.notify(Room, _('the marketing agency\'s campaign pays dividends, clout increases.'));
						}, 60 * 1000);
					}
				},
				buttons: {
					'leave': {
						text: _('email thanks'),
						nextScene: 'end'
					}
				}
			},
			'500clout': {
				text: [
					_('the agency says thanks, puts your logo on some promotional materials')
				],
				onLoad: function() {
					if(Math.random() < 0.3) {
						Engine.setTimeout(function() {
							$SM.add('stores.fur', 1500);
							Notifications.notify(Room, _('the marketing agency\'s campaign pays dividends, clout increases.'));
						}, 60 * 1000);
					}
				},
				buttons: {
					'leave': {
						text: _('email thanks'),
						nextScene: 'end'
					}
				}
			}
		}
	},

	{ /* The Social Climber --  Map Unlocker */
		title: _('The Social Climber'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('features.location.world');
		},
		scenes: {
			'start': {
				text: [
					_("the social climber says she knows every place in the city."),
					_("willing to share her contacts with you, for a price.")
				],
				notification: _('a social climber swings by for an exhibition'),
				blink: true,
				buttons: {
					'buyMap': {
						text: _('get contacts'),
						cost: { 'clout': 200, 'intelligence': 10 },
						notification: _('now you know where to find some of the coolest spots in town'),
						onChoose: World.applyMap
					},
					'learn': {
						text: _('learn networking'),
						cost: { 'clout': 1000, 'intelligence': 50, 'experience': 20 },
						available: function() {
							return !$SM.hasPerk('scout');
						},
						onChoose: function() {
							$SM.addPerk('scout');
						}
					},
					'leave': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			}
		}
	},

	{ /* The Wise Mentor */
		title: _('The Mentor'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('features.location.world');
		},
		scenes: {
			'start': {
				text: [
					_('a wise mentor arrives.'),
					_('she smiles warmly and asks if you\'d like some consultation.')
				],
				notification: _('a wise mentor arrives'),
				blink: true,
				buttons: {
					'agree': {
						text: _('agree'),
						cost: {
							'money': 100,
							'clout': 100,
							'torch': 1
						},
						nextScene: {1: 'agree'}
					},
					'deny': {
						text: _('turn her away'),
						nextScene: 'end'
					}
				}
			},
			'agree': {
				text: [
					_('good call, the mentor offers her wisdom.')
				],
				buttons: {
					'evasion': {
						text: _('evasion'),
						available: function() {
							return !$SM.hasPerk('evasive');
						},
						onChoose: function() {
							$SM.addPerk('evasive');
						},
						nextScene: 'end'
					},
					'precision': {
						text: _('precision'),
						available: function() {
							return !$SM.hasPerk('precise');
						},
						onChoose: function() {
							$SM.addPerk('precise');
						},
						nextScene: 'end'
					},
					'force': {
						text: _('force'),
						available: function() {
							return !$SM.hasPerk('barbarian');
						},
						onChoose: function() {
							$SM.addPerk('barbarian');
						},
						nextScene: 'end'
					},
					'nothing': {
						text: _('nothing'),
						nextScene: 'end'
					}
				}
			}
		}
	},

	{ /* The Sick Man */
		title: _('The Sick Man'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.medicine', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					_("a man hobbles up, coughing."),
					_("he begs for medicine.")
				],
				notification: _('a sick man hobbles up'),
				blink: true,
				buttons: {
					'help': {
						text: _('give 1 medicine'),
						cost: { 'medicine': 1 },
						notification: _('the man swallows the medicine eagerly'),
						nextScene: { 0.1: 'alloy', 0.3: 'cells', 0.5: 'scales', 1.0: 'nothing' }
					},
					'ignore': {
						text: _('tell him to leave'),
						nextScene: 'end'
					}
				}
			},
			'alloy': {
				text: [
					_("the man is thankful."),
					_('he leaves a reward.'),
					_('some weird metal he picked up on his travels.')
				],
				onLoad: function() {
					$SM.add('stores["alien alloy"]', 1);
				},
				buttons: {
					'bye': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			},
			'cells': {
				text: [
					_("the man is thankful."),
					_('he leaves a reward.'),
					_('some weird glowing boxes he picked up on his travels.')
				],
				onLoad: function() {
					$SM.add('stores["energy cell"]', 3);
				},
				buttons: {
					'bye': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			},
			'scales': {
				text: [
					_("the man is thankful."),
					_('he leaves a reward.'),
					_('all he has are some scales.')
				],
				onLoad: function() {
					$SM.add('stores.scales', 5);
				},
				buttons: {
					'bye': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			},
			'nothing': {
				text: [
					_("the man expresses his thanks and hobbles off.")
				],
				buttons: {
					'bye': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			}
		}
	}
];
