var MainMenu = $hxClasses["MainMenu"] = function(game,stage) {
	this.displayCityActivation = 0;
	this.deletedCurSave = false;
	this.premiumButton = null;
	this.premiumBadge = null;
	this.fullscreenButton = null;
	this.totalTimeOnMenu = 0;
	var _gthis = this;
	this.game = game;
	this.stage = stage;
	this.language = Settings.language;
	var cityStage = new PIXI.Container();
	stage.addChild(cityStage);
	this.bgCity = new City(game,cityStage,Config.isSnowThemed ? "displayCitySnow" : "displayCity",true,"___");
	this.bottomButtonStage = new PIXI.Container();
	stage.addChild(this.bottomButtonStage);
	this.visibilityGraphics = new PIXI.Graphics();
	this.bottomButtonStage.addChild(this.visibilityGraphics);
	this.visibilityGraphics.alpha = 0;
	this.infoStage = new PIXI.Container();
	stage.addChild(this.infoStage);
	this.unscaledStage = new PIXI.Container();
	this.unscaledStage.scale.set(game.scaling / game.get_preDPIAdjustScaling(),game.scaling / game.get_preDPIAdjustScaling());
	stage.parent.addChild(this.unscaledStage);
	this.titleSprite = new PIXI.Sprite(Resources.getTexture("spr_title"));
	this.titleSprite.anchor.x = 0.5;
	this.infoStage.addChild(this.titleSprite);
	if(Config.hasPremium() && 5 == 8) {
		this.premiumBadge = new PIXI.Sprite(Resources.getTexture("spr_badge_premium"));
		this.premiumBadge.position.set(-(Math.floor(this.titleSprite.width) / 2 | 0) - 1,27);
		this.titleSprite.addChild(this.premiumBadge);
	}
	this.versionText = new graphics_BitmapText("",{ font : "Arial", tint : 16777215});
	this.versionText.alpha = 0.6;
	this.versionText.get_anchor().x = 0;
	this.versionText.get_anchor().y = 1;
	this.infoStage.addChild(this.versionText);
	this.bottomButtons = [];
	this.bottomButtonOnClick = new haxe_ds_ObjectMap();
	this.bottomButtonOnHover = new haxe_ds_ObjectMap();
	this.bottomButtonOnRight = new haxe_ds_ObjectMap();
	this.bottomButtonAttract = new haxe_ds_ObjectMap();
	this.otherButtons = [];
	var musicSprite = Resources.getTexturesByWidth("spr_music",14);
	var musicOffButtonSprite = new PIXI.Sprite(musicSprite[Settings.musicOn ? 0 : 1]);
	this.musicOffButton = { theSprite : musicOffButtonSprite, onClick : function() {
		game.audio.changeMusicEnabledness(!Settings.musicOn);
		musicOffButtonSprite.texture = musicSprite[Settings.musicOn ? 0 : 1];
	}, onHover : function() {
		_gthis.gui.tooltip.setText(_gthis.musicOffButton,Settings.musicOn ? common_Localize.lo("mute_music") : common_Localize.lo("unmute_music"));
	}};
	this.bottomButtonStage.addChild(this.musicOffButton.theSprite);
	this.otherButtons.push(this.musicOffButton);
	var soundSprite = Resources.getTexturesByWidth("spr_sound",14);
	var soundOffButtonSprite = new PIXI.Sprite(soundSprite[Settings.soundOn ? 0 : 1]);
	this.soundOffButton = { theSprite : soundOffButtonSprite, onClick : function() {
		game.audio.changeSoundEnabledness(!Settings.soundOn);
		soundOffButtonSprite.texture = soundSprite[Settings.soundOn ? 0 : 1];
	}, onHover : function() {
		_gthis.gui.tooltip.setText(_gthis.soundOffButton,Settings.soundOn ? common_Localize.lo("mute_sfx") : common_Localize.lo("unmute_sfx"));
	}};
	this.bottomButtonStage.addChild(this.soundOffButton.theSprite);
	this.otherButtons.push(this.soundOffButton);
	if(Config.hasFullscreen && !game.isMobile) {
		var fullscreenSprite = Resources.getTexture("spr_fullscreen");
		var fullscreenButtonSprite = new PIXI.Sprite(fullscreenSprite);
		this.fullscreenButton = { theSprite : fullscreenButtonSprite, onClick : function() {
		}, onHover : function() {
			_gthis.gui.tooltip.setText(_gthis.creditsButton,common_Localize.lo("full_screen"));
			game.setOnClickTo = function() {
				jsFunctions.goFullscreen(true);
			};
		}};
		this.bottomButtonStage.addChild(this.fullscreenButton.theSprite);
		this.otherButtons.push(this.fullscreenButton);
	}
	var imageButtonToUse = "spr_button_small";
	var imageOffsetToUse = 2;
	if(game.isMobile) {
		imageButtonToUse = "spr_button_medium";
		imageOffsetToUse = 4;
	}
	var moreSettingsSprite = Resources.getTexture("spr_moresettings");
	var moreSettingsButtonSprite = new PIXI.Sprite(moreSettingsSprite);
	var doCreateMoreSettingsWindow = null;
	doCreateMoreSettingsWindow = function() {
		_gthis.gui.createWindow("moreSettingsWindow");
		_gthis.gui.addWindowToStack(doCreateMoreSettingsWindow);
		gui_MoreSettingsWindow.create(_gthis.bgCity,_gthis.gui,_gthis.gui.innerWindowStage,_gthis.gui.windowInner,imageButtonToUse,imageOffsetToUse,false);
	};
	this.moreSettingsButton = { theSprite : moreSettingsButtonSprite, onClick : doCreateMoreSettingsWindow, onHover : function() {
		_gthis.gui.tooltip.setText(_gthis.moreSettingsButton,common_Localize.lo("advanced_settings"));
	}};
	this.bottomButtonStage.addChild(this.moreSettingsButton.theSprite);
	this.otherButtons.push(this.moreSettingsButton);
	var creditsSprite = Resources.getTexture("spr_credits");
	var creditsButtonSprite = new PIXI.Sprite(creditsSprite);
	var doCreateCreditsWindow = null;
	doCreateCreditsWindow = function() {
		_gthis.gui.createWindow("creditsWindow");
		_gthis.gui.addWindowToStack(doCreateCreditsWindow);
		gui_CreditsWindow.create(null,_gthis.gui,_gthis.gui.innerWindowStage,_gthis.gui.windowInner);
	};
	this.creditsButton = { theSprite : creditsButtonSprite, onClick : doCreateCreditsWindow, onHover : function() {
		_gthis.gui.tooltip.setText(_gthis.creditsButton,common_Localize.lo("credits"));
	}};
	this.bottomButtonStage.addChild(creditsButtonSprite);
	this.otherButtons.push(this.creditsButton);
	this.rightBadges = [];
	var twitterButtonImage = Resources.getTexture("spr_twitter");
	var twitterButtonSprite = new PIXI.Sprite(twitterButtonImage);
	this.twitterButton = { theSprite : twitterButtonSprite, onClick : function() {
	}, onHover : function() {
		_gthis.gui.tooltip.setText(_gthis.creditsButton,common_Localize.lo("follow_me_twitter"));
		game.setOnClickTo = function() {
			window.open("https://twitter.com/FlorianStrien","_blank");
		};
	}};
	this.bottomButtonStage.addChild(this.twitterButton.theSprite);
	this.otherButtons.push(this.twitterButton);
	var mailingButtonImage = Resources.getTexture("spr_mailinglist");
	var mailingButtonSprite = new PIXI.Sprite(mailingButtonImage);
	this.mailingButton = { theSprite : mailingButtonSprite, onClick : function() {
	}, onHover : function() {
		_gthis.gui.tooltip.setText(_gthis.creditsButton,common_Localize.lo("mailing_list_info"),common_Localize.lo("mailing_list_header"));
		game.setOnClickTo = function() {
			window.open(Config.mailingListURL,"_blank");
		};
	}};
	this.bottomButtonStage.addChild(this.mailingButton.theSprite);
	this.otherButtons.push(this.mailingButton);
	if(game.isMobile) {
		var discordButtonImage = Resources.getTexture("spr_discord");
		var discordButtonSprite = new PIXI.Sprite(discordButtonImage);
		this.discordButton = { theSprite : discordButtonSprite, onClick : function() {
		}, onHover : function() {
			_gthis.gui.tooltip.setText(_gthis.creditsButton,common_Localize.lo("join_discord"));
			game.setOnClickTo = function() {
				window.open("https://florianvanstrien.nl/discord.php","_blank");
			};
		}};
		this.bottomButtonStage.addChild(this.discordButton.theSprite);
		this.otherButtons.push(this.discordButton);
	}
	if(!game.isMobile && !Main.isIPadVersionOnAMac) {
		var discordButtonSprite = new PIXI.Sprite(Resources.getTexture("discord_badge"));
		var discordButton = { sprite : discordButtonSprite, url : "https://florianvanstrien.nl/discord.php"};
		this.rightBadges.push(discordButton);
		this.unscaledStage.addChild(discordButtonSprite);
		if(Config.isLimitedDemo) {
			var steamButtonSprite = new PIXI.Sprite(Resources.getTexture("steam_badge2"));
			var steamButton = { sprite : steamButtonSprite, url : "https://store.steampowered.com/app/1180130/The_Final_Earth_2/"};
			this.rightBadges.push(steamButton);
			this.unscaledStage.addChild(steamButtonSprite);
		}
	}
	var guiStage = new PIXI.Container();
	stage.addChild(guiStage);
	this.gui = new gui_MainMenuGUI(game,guiStage);
	this.resize();
	this.positionUIElements();
	this.siteLogo = null;
	common_Storage.getItem("__meta__mostRecentlyPlayed",function(err,result) {
		var initialPlay = false;
		var belowButtonBottom = null;
		if(err || result == null) {
			var bb = _gthis.addBottomButton("- " + common_Localize.lo("click_here_to_play") + " -",function() {
				game.newCity("theLostShip","0");
				Config.doPlay();
				Analytics.sendEvent("game","play_initial");
				Analytics.sendEventFirebase("playInitial","","");
				if((5 == 6 || 5 == 9) && Config.hadFullStepWithInput) {
					common_AdHelper.showNonRewardedInterstitialIfAllowed();
				}
			},null,"Arial18");
			_gthis.bottomButtonAttract.set(bb,true);
			var baseFont = game.isMobile ? "Arial18" : "Arial16";
			var bb = _gthis.addBottomButton("- " + common_Localize.lo("played_before") + " -",function() {
				_gthis.gui.doCreatePlayedBeforeWindow(function() {
				});
				Analytics.sendEventFirebase("playedBefore","","");
			},null,baseFont);
			belowButtonBottom = bb;
			if(5 != 3) {
				bb.set_tint(10526896);
			}
			if(!common_Storage.storageSupported()) {
				_gthis.showErrorWithImportButton(common_Localize.lo("no_saves_warning"));
			}
			initialPlay = true;
		} else {
			var baseFont = game.isMobile ? "Arial18" : "Arial16";
			if(result != "DELETED_SAVE") {
				_gthis.addBottomButton("- " + common_Localize.lo("continue") + " -",function() {
					if(!_gthis.deletedCurSave) {
						game.loadFromStorage(result);
						Config.doPlay();
						Analytics.sendEvent("game","continue");
						Analytics.sendEventFirebase("continueGame","","");
						if((5 == 6 || 5 == 9) && Config.hadFullStepWithInput) {
							common_AdHelper.showNonRewardedInterstitialIfAllowed();
						}
					} else {
						var createThisWindow = null;
						createThisWindow = function() {
							_gthis.gui.showSimpleWindow(common_Localize.lo("deleted_save"),null,true);
							_gthis.gui.addWindowToStack(createThisWindow,true);
							_gthis.gui.setWindowReload(createThisWindow);
						};
						createThisWindow();
					}
				},null,baseFont);
			}
			_gthis.addBottomButton("- " + common_Localize.lo("new_city") + " -",function() {
				_gthis.gui.createPlayWindow(function() {
				});
				if((5 == 6 || 5 == 9) && Config.hadFullStepWithInput) {
					common_AdHelper.showNonRewardedInterstitialIfAllowed();
				}
			},null,baseFont);
			belowButtonBottom = _gthis.addBottomButton("- " + common_Localize.lo("load_city") + " -",function() {
				var game1 = game;
				var _gthis1 = _gthis.gui;
				var belowButtonBottom = common_Localize.lo("which_city_to_load");
				var _g = $bind(game,game.loadFromStorage);
				gui_SaveLoadWindows.createLoadWindow(game1,_gthis1,belowButtonBottom,function(fileName) {
					_g(fileName);
				});
				if((5 == 6 || 5 == 9) && Config.hadFullStepWithInput) {
					common_AdHelper.showNonRewardedInterstitialIfAllowed();
				}
			},null,baseFont);
			if(Config.get_enableCrossPromo()) {
				_gthis.addBottomButton("- " + common_Localize.lo("play_other") + " -",function() {
					jsFunctions.showCrossPromoDisplay(true);
				});
			}
		}
		if(5 == 3) {
			_gthis.addBottomButton("- " + common_Localize.lo("play_more_games") + " -",function() {
			},null,null,function() {
				game.setOnClickTo = function() {
					window.open("http://armor.ag/MoreGames","_blank");
				};
			});
			_gthis.addBottomButton("- " + common_Localize.lo("like_us") + " -",function() {
			},null,null,function() {
				game.setOnClickTo = function() {
					window.open("http://www.facebook.com/ArmorGames","_blank");
				};
			});
		}
		if(5 == 8 && !Config.hasPremium() || Config.isStoreTest) {
			var _gthis1 = _gthis;
			var tmp = initialPlay ? common_Localize.lo("store") : common_Localize.lo("get_premium");
			_gthis.premiumButton = _gthis1.addBottomButton(tmp,function() {
				gui_infoWindows_StoreInfo.createWindow(_gthis.gui);
			},true);
			if(belowButtonBottom.get_textWidth() / 2 + _gthis.premiumButton.get_textWidth() > game.rect.width / 2 - _gthis.gui.safeAreaRight - 5) {
				_gthis.premiumButton.set_text(common_Localize.lo("store"));
			}
		}
		_gthis.addBottomButton("- " + common_Localize.lo("steam_workshop") + " -",function() {
			game.createOrCloseSteamOverlay();
		});
		_gthis.addBottomButton("- " + common_Localize.lo("exit") + " -",function() {
			window.close();
		});
		_gthis.positionUIElements();
		if(common_AdHelper.showEUConsent == 1) {
			if(Settings.euAdConsentStatus == -1) {
				gui_infoWindows_GDPRWindow.createWindow(_gthis.gui,false);
			}
		}
		if(game.metaGame.hasWonScenario("hippiecommune")) {
			common_Achievements.achieve("STORY_HIPPIECOMMUNE_WIN");
		}
	});
	common_PokiHelpers.reportStopGameplay();
};
MainMenu.__name__ = "MainMenu";
MainMenu.__interfaces__ = [GameState];
MainMenu.prototype = {
	get_publicGUI: function() {
		return this.gui;
	}
	,addBottomButton: function(text,onClick,showOnRight,font,onHover) {
		if(font == null) {
			font = "Arial16";
		}
		if(showOnRight == null) {
			showOnRight = false;
		}
		var bottomButton = new graphics_BitmapText(text,{ font : showOnRight ? "Arial" : font, tint : showOnRight ? 13684944 : 16777215});
		this.bottomButtonStage.addChild(bottomButton);
		this.bottomButtons.push(bottomButton);
		this.bottomButtonOnClick.set(bottomButton,onClick);
		this.bottomButtonOnHover.set(bottomButton,onHover);
		this.bottomButtonOnRight.set(bottomButton,showOnRight);
		this.bottomButtonAttract.set(bottomButton,false);
		return bottomButton;
	}
	,positionUIElements: function() {
		var _gthis = this;
		this.visibilityGraphics.clear();
		this.titleSprite.position.x = this.game.rect.width / 2;
		this.titleSprite.position.y = 10;
		this.visibilityGraphics.beginFill(0,0.5);
		this.visibilityGraphics.drawRect(0,0,this.game.rect.width,20 + this.titleSprite.height);
		this.visibilityGraphics.endFill();
		var highestBottom = this.game.rect.height;
		this.versionText.position.x = 1;
		this.versionText.position.y = this.game.rect.height;
		var yy = this.game.rect.height - 10;
		var yy1 = 16 + (this.game.isMobile ? 3 : 0);
		var _g = [];
		var _g1 = 0;
		var _g2 = this.bottomButtons;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(!_gthis.bottomButtonOnRight.h[v.__id__]) {
				_g.push(v);
			}
		}
		var yy2 = yy - yy1 * _g.length;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.bottomButtons;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(!_gthis.bottomButtonOnRight.h[v.__id__] && v.get_fontName() == "Arial18") {
				_g.push(v);
			}
		}
		var val1 = _g.length - 1;
		var yy = yy2 - 3 * (0 > val1 ? 0 : val1) - this.gui.safeAreaBottom;
		var yyRight = this.game.rect.height;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.bottomButtons;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(_gthis.bottomButtonOnRight.h[v.__id__]) {
				_g.push(v);
			}
		}
		var yyRight1 = yyRight - 14 * _g.length - this.gui.safeAreaBottom;
		var anyRightBadge = false;
		var val1 = yy - 7;
		if(highestBottom >= val1) {
			highestBottom = val1;
		}
		if(this.rightBadges != null && this.rightBadges.length > 0) {
			var badgeYY = 0.0;
			if(this.siteLogo == null) {
				yyRight1 = 2;
			} else {
				yyRight1 -= 3;
			}
			var _g = 0;
			var _g1 = this.rightBadges;
			while(_g < _g1.length) {
				var badge = _g1[_g];
				++_g;
				anyRightBadge = true;
				badge.sprite.position.set((this.game.rect.width - 10) * this.game.get_preDPIAdjustScaling() - badge.sprite.width,(this.game.rect.height - 10) * this.game.get_preDPIAdjustScaling() - badge.sprite.height - badgeYY);
				badgeYY += 14 + badge.sprite.height;
				if(this.siteLogo != null) {
					yyRight1 -= Math.ceil((14 + badge.sprite.height) / this.game.get_preDPIAdjustScaling());
				}
			}
			var val1 = this.game.rect.height - 10 - badgeYY / this.game.get_preDPIAdjustScaling() | 0;
			if(highestBottom >= val1) {
				highestBottom = val1;
			}
		}
		var _g = 0;
		var _g1 = this.bottomButtons;
		while(_g < _g1.length) {
			var bottomButton = _g1[_g];
			++_g;
			if(this.bottomButtonOnRight.h[bottomButton.__id__]) {
				var tmp = this.game.rect.width - bottomButton.get_textWidth() - 3;
				bottomButton.position.x = tmp - this.gui.safeAreaRight;
				bottomButton.position.y = yyRight1;
				yyRight1 += 16;
			} else {
				var tmp1 = this.game.rect.width / 2;
				var tmp2 = bottomButton.get_textWidth() / 2;
				bottomButton.position.x = tmp1 - tmp2;
				bottomButton.position.y = yy;
				if(this.game.isMobile) {
					yy += 3;
				}
				if(bottomButton.get_fontName() == "Arial18") {
					yy += 19;
				} else {
					yy += 16;
				}
			}
		}
		var yPosSmallButtons = this.game.rect.height - 24 - this.gui.safeAreaBottom;
		var offset = 10 + this.gui.safeAreaLeft;
		var _this_x = offset;
		var _this_y = yPosSmallButtons;
		var tmp = new PIXI.Point(_this_x,_this_y);
		this.musicOffButton.theSprite.position = tmp;
		var _this_x = offset += 22;
		var _this_y = yPosSmallButtons;
		var tmp = new PIXI.Point(_this_x,_this_y);
		this.soundOffButton.theSprite.position = tmp;
		offset += 22;
		if(this.fullscreenButton != null) {
			var _this_x = offset;
			var _this_y = yPosSmallButtons;
			var tmp = new PIXI.Point(_this_x,_this_y);
			this.fullscreenButton.theSprite.position = tmp;
			offset += 22;
		}
		if(this.moreSettingsButton != null) {
			var _this_x = offset;
			var _this_y = yPosSmallButtons;
			var tmp = new PIXI.Point(_this_x,_this_y);
			this.moreSettingsButton.theSprite.position = tmp;
			offset += 22;
		}
		offset += 10;
		var yOffset = 0;
		if(this.game.isMobile) {
			yOffset = -24;
			offset = 10 + this.gui.safeAreaLeft;
		}
		var _this_x = offset;
		var _this_y = yPosSmallButtons + yOffset;
		var tmp = new PIXI.Point(_this_x,_this_y);
		this.creditsButton.theSprite.position = tmp;
		offset += 22;
		var _this_x = offset;
		var _this_y = yPosSmallButtons + yOffset;
		var tmp = new PIXI.Point(_this_x,_this_y);
		this.twitterButton.theSprite.position = tmp;
		var _this_x = offset += 22;
		var _this_y = yPosSmallButtons + yOffset;
		var tmp = new PIXI.Point(_this_x,_this_y);
		this.mailingButton.theSprite.position = tmp;
		offset += 22;
		if(this.game.isMobile) {
			offset = 10 + this.gui.safeAreaLeft;
			yOffset = -48;
			var _this_x = offset;
			var _this_y = yPosSmallButtons + yOffset;
			var tmp = new PIXI.Point(_this_x,_this_y);
			this.discordButton.theSprite.position = tmp;
			offset += 22;
		}
		var val1 = yPosSmallButtons + yOffset - 10;
		if(highestBottom >= val1) {
			highestBottom = val1;
		}
		if(this.siteLogo != null) {
			var _this_x = this.game.rect.width * this.game.scaling - 10;
			var _this_y = 10;
			var tmp = new PIXI.Point(_this_x,_this_y);
			this.siteLogo.position = tmp;
		}
		this.visibilityGraphics.beginFill(0,0.5);
		this.visibilityGraphics.drawRect(0,highestBottom,this.game.rect.width,this.game.rect.height);
		this.visibilityGraphics.endFill();
		this.visibilityGraphicsYStart = 20 + this.titleSprite.height;
		this.visibilityGraphicsYEnd = highestBottom;
		try {
			if(MainMenu.fireBaseReportScale != 0) {
				Analytics.sendEventFirebase("ABTEST","scalingInitial",MainMenu.fireBaseReportScale == 2 ? "1" : "0");
				MainMenu.fireBaseReportScale = 0;
			}
		} catch( _g ) {
		}
	}
	,showError: function(err) {
		this.gui.showSimpleWindow(err);
	}
	,showErrorWithImportButton: function(text) {
		var _gthis = this;
		this.gui.createWindow();
		this.gui.windowAddInfoText(text);
		this.gui.windowAddBottomButtons([{ text : common_Localize.lo("import") + "...", onHover : function() {
			_gthis.game.setOnClickTo = function() {
				var importButton = window.document.getElementById("importFile");
				importButton.value = "";
				importButton.click();
				_gthis.game.onClick = null;
			};
		}, action : function() {
		}}]);
	}
	,handleMouse: function(mouse) {
		if(this.gui.handleMouse(mouse)) {
			var _g = 0;
			var _g1 = this.bottomButtons;
			while(_g < _g1.length) {
				var bottomButton = _g1[_g];
				++_g;
				bottomButton.alpha = 0.7;
			}
			var _g = 0;
			var _g1 = this.otherButtons;
			while(_g < _g1.length) {
				var otherButton = _g1[_g];
				++_g;
				otherButton.theSprite.alpha = 0.7;
			}
			return true;
		}
		if(this.bottomButtonStage.visible) {
			var _g = 0;
			var _g1 = this.bottomButtons;
			while(_g < _g1.length) {
				var bottomButton = _g1[_g];
				++_g;
				if(mouse.get_x() >= bottomButton.position.x && mouse.get_x() <= bottomButton.position.x + bottomButton.get_textWidth() && mouse.get_y() > bottomButton.position.y + 2 && mouse.get_y() <= bottomButton.position.y + bottomButton.get_textHeight()) {
					switch(mouse.claimMouse(bottomButton)._hx_index) {
					case 0:
						bottomButton.alpha = 1;
						break;
					case 1:
						bottomButton.alpha = 1;
						this.bottomButtonStage.visible = false;
						this.bottomButtonOnClick.h[bottomButton.__id__]();
						Audio.get().playSound(Audio.get().buttonSound);
						break;
					case 2:
						bottomButton.alpha = 0.85;
						break;
					}
					if(this.bottomButtonOnHover.h[bottomButton.__id__] != null) {
						this.bottomButtonOnHover.h[bottomButton.__id__]();
					}
				} else {
					bottomButton.alpha = 0.7 + (this.bottomButtonAttract.h[bottomButton.__id__] ? 0.30000000000000004 * Math.sin(this.totalTimeOnMenu * 0.08) : 0);
				}
			}
			var _g = 0;
			var _g1 = this.otherButtons;
			while(_g < _g1.length) {
				var otherButton = _g1[_g];
				++_g;
				if(mouse.get_x() >= otherButton.theSprite.position.x && mouse.get_x() < otherButton.theSprite.position.x + otherButton.theSprite.width && mouse.get_y() >= otherButton.theSprite.position.y && mouse.get_y() < otherButton.theSprite.position.y + otherButton.theSprite.height) {
					switch(mouse.claimMouse(otherButton)._hx_index) {
					case 0:
						otherButton.theSprite.alpha = 1;
						break;
					case 1:
						otherButton.theSprite.alpha = 1;
						if(otherButton.onClick != null) {
							otherButton.onClick();
						}
						Audio.get().playSound(Audio.get().buttonSound);
						break;
					case 2:
						otherButton.theSprite.alpha = 0.85;
						break;
					}
					if(otherButton.onHover != null) {
						otherButton.onHover();
					}
				} else {
					otherButton.theSprite.alpha = 0.7;
				}
			}
			var _g = 0;
			var _g1 = this.rightBadges;
			while(_g < _g1.length) {
				var badge = [_g1[_g]];
				++_g;
				if(mouse.get_x() * this.game.get_preDPIAdjustScaling() >= badge[0].sprite.position.x && mouse.get_x() * this.game.get_preDPIAdjustScaling() < badge[0].sprite.position.x + badge[0].sprite.width && mouse.get_y() * this.game.get_preDPIAdjustScaling() >= badge[0].sprite.position.y && mouse.get_y() * this.game.get_preDPIAdjustScaling() < badge[0].sprite.position.y + badge[0].sprite.height) {
					this.game.setOnClickTo = (function(badge) {
						return function() {
							if(badge[0].url.indexOf("steam") != -1 && 5 == 5) {
								greenworks.activateGameOverlayToWebPage(badge[0].url);
							} else {
								window.open(badge[0].url,"_blank");
							}
						};
					})(badge);
					if(badge[0].altTextures != null) {
						badge[0].sprite.texture = mouse.down ? badge[0].altTextures[2] : badge[0].altTextures[1];
					}
				} else if(badge[0].altTextures != null) {
					badge[0].sprite.texture = badge[0].altTextures[0];
				}
			}
		} else if(this.gui.window != null && this.gui.windowRelatedTo == "privacyWindow") {
			if(mouse.pressed) {
				this.gui.goPreviousWindow();
				Audio.get().playSound(Audio.get().buttonSound);
			}
		}
		var tmp = this.siteLogo != null && this.siteLogo.visible && this.siteLogo.parent != null;
		if(mouse.pressed && mouse.get_y() > this.visibilityGraphicsYStart && mouse.get_y() < this.visibilityGraphicsYEnd && (!this.game.isMobile || this.game.isLargeMobile)) {
			this.clickDisplayCity();
		}
		return false;
	}
	,update: function(timeMod) {
		if(this.game.keyboard.anyBack() && this.gui.window == null) {
			window.close();
			return;
		}
		this.updateDisplayCity(timeMod);
		this.bgCity.update(timeMod);
		this.gui.update(timeMod);
		var tmp = this.gui.window == null && !jsFunctions.crossPromoIsVisible();
		this.bottomButtonStage.visible = tmp;
		var tmp = this.gui.window == null && !jsFunctions.crossPromoIsVisible();
		this.unscaledStage.visible = tmp;
		if(this.siteLogo != null) {
			var tmp = this.gui.window == null && !jsFunctions.crossPromoIsVisible();
			this.siteLogo.visible = tmp;
		}
		this.totalTimeOnMenu += timeMod;
		if(!Config.hasPremium()) {
			if(this.premiumBadge != null) {
				this.premiumBadge.visible = false;
				this.premiumBadge = null;
			}
		}
	}
	,updateDisplayCity: function(timeMod) {
		if(this.displayCityActivation > 0) {
			this.displayCityActivation = Math.min(1,this.displayCityActivation + timeMod * 0.025);
			this.visibilityGraphics.alpha = this.displayCityActivation;
		} else {
			this.bgCity.simulation.time.timeSinceStart = 0;
		}
	}
	,clickDisplayCity: function() {
		return;
	}
	,postDraw: function() {
		this.bgCity.postDraw();
	}
	,resize: function() {
		this.bottomButtonStage.scale.x = this.bottomButtonStage.scale.y = this.game.scaling;
		this.infoStage.scale.x = this.infoStage.scale.y = this.game.scaling;
		var tmp = this.game.scaling;
		var tmp1 = this.game.get_preDPIAdjustScaling();
		this.unscaledStage.scale.x = this.unscaledStage.scale.y = tmp / tmp1;
		this.bgCity.resize();
		this.gui.resize();
		this.positionUIElements();
	}
	,refocus: function() {
		this.bgCity.refocus();
	}
	,stop: function() {
		this.bgCity.stop();
		this.unscaledStage.destroy();
	}
	,pause: function() {
	}
	,resume: function() {
	}
	,onContextRestored: function() {
		this.bgCity.onContextRestored();
	}
	,__class__: MainMenu
};
