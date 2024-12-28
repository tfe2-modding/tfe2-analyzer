var gui_MoreSettingsWindow = $hxClasses["gui.MoreSettingsWindow"] = function() { };
gui_MoreSettingsWindow.__name__ = "gui.MoreSettingsWindow";
gui_MoreSettingsWindow.create = function(city,gui,stage,thisWindow,imageButtonToUse,imageOffsetToUse,showCitySpecific) {
	var game = city.game;
	gui.windowAddTitleText(common_Localize.lo("advanced_settings"));
	var languageButton = null;
	var privacyButton = null;
	var doConfirmLanguage = null;
	doConfirmLanguage = function() {
		gui.windowOnDestroy = null;
		gui.createWindow("doConfirmLanguage");
		gui.addWindowToStack(doConfirmLanguage);
		gui.setWindowReload(doConfirmLanguage);
		gui_LanguageSelectWindow.create(city,gui,gui.innerWindowStage,gui.windowInner);
	};
	languageButton = new gui_TextButton(gui,stage,thisWindow,doConfirmLanguage,common_Localize.lo("language"));
	thisWindow.addChild(languageButton);
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,4)));
	var slider1 = new gui_Slider(gui,stage,thisWindow,function() {
		return Settings.musicVolume;
	},function(f) {
		Settings.musicVolume = f;
		Settings.save();
		game.audio.setVolumeLevels();
	});
	slider1.addChild(new gui_TextElement(slider1,stage,common_Localize.lo("music_volume")));
	thisWindow.addChild(slider1);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	var slider2 = new gui_Slider(gui,stage,thisWindow,function() {
		return Settings.soundVolume;
	},function(f) {
		Settings.soundVolume = f;
		Settings.save();
		game.audio.setVolumeLevels();
	});
	slider2.addChild(new gui_TextElement(slider2,stage,common_Localize.lo("sound_effect_volume")));
	thisWindow.addChild(slider2);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	if(5 == 8 && Config.hasRemoveAds()) {
		gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,function() {
			Settings.boostHidden = !Settings.boostHidden;
			Settings.save();
		},function() {
			return Settings.boostHidden;
		},common_Localize.lo("hide_boost_button"));
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	}
	if(Config.canHavePremium()) {
		gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,function() {
			Settings.colorBlindMode = !Settings.colorBlindMode;
			Settings.save();
		},function() {
			return Settings.colorBlindMode;
		},common_Localize.lo("color_blind_mode"));
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	}
	gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,function() {
		Settings.disableClouds = !Settings.disableClouds;
		Settings.save();
	},function() {
		return Settings.disableClouds;
	},common_Localize.lo("disable_clouds_background"));
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,function() {
		Settings.disablePlanets = !Settings.disablePlanets;
		Settings.save();
	},function() {
		return Settings.disablePlanets;
	},common_Localize.lo("disable_planets_background"));
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	var unlimitedButton = null;
	var storeButton = null;
	if(showCitySpecific && city.progress.story.canHaveUnlimitedResources() && (Config.get_allowUnlimitedResources() || city.progress.sandbox.unlimitedResources)) {
		var doConfirmUnlimited = null;
		doConfirmUnlimited = function() {
			gui.windowOnDestroy = null;
			gui.createWindow("confirmUnlimited");
			gui.addWindowToStack(doConfirmUnlimited);
			var enableResourcesWarning = "";
			enableResourcesWarning = "\n" + common_Localize.lo("unlimited_resources_disables_achievements");
			gui.windowAddTitleText(!city.progress.sandbox.unlimitedResources ? common_Localize.lo("enable_unlimited_resources") : common_Localize.lo("disable_unlimited_resources"));
			gui.windowAddInfoText(!city.progress.sandbox.unlimitedResources ? common_Localize.lo("play_unlimited") + enableResourcesWarning : common_Localize.lo("stop_play_unlimited"));
			gui.windowAddBottomButtons([{ text : common_Localize.lo("yes"), action : function() {
				if(city.progress.sandbox.unlimitedResources) {
					city.progress.sandbox.disableUnlimitedResources();
				} else {
					city.progress.sandbox.enableUnlimitedResources();
				}
				gui.goPreviousWindow();
			}}]);
		};
		unlimitedButton = new gui_TextButton(gui,stage,thisWindow,doConfirmUnlimited,common_Localize.lo("unlimited"));
		thisWindow.addChild(unlimitedButton);
		if(!game.isMobile) {
			unlimitedButton.extraWidth = 18;
		}
		unlimitedButton.setText(!city.progress.sandbox.unlimitedResources ? common_Localize.lo("enable_unlimited_resources") : common_Localize.lo("disable_unlimited_resources"));
		thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,4)));
	}
	if(5 == 8) {
		storeButton = new gui_TextButton(gui,stage,thisWindow,function() {
			gui.windowOnDestroy = null;
			gui_infoWindows_StoreInfo.createWindow(gui);
		},common_Localize.lo("visit_store"));
		thisWindow.addChild(storeButton);
		thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,4)));
		if(!Config.hasPremium() && !common_AdHelper.knownNotInEU) {
			var createPrivacyWindow = function() {
				gui_infoWindows_GDPRWindow.createWindow(gui,true);
			};
			privacyButton = new gui_TextButton(gui,stage,thisWindow,createPrivacyWindow,common_Localize.lo("privacy"));
			thisWindow.addChild(privacyButton);
			thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,4)));
		}
	}
	if(!game.isMobile) {
		var threadLimitController = new gui_GUIContainer(gui,stage,thisWindow);
		threadLimitController.direction = gui_GUIContainerDirection.Vertical;
		var threadLimitController2 = new gui_GUIContainer(gui,stage,thisWindow);
		threadLimitController2.direction = gui_GUIContainerDirection.Horizontal;
		threadLimitController2.padding.bottom = 6;
		var threadLimitText = new gui_TextElement(threadLimitController,stage,common_Localize.lo("pathfinding_thread_limit") + " ");
		threadLimitText.handleMouseFunction = function(mouse) {
			if(threadLimitText.rect.contains(mouse.position)) {
				gui.tooltip.setText(null,common_Localize.lo("pathfinding_thread_limit_explain"));
				return true;
			}
			return false;
		};
		threadLimitText.padding.top = 1;
		threadLimitController2.addChild(threadLimitText);
		threadLimitController2.addChild(new gui_GUISpacing(threadLimitController2,new common_Point(4,2)));
		var gui1 = gui;
		var numberSelectControl = Settings.pathfindingWorkers;
		var numberSelectControl1 = common_Localize.lo("reset_pathfinding_limit");
		var numberSelectControl2 = new gui_NumberSelectControl(gui1,stage,threadLimitController2,{ left : 0, right : 0, top : 0, bottom : 0},function() {
			return 1;
		},function() {
			return 15;
		},numberSelectControl,function(v) {
			Settings.pathfindingWorkers = v;
			city.simulation.pathfinder.setWorkerNumber(v,true);
			Settings.save();
		},function() {
			return Settings.resetPathfindingWorkers();
		},numberSelectControl1);
		threadLimitController2.addChild(numberSelectControl2);
		threadLimitController.addChild(threadLimitController2);
		thisWindow.addChild(threadLimitController);
	}
	if(game.isMobile || Main.isIPadVersionOnAMac) {
		var uiScaleController = new gui_GUIContainer(gui,stage,thisWindow);
		uiScaleController.direction = gui_GUIContainerDirection.Vertical;
		var uiScaleController2 = new gui_GUIContainer(gui,stage,thisWindow);
		uiScaleController2.direction = gui_GUIContainerDirection.Horizontal;
		if(game.scaling >= 3.999) {
			uiScaleController2.padding.bottom = 4;
		} else {
			uiScaleController2.padding.bottom = 6;
		}
		var uiScaleText = new gui_TextElement(uiScaleController,stage,common_Localize.lo("reduce_ui_size") + " ");
		uiScaleText.handleMouseFunction = function(mouse) {
			if(uiScaleText.rect.contains(mouse.position)) {
				return true;
			}
			return false;
		};
		uiScaleText.padding.top = 1;
		uiScaleController2.addChild(uiScaleText);
		uiScaleController2.addChild(new gui_GUISpacing(uiScaleController2,new common_Point(4,2)));
		var numberSelectControl = new gui_NumberSelectControl(gui,stage,uiScaleController2,{ left : 0, right : 0, top : 0, bottom : 0},function() {
			return 0;
		},function() {
			var val2 = Math.ceil((game.application.scaling - Main.scalingMod - 1) / 2);
			if(val2 > 1) {
				return val2;
			} else {
				return 1;
			}
		},-Main.scalingMod,function(v) {
			Main.scalingMod = -v;
			game.application.setGameScale();
			Settings.save();
		},function() {
			return 0;
		},"");
		uiScaleController2.addChild(numberSelectControl);
		uiScaleController.addChild(uiScaleController2);
		thisWindow.addChild(uiScaleController);
		if(game.scaling >= 3.999) {
			gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,function() {
				Settings.allowMoreZoom = !Settings.allowMoreZoom;
				Settings.save();
			},function() {
				return Settings.allowMoreZoom;
			},common_Localize.lo("allow_zooming_out_further"));
			gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
		}
	}
	thisWindow.addChild(new gui_TextElement(thisWindow,gui.innerWindowStage,common_Localize.lo("have_or_want_code")));
	var secretButtonDiv = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	var doCreateSecretInputWindow = null;
	doCreateSecretInputWindow = function() {
		gui.windowOnDestroy = null;
		gui.createWindow("secretWindow");
		gui.addWindowToStack(doCreateSecretInputWindow);
		gui_SecretCodeWindow.create(city,gui,gui.innerWindowStage,gui.windowInner);
	};
	var secretButton = new gui_TextButton(gui,stage,gui.windowInner,doCreateSecretInputWindow,common_Localize.lo("input_code"));
	secretButton.extraHeight += 3;
	secretButton.extraTextPosY += 1;
	secretButton.setText(common_Localize.lo("input_code"));
	secretButtonDiv.addChild(secretButton);
	secretButtonDiv.addChild(new gui_GUISpacing(secretButtonDiv,new common_Point(2,4)));
	var thisButtonImage = Resources.getTexture("spr_mailinglist");
	var imgButton = new gui_ImageButton(gui,stage,secretButtonDiv,function() {
	},thisButtonImage,function() {
		return false;
	},function() {
		gui.tooltip.setText(imgButton,common_Localize.lo("mailing_list_help_2"),common_Localize.lo("mailing_list_header"));
		game.setOnClickTo = function() {
			window.open(Config.mailingListURL,"_blank");
		};
	},null,imageButtonToUse,imageOffsetToUse);
	imgButton.imageSprite.tint = 0;
	secretButtonDiv.addChild(imgButton);
	thisWindow.addChild(secretButtonDiv);
	thisWindow.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	if(languageButton != null) {
		languageButton.fillWidth();
	}
	if(game.isMobile) {
		if(unlimitedButton != null) {
			unlimitedButton.fillWidth();
		}
		if(storeButton != null) {
			storeButton.fillWidth();
		}
		if(privacyButton != null) {
			privacyButton.fillWidth();
		}
	}
	gui.windowAddBottomButtons();
	gui.windowOnDestroy = function() {
		if(((game.state) instanceof MainMenu)) {
			if(game.state.language != Settings.language) {
				game.createMainMenu();
			}
		}
	};
};
