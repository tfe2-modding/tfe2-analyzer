var gui_GameMenu = $hxClasses["gui.GameMenu"] = function() { };
gui_GameMenu.__name__ = "gui.GameMenu";
gui_GameMenu.create = function(gui,city) {
	var imageButtonToUse = "spr_button_small";
	var imageOffsetToUse = 2;
	if(city.game.isMobile) {
		imageButtonToUse = "spr_button_medium";
		imageOffsetToUse = 4;
	}
	gui.createWindow("gameMenu");
	gui.clearWindowStack();
	var gui1 = gui;
	var city1 = city;
	var tmp = function() {
		gui_GameMenu.create(gui1,city1);
	};
	gui.addWindowToStack(tmp,true,"GameMenu");
	gui.windowAddTitleText(common_Localize.lo("game_menu"));
	if(5 == 8) {
		city.gui.pauseForWindow();
	}
	common_PokiHelpers.reportStopGameplay();
	var stage = gui.innerWindowStage;
	gui.windowAddInfoText(null,function() {
		if(common_Storage.storageSupported()) {
			return common_Localize.lo("last_saved",[common_MathExtensions.floatFormat(Math,city.secondsSinceAutoSave,1)]);
		} else {
			return common_Localize.lo("temp_save");
		}
	});
	var saveLoadButtons = new gui_GUIContainer(gui,stage,null,new common_Point(0,0),new common_FPoint(0,0));
	saveLoadButtons.addChild(new gui_TextButton(gui,stage,saveLoadButtons,function() {
		gui_SaveLoadWindows.createSaveWindow(city.game,gui,common_Localize.lo("use_save_slot"),function(fileName) {
			city.saveToOtherSaveSlot(fileName,function() {
				if(city.cityMainFile == city.cityFile) {
					city.cityFile = fileName;
				} else {
					city.cityFile = fileName + HxOverrides.substr(city.cityFile,city.cityMainFile.length,null);
				}
				city.cityMainFile = fileName;
				city.saveToBrowserStorage();
			});
		});
	},common_Localize.lo("save_command")));
	saveLoadButtons.addChild(new gui_GUISpacing(saveLoadButtons,new common_Point(2,2)));
	saveLoadButtons.addChild(new gui_TextButton(gui,stage,saveLoadButtons,function() {
		gui_SaveLoadWindows.createLoadWindow(city.game,gui,common_Localize.lo("which_city_load"),function(fileName) {
			city.game.loadFromStorage(fileName);
		});
		if((5 == 6 || 5 == 9) && Config.hadFullStepWithInput) {
			common_AdHelper.showNonRewardedInterstitialIfAllowed();
		}
	},common_Localize.lo("load_command")));
	saveLoadButtons.addChild(new gui_GUISpacing(saveLoadButtons,new common_Point(2,2)));
	var finishSave = function(saveFile) {
		jsFunctions.saveAs(new Blob([saveFile],{ type : "text/plain;charset=utf-8"}),"theFinalEarth2_save.sav");
	};
	if(!city.game.isMobile || !jsFunctions.isAnyApple() || 5 == 8) {
		saveLoadButtons.addChild(new gui_TextButton(gui,stage,saveLoadButtons,function() {
			if(city.subCities.length > 0) {
				city.saveAllSubCitiesToString(finishSave);
			} else {
				finishSave(city.saveToString());
			}
		},common_Localize.lo("export")));
		saveLoadButtons.addChild(new gui_GUISpacing(saveLoadButtons,new common_Point(2,2)));
	}
	saveLoadButtons.addChild(new gui_TextButton(gui,stage,saveLoadButtons,function() {
	},common_Localize.lo("import_command"),null,function() {
		city.game.setOnClickTo = function() {
			common_MobileApplicationLifecycleManager.registerPlannedFocusLoss();
			var importButton = window.document.getElementById("importFile");
			importButton.value = "";
			importButton.click();
			city.game.onClick = null;
		};
	}));
	gui.windowInner.addChild(saveLoadButtons);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	var fullReset = new gui_GUIContainer(gui,stage,null,new common_Point(0,0),new common_FPoint(0,0));
	var newGameButton = new gui_TextButton(gui,stage,fullReset,function() {
		gui_MainMenuGUI.createNewScenarioWindow(city.game,gui);
		if((5 == 6 || 5 == 9) && Config.hadFullStepWithInput) {
			common_AdHelper.showNonRewardedInterstitialIfAllowed();
		}
	},common_Localize.lo("new_city"));
	newGameButton.setText(common_Localize.lo("new_city"));
	fullReset.addChild(newGameButton);
	fullReset.addChild(new gui_GUISpacing(fullReset,new common_Point(2,2)));
	var winGoal = city.progress.story.findGoal("Win");
	if(city.progress.story.currentGoal == null && winGoal != null && winGoal.nextStory != null && winGoal.nextStory != "" && progress_StoryLoader.hasCompletedRequirements(city.game,Lambda.find(Resources.allStoriesInfo,function(sd) {
		return sd.link == winGoal.nextStory;
	}))) {
		var textButton = new gui_TextButton(gui,stage,saveLoadButtons,function() {
			var city1 = city.game;
			var city2 = city.gui;
			var textButton = common_Localize.lo("use_save_slot_2");
			var _g = ($_=city.game,$bind($_,$_.newCity));
			var storyName = winGoal.nextStory;
			gui_SaveLoadWindows.createSaveWindow(city1,city2,textButton,function(saveFileName) {
				_g(storyName,saveFileName);
			});
			if((5 == 6 || 5 == 9) && Config.hadFullStepWithInput) {
				common_AdHelper.showNonRewardedInterstitialIfAllowed();
			}
		},common_Localize.lo("next_scenario"),null);
		fullReset.addChild(textButton);
		textButton.setText(common_Localize.lo("next_scenario"));
	} else {
		var doFullReset = null;
		doFullReset = function() {
			gui.createWindow();
			gui.addWindowToStack(doFullReset);
			gui.windowAddTitleText(common_Localize.lo("restart_scenario_question"));
			gui.windowAddInfoText(common_Localize.lo("sure_restart"));
			gui.windowAddBottomButtons([{ text : common_Localize.lo("restart"), action : function() {
				city.saveToBrowserStorage("preReset");
				city.game.newCity(city.progress.story.storyName,city.cityFile);
				city.saveToBrowserStorage();
				gui_GameMenu.canUndoReset = true;
			}}]);
			if((5 == 6 || 5 == 9) && Config.hadFullStepWithInput) {
				common_AdHelper.showNonRewardedInterstitialIfAllowed();
			}
		};
		fullReset.addChild(new gui_TextButton(gui,stage,saveLoadButtons,doFullReset,common_Localize.lo("restart_scenario"),null));
	}
	gui.windowInner.addChild(fullReset);
	if(gui_GameMenu.canUndoReset) {
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
		var fullResetUndo = new gui_GUIContainer(gui,stage,null,new common_Point(0,0),new common_FPoint(0,0));
		fullResetUndo.addChild(new gui_TextButton(gui,stage,fullReset,function() {
			common_Storage.getItem("preReset",function(err,savedCity) {
				gui_GameMenu.canUndoReset = false;
				if(err == null || savedCity != null) {
					city.game.loadFromTypedArray(savedCity,city.cityFile);
				}
			},true);
		},common_Localize.lo("undo_restart"),null));
		gui.windowInner.addChild(fullResetUndo);
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	if(5 == 3) {
		var armorPromo = new gui_GUIContainer(gui,stage,null,new common_Point(0,0),new common_FPoint(0,0));
		var playMoreButton = new gui_TextButton(gui,stage,fullReset,function() {
		},"Play More Games",function() {
			return false;
		},function() {
			city.game.setOnClickTo = function() {
				window.open("http://armor.ag/MoreGames","_blank");
			};
		});
		playMoreButton.extraWidth = 6;
		playMoreButton.setText("Play More Games");
		armorPromo.addChild(playMoreButton);
		armorPromo.addChild(new gui_GUISpacing(armorPromo,new common_Point(2,2)));
		var likeUsButton = new gui_TextButton(gui,stage,fullReset,function() {
		},"Like Us!",function() {
			return false;
		},function() {
			city.game.setOnClickTo = function() {
				window.open("http://www.facebook.com/ArmorGames","_blank");
			};
		});
		likeUsButton.extraWidth = 16;
		likeUsButton.setText("Like Us!");
		armorPromo.addChild(likeUsButton);
		gui.windowInner.addChild(armorPromo);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	}
	newGameButton.extraWidth = gui.windowInner.rect.width - common_ArrayExtensions.isum(fullReset.children,function(ch) {
		return ch.rect.width;
	}) - 4;
	newGameButton.setText();
	var soundButtons = new gui_GUIContainer(gui,stage,null);
	gui.windowInner.addChild(soundButtons);
	var musicTextures = Resources.getTextures("spr_music",2);
	var imgButton = null;
	imgButton = new gui_ImageButton(gui,stage,soundButtons,function() {
		city.game.audio.changeMusicEnabledness(!Settings.musicOn);
		imgButton.imageSprite.texture = musicTextures[Settings.musicOn ? 0 : 1];
	},musicTextures[Settings.musicOn ? 0 : 1],function() {
		return false;
	},function() {
		gui.tooltip.setText(imgButton,Settings.musicOn ? common_Localize.lo("mute_music") : common_Localize.lo("unmute_music"));
	},null,imageButtonToUse,imageOffsetToUse);
	imgButton.imageSprite.tint = 0;
	soundButtons.addChild(imgButton);
	soundButtons.addChild(new gui_GUISpacing(soundButtons,new common_Point(2,2)));
	var soundTextures = Resources.getTextures("spr_sound",2);
	var imgButton1 = null;
	imgButton1 = new gui_ImageButton(gui,stage,soundButtons,function() {
		city.game.audio.changeSoundEnabledness(!Settings.soundOn);
		imgButton1.imageSprite.texture = soundTextures[Settings.soundOn ? 0 : 1];
	},soundTextures[Settings.soundOn ? 0 : 1],function() {
		return false;
	},function() {
		gui.tooltip.setText(imgButton1,Settings.soundOn ? common_Localize.lo("mute_sfx") : common_Localize.lo("unmute_sfx"));
	},null,imageButtonToUse,imageOffsetToUse);
	imgButton1.imageSprite.tint = 0;
	soundButtons.addChild(imgButton1);
	soundButtons.addChild(new gui_GUISpacing(soundButtons,new common_Point(2,2)));
	var moreSettingsTexture = Resources.getTexture("spr_moresettings");
	var imgButton2;
	var doCreateMoreSettingsWindow = null;
	doCreateMoreSettingsWindow = function() {
		gui.createWindow("moreSettingsWindow");
		gui.addWindowToStack(doCreateMoreSettingsWindow);
		gui_MoreSettingsWindow.create(city,gui,gui.innerWindowStage,gui.windowInner,imageButtonToUse,imageOffsetToUse,true);
	};
	imgButton2 = new gui_ImageButton(gui,stage,soundButtons,doCreateMoreSettingsWindow,moreSettingsTexture,function() {
		return false;
	},function() {
		gui.tooltip.setText(imgButton2,common_Localize.lo("advanced_settings"));
	},null,imageButtonToUse,imageOffsetToUse);
	imgButton2.imageSprite.tint = 0;
	soundButtons.addChild(imgButton2);
	soundButtons.addChild(new gui_GUISpacing(soundButtons,new common_Point(6,2)));
	if(Config.hasFullscreen && !city.game.isMobile) {
		var fullScreenTexture = Resources.getTexture("spr_fullscreen");
		var imgButton3 = new gui_ImageButton(gui,stage,soundButtons,function() {
		},fullScreenTexture,function() {
			return false;
		},function() {
			gui.tooltip.setText(imgButton3,common_Localize.lo("full_screen"));
			city.game.setOnClickTo = function() {
				jsFunctions.goFullscreen(true);
			};
		},null,imageButtonToUse,imageOffsetToUse);
		imgButton3.imageSprite.tint = 0;
		soundButtons.addChild(imgButton3);
		soundButtons.addChild(new gui_GUISpacing(soundButtons,new common_Point(2,2)));
	}
	if(!city.game.isMobile || !jsFunctions.isAnyApple() || 5 == 8) {
		var screenshotTexture = Resources.getTexture("spr_camera");
		var screenshotButton;
		var city2 = city;
		var screenshotButton1 = function() {
			gui_GameMenu.saveScreenShot(city2);
		};
		screenshotButton = new gui_ImageButton(gui,stage,soundButtons,screenshotButton1,screenshotTexture,function() {
			return false;
		},function() {
			gui.tooltip.setText(screenshotButton,common_Localize.lo("save_screenshot"));
		},null,imageButtonToUse,imageOffsetToUse);
		screenshotButton.imageSprite.tint = 0;
		soundButtons.addChild(screenshotButton);
		if(Settings.showScreenshotHelpInfo && city.simulation.citizens.length >= 1000) {
			city.gui.showScreenshotHelpInfo(screenshotButton);
			Settings.showScreenshotHelpInfo = false;
			Settings.save();
		}
		soundButtons.addChild(new gui_GUISpacing(soundButtons,new common_Point(6,2)));
	}
	var creditsTexture = Resources.getTexture("spr_credits");
	var imgButton4;
	var doCreateCreditsWindow = null;
	doCreateCreditsWindow = function() {
		gui.createWindow("creditsWindow");
		gui.addWindowToStack(doCreateCreditsWindow);
		gui_CreditsWindow.create(city,gui,gui.innerWindowStage,gui.windowInner);
	};
	imgButton4 = new gui_ImageButton(gui,stage,soundButtons,doCreateCreditsWindow,creditsTexture,function() {
		return false;
	},function() {
		gui.tooltip.setText(imgButton4,common_Localize.lo("view_credits"));
	},null,imageButtonToUse,imageOffsetToUse);
	imgButton4.imageSprite.tint = 0;
	soundButtons.addChild(imgButton4);
	soundButtons.addChild(new gui_GUISpacing(soundButtons,new common_Point(2,2)));
	var twitterButtonImage = Resources.getTexture("spr_twitter");
	var imgButton5 = new gui_ImageButton(gui,stage,soundButtons,function() {
	},twitterButtonImage,function() {
		return false;
	},function() {
		gui.tooltip.setText(imgButton5,common_Localize.lo("follow_me_twitter"));
		city.game.setOnClickTo = function() {
			window.open("https://twitter.com/FlorianStrien","_blank");
		};
	},null,imageButtonToUse,imageOffsetToUse);
	imgButton5.imageSprite.tint = 0;
	soundButtons.addChild(imgButton5);
	soundButtons.addChild(new gui_GUISpacing(soundButtons,new common_Point(2,2)));
	if(!Config.hasFullscreen) {
		var mailingButtonImage = Resources.getTexture("spr_mailinglist");
		var imgButton6 = new gui_ImageButton(gui,stage,soundButtons,function() {
		},mailingButtonImage,function() {
			return false;
		},function() {
			gui.tooltip.setText(imgButton6,common_Localize.lo("mailing_list_info"),common_Localize.lo("mailing_list_header"));
			city.game.setOnClickTo = function() {
				window.open(Config.mailingListURL,"_blank");
			};
		},null,imageButtonToUse,imageOffsetToUse);
		imgButton6.imageSprite.tint = 0;
		soundButtons.addChild(imgButton6);
		soundButtons.addChild(new gui_GUISpacing(soundButtons,new common_Point(2,2)));
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	if(Config.isLimitedDemo) {
		var textButton = new gui_TextButton(gui,stage,gui.windowInner,function() {
			greenworks.activateGameOverlayToWebPage("https://store.steampowered.com/app/1180130/The_Final_Earth_2/");
		},common_Localize.lo("wishlist_full"));
		textButton.fillWidth();
		textButton.setText(common_Localize.lo("wishlist_full"));
		gui.windowInner.addChild(textButton);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	} else if(5 == 4) {
		var textButton = new gui_TextButton(gui,stage,gui.windowInner,function() {
		},"Get the Extended Version!",function() {
			return false;
		},function() {
			city.game.setOnClickTo = function() {
				window.open("https://store.steampowered.com/app/1180130/The_Final_Earth_2/?utm_source=coolmathgames&utm_medium=web&utm_campaign=gamemenu");
			};
		});
		textButton.buttonPatch.tint = 1930651;
		textButton.bitmapText.set_tint(16777215);
		textButton.fillWidth();
		textButton.setText("Get the Extended Version!");
		gui.windowInner.addChild(textButton);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	} else if(city.game.isMobile && false && !Config.hasPremium()) {
		var textButton = new gui_TextButton(gui,stage,gui.windowInner,function() {
			gui_infoWindows_StoreInfo.createWindow(gui);
		},common_Localize.lo("upgrade_premium"));
		gui.windowInner.addChild(textButton);
		textButton.fillWidth();
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	}
	gui.windowAddBottomButtons([{ text : common_Localize.lo("back_to_title"), action : function() {
		city.game.createMainMenu();
	}}]);
};
gui_GameMenu.saveScreenShot = function(city) {
	jsFunctions.detectCanvasSize(function(maxCanvasW,maxCanvasH) {
		var edges = city.getCityEdges();
		var minX = edges.minX;
		var maxX = edges.maxX;
		var minY = edges.minY;
		var maxY = edges.maxY;
		var screenshotCropped = false;
		if(maxX - minX > maxCanvasW) {
			var removeThis = Math.ceil((maxX - minX - maxCanvasW) / 2);
			minX += removeThis;
			maxX -= removeThis;
			screenshotCropped = true;
		}
		if(maxY - minY > maxCanvasH) {
			minY += maxY - minY - maxCanvasH;
			screenshotCropped = true;
		}
		var renderer = city.game.application.renderer;
		var oldX = city.movingViewStage.position.x;
		var oldY = city.movingViewStage.position.y;
		var oldScale = city.movingViewStage.scale.x;
		city.movingViewStage.position.x = -minX;
		city.movingViewStage.position.y = -minY;
		city.movingViewStage.scale.x = 1;
		city.movingViewStage.scale.y = 1;
		var sky = new PIXI.Graphics();
		try {
			sky.beginFill(city.skyColor);
			sky.drawRect(minX,minY,maxX - minX,maxY - minY);
			sky.endFill();
			city.movingViewStage.addChildAt(sky,0);
			city.uncull();
			var renderTexture = PIXI.RenderTexture.create({ width : maxX - minX, height : maxY - minY, scaleMode : 1});
			renderer.render(city.movingViewStage,{ renderTexture : renderTexture, clear : true, skipUpdateTransform : false});
			var canvas = renderer.plugins.extract.canvas(renderTexture);
			canvas.toBlob(function(blob) {
				jsFunctions.saveAs(blob,"TheFinalEarth2_screenshot.png");
				if(screenshotCropped) {
					var createThisWindow = null;
					createThisWindow = function() {
						city.gui.showSimpleWindow(common_Localize.lo("screenshot_size_limit"),null,true);
						city.gui.addWindowToStack(createThisWindow,true);
						city.gui.setWindowReload(createThisWindow);
					};
					createThisWindow();
				}
			});
		} catch( _g ) {
			var e = haxe_Exception.caught(_g);
			console.log("FloatingSpaceCities/gui/GameMenu.hx:471:",e);
			var createThisWindow = null;
			createThisWindow = function() {
				city.gui.showSimpleWindow(common_Localize.lo("save_screenshot_failed"),null,true);
				city.gui.addWindowToStack(createThisWindow,true);
				city.gui.setWindowReload(createThisWindow);
			};
			createThisWindow();
		}
		city.movingViewStage.position.x = oldX;
		city.movingViewStage.position.y = oldY;
		city.movingViewStage.scale.x = city.movingViewStage.scale.y = oldScale;
		sky.destroy();
	});
};
