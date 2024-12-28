var gui_CityGUI = $hxClasses["gui.CityGUI"] = function(game,outerStage,city) {
	this.persistentFullVersionUpsell = null;
	this.notificationTitleElem = null;
	this.notificationInner = null;
	this.resumeGameControl = null;
	this.gameSpeedOnUse = null;
	this.storyHelpButtonOnUse = null;
	this.hideShowUIButton = null;
	this.cityExtraInfoHidden = false;
	this.simulationSpeedChosen = 0;
	this.workerAssignButton = null;
	this.currentNotificationRelatedTo = null;
	this.materialsInfoScrollY = 0;
	GUI.call(this,game,outerStage);
	if(Config.get_isCoolMathWithCrossPromotion()) {
		this.persistentFullVersionUpsell = new gui_PersistentFullVersionUpsell(this,this.stage);
	}
	this.initSimulationSpeeds();
	this.tooltip = new gui_Tooltip(game,city,this.tooltipStage);
	this.city = city;
	this.cityInfo = new gui_GUIContainer(this,this.stage,null,new common_Point(0,0),new common_FPoint(1,1));
	this.currentUpgradeButtons = new haxe_ds_StringMap();
	this.buildingButtons = new gui_BuildingButtons(this,city);
	this.createCityInfo();
	this.resize();
};
gui_CityGUI.__name__ = "gui.CityGUI";
gui_CityGUI.__super__ = GUI;
gui_CityGUI.prototype = $extend(GUI.prototype,{
	initSimulationSpeeds: function() {
		if(gui_CityGUI.simulationSpeeds == null) {
			gui_CityGUI.simulationSpeeds = [{ speed : 1, icon : Resources.getTexture("spr_icon_play_normalspeed"), tooltipTitle : common_Localize.lo("normal_speed")},{ speed : 1.5, icon : Resources.getTexture("spr_oneandhalfspeed"), tooltipTitle : common_Localize.lo("onepointfive_speed")},{ speed : 2, icon : Resources.getTexture("spr_icon_speedup"), tooltipTitle : common_Localize.lo("double_speed")},{ speed : 0.5, icon : Resources.getTexture("spr_icon_halfspeed"), tooltipTitle : common_Localize.lo("half_speed")},{ speed : 0.75, icon : Resources.getTexture("spr_icon_slightlyslowerspeed"), tooltipTitle : common_Localize.lo("threequarter_speed")}];
		}
	}
	,onLanguageChange: function() {
		GUI.prototype.onLanguageChange.call(this);
		this.tooltip = new gui_Tooltip(this.game,this.city,this.tooltipStage);
	}
	,createWindowInCurrentContext: function(relatedTo,windowBackground) {
		GUI.prototype.createWindow.call(this,relatedTo,windowBackground);
	}
	,refreshCityInfo: function() {
		if(this.materialsInfo != null) {
			this.hideCityInfo();
			this.createCityInfo();
		}
	}
	,createCityInfo: function() {
		this.addHelpAndGameSpeedButtons();
		if(!this.cityExtraInfoHidden) {
			this.addGeneralStatistics();
			this.addAllMaterialsInfo();
		}
	}
	,hideCityInfo: function() {
		if(this.materialsInfo != null) {
			this.materialsInfoScrollY = this.materialsInfo.scrollable.scrollPosition.y;
		}
		this.cityInfo.clear();
		this.materialsInfo = null;
		this.workerAssignButton = null;
		this.hideShowUIButton = null;
		this.woodAmountDisplay = null;
		this.stoneAmountDisplay = null;
		this.storyHelpButton = null;
		this.gameSpeedButton = null;
	}
	,miniButtonToUse: function() {
		if(this.game.isMobile) {
			return "spr_transparentbutton_info_miniplus";
		} else {
			return "spr_transparentbutton_info_mini";
		}
	}
	,addHelpAndGameSpeedButtons: function() {
		var _gthis = this;
		var quickControlButtons = new gui_GUIContainer(this,this.stage,this.cityInfo,null);
		quickControlButtons.alignment = gui_GUIContainerAlignment.RightOrBottom;
		this.cityInfo.addChild(quickControlButtons);
		var hasQuickText = function() {
			return _gthis.city.progress.goalHelp.hasCurrentGoalHelp();
		};
		var createQuickMissionWindow = null;
		createQuickMissionWindow = function() {
			if(_gthis.windowRelatedTo == "quickMissionWindow") {
				_gthis.closeWindow();
			} else if(hasQuickText()) {
				_gthis.city.gui.clearWindowStack();
				_gthis.city.gui.createWindow("quickMissionWindow");
				_gthis.city.gui.addWindowToStack(createQuickMissionWindow);
				if(_gthis.storyHelpButtonOnUse != null) {
					_gthis.storyHelpButtonOnUse();
				}
				gui_CurrentMissionsWindow.create(_gthis.city,_gthis.city.gui,_gthis.city.gui.innerWindowStage,_gthis.city.gui.windowInner);
			}
		};
		this.storyHelpButton = new gui_ImageButton(this,this.stage,quickControlButtons,createQuickMissionWindow,Resources.getTexture("spr_icon_help"),function() {
			return _gthis.windowRelatedTo == "quickMissionWindow";
		},function() {
			if(hasQuickText()) {
				var goalTexts = _gthis.city.progress.goalHelp.getCurrentGoalHelp();
				if(goalTexts.length == 1) {
					_gthis.tooltip.setText(_gthis.storyHelpButton,goalTexts[0].text,goalTexts[0].category == common_Localize.lo("main_goal") ? common_Localize.lo("current_task") : goalTexts[0].category);
				} else {
					var fullGoalTexts = "";
					var _g = 0;
					while(_g < goalTexts.length) {
						var goalText = goalTexts[_g];
						++_g;
						if(fullGoalTexts != "") {
							fullGoalTexts += "\n\n";
						}
						fullGoalTexts += "- " + goalText.category + "\n" + goalText.text;
					}
					_gthis.tooltip.setText(_gthis.storyHelpButton,fullGoalTexts,common_Localize.lo("current_tasks"));
				}
			}
			if(_gthis.storyHelpButtonOnUse != null) {
				_gthis.storyHelpButtonOnUse();
			}
		},null,this.miniButtonToUse(),this.game.isMobile ? 4 : 1);
		this.storyHelpButton.onUpdate = function() {
			if(hasQuickText()) {
				_gthis.storyHelpButton.show();
			} else {
				_gthis.storyHelpButton.hide();
			}
		};
		quickControlButtons.addChild(this.storyHelpButton);
		var pausePlayButton = new gui_ImageButton(this,this.stage,quickControlButtons,function() {
			_gthis.city.set_pauseGame(!_gthis.city.pauseGame);
			if(_gthis.city.pauseGame) {
				common_PokiHelpers.reportStopGameplay();
			} else {
				common_PokiHelpers.reportStartGameplay();
			}
		},Resources.getTexture("spr_icon_pause"),function() {
			return _gthis.city.pauseGame;
		},function() {
			var theAction = _gthis.game.isMobile ? common_StringExtensions.firstToUpper(common_Localize.lo("tap")) : common_Localize.lo("click_or_space");
			if(_gthis.city.pauseGame) {
				_gthis.tooltip.setText(pausePlayButton,theAction + " " + common_Localize.lo("to_unpause"),common_Localize.lo("game_paused"));
			} else {
				_gthis.tooltip.setText(pausePlayButton,theAction + " " + common_Localize.lo("to_pause"),common_Localize.lo("game_running"));
			}
		},null,this.miniButtonToUse(),this.game.isMobile ? 4 : 1);
		quickControlButtons.addChild(pausePlayButton);
		if(Config.cheatSpeedEnabled && !common_ArrayExtensions.any(gui_CityGUI.simulationSpeeds,function(ss) {
			return ss.speed >= 10;
		})) {
			gui_CityGUI.simulationSpeeds.push({ speed : 10, icon : Resources.getTexture("spr_icon_speedup"), tooltipTitle : "Cheat Speed"});
		}
		this.gameSpeedButton = new gui_ImageButton(this,this.stage,quickControlButtons,function() {
			if(_gthis.game.keyboard.down[17]) {
				if(_gthis.game.keyboard.down[16]) {
					if(--_gthis.simulationSpeedChosen < 0) {
						_gthis.simulationSpeedChosen = gui_CityGUI.simulationSpeeds.length - 1;
					}
				} else if(++_gthis.simulationSpeedChosen >= gui_CityGUI.simulationSpeeds.length) {
					_gthis.simulationSpeedChosen = 0;
				}
			} else if(_gthis.simulationSpeedChosen > 1) {
				_gthis.simulationSpeedChosen = 0;
			} else {
				_gthis.simulationSpeedChosen = 2;
			}
			_gthis.city.simulationSpeed = gui_CityGUI.simulationSpeeds[_gthis.simulationSpeedChosen].speed;
			_gthis.gameSpeedButton.imageSprite.texture = gui_CityGUI.simulationSpeeds[_gthis.simulationSpeedChosen].icon;
			if(!_gthis.game.keyboard.down[16]) {
				_gthis.city.set_pauseGame(false);
				common_PokiHelpers.reportStartGameplay();
			}
			if(_gthis.gameSpeedOnUse != null) {
				_gthis.gameSpeedOnUse();
			}
		},common_ArrayExtensions.min(gui_CityGUI.simulationSpeeds,function(spd) {
			return Math.abs(spd.speed - _gthis.city.simulationSpeed);
		}).icon,function() {
			return false;
		},function() {
			_gthis.tooltip.setText(_gthis.gameSpeedButton,_gthis.game.isMobile || Main.isIPadVersionOnAMac ? common_Localize.lo("change_game_speed_mobile") : common_Localize.lo("change_game_speed_pc") + (_gthis.city.pauseGame ? "\n" + common_Localize.lo("keep_paused_help") : ""),gui_CityGUI.simulationSpeeds[_gthis.simulationSpeedChosen].tooltipTitle);
			if(_gthis.gameSpeedOnUse != null) {
				_gthis.gameSpeedOnUse();
			}
		},null,this.miniButtonToUse(),this.game.isMobile ? 4 : 1);
		this.gameSpeedButton.keyboardButton = Keyboard.getLetterCode("S");
		quickControlButtons.addChild(this.gameSpeedButton);
		var menuButton = new gui_ImageButton(this,this.stage,quickControlButtons,function() {
			if(_gthis.windowRelatedTo == "gameMenu") {
				_gthis.closeWindow();
			} else {
				gui_GameMenu.create(_gthis,_gthis.city);
			}
		},Resources.getTexture("spr_icon_menu"),function() {
			return _gthis.windowRelatedTo == "gameMenu";
		},function() {
			_gthis.tooltip.setText(menuButton,"",common_Localize.lo("game_menu"));
		},null,this.miniButtonToUse(),this.game.isMobile ? 4 : 1);
		menuButton.keyboardButton = Keyboard.getLetterCode("M");
		quickControlButtons.addChild(menuButton);
		if(this.city.subCities.length > 0 || this.city.possibleSubCities.length > 0) {
			this.rocketMenuButton = new gui_ImageButton(this,this.stage,quickControlButtons,function() {
				if(_gthis.windowRelatedTo == "switchCity") {
					_gthis.closeWindow();
				} else {
					gui_SwitchCityWindow.create(_gthis.city,_gthis.city.game,_gthis);
				}
			},Resources.getTexture("spr_icon_rocket"),function() {
				return _gthis.windowRelatedTo == "switchCity";
			},function() {
				_gthis.tooltip.setText(_gthis.rocketMenuButton,common_Localize.lo("switch_city_menu"));
			},null,this.miniButtonToUse(),this.game.isMobile ? 4 : 1);
			this.rocketMenuButton.keyboardButton = Keyboard.getLetterCode("R");
			quickControlButtons.addChild(this.rocketMenuButton);
		}
		if(this.game.isMobile) {
			var hideShowTextures = Resources.getTexturesByWidth("spr_hideui",12);
			this.hideShowUIButton = new gui_ImageButton(this,this.stage,quickControlButtons,function() {
				if(_gthis.cityExtraInfoHidden) {
					_gthis.addGeneralStatistics();
					_gthis.addAllMaterialsInfo();
					_gthis.cityExtraInfoHidden = false;
				} else {
					var i = _gthis.cityInfo.children.length - 1;
					while(i >= 0) {
						var child = _gthis.cityInfo.children[i];
						if(child != quickControlButtons) {
							_gthis.cityInfo.removeChild(child);
						}
						--i;
					}
					if(_gthis.materialsInfo != null) {
						_gthis.materialsInfoScrollY = _gthis.materialsInfo.scrollable.scrollPosition.y;
					}
					_gthis.materialsInfo = null;
					_gthis.workerAssignButton = null;
					_gthis.woodAmountDisplay = null;
					_gthis.stoneAmountDisplay = null;
					_gthis.cityExtraInfoHidden = true;
				}
				_gthis.hideShowUIButton.updateTexture(hideShowTextures[_gthis.cityExtraInfoHidden ? 0 : 1]);
			},hideShowTextures[this.cityExtraInfoHidden ? 0 : 1],null,function() {
				if(_gthis.cityExtraInfoHidden) {
					_gthis.tooltip.setText(_gthis.hideShowUIButton,common_Localize.lo("show_extra_info"));
				} else {
					_gthis.tooltip.setText(_gthis.hideShowUIButton,common_Localize.lo("hide_extra_info"));
				}
			},null,this.miniButtonToUse(),this.game.isMobile ? 4 : 1);
			quickControlButtons.addChild(this.hideShowUIButton);
		}
	}
	,setNotificationPanelTimeout: function(timeout) {
		this.notificationPanelTimeout = timeout;
	}
	,notifyInPanel: function(title,text,relatedTo) {
		this.addNotifications(title);
		var innerNotificationStage = this.notificationScrollableOuter.scrollable.stage;
		var thisNotification = new gui_GUIContainer(this,innerNotificationStage,this.notificationInner,null,null,null,null,{ top : 3, right : 3, bottom : 1, left : 3});
		thisNotification.addChild(new gui_TextElement(thisNotification,innerNotificationStage,text));
		this.notificationInner.addChild(thisNotification);
		this.notificationPanel.updatePosition(new common_Point(this.game.rect.width / 2 | 0,0));
		this.currentNotificationRelatedTo = relatedTo;
		this.notificationPanel.stage.alpha = 1;
		this.notificationPanelTimeout = -1;
	}
	,addNotifications: function(title) {
		if(this.notificationPanel == null) {
			var notificationBackground = new gui_NinePatch(Resources.getTexture("spr_9p_notificationpanel"),1,4,4);
			this.notificationPanel = new gui_GUIContainer(this,this.notificationStage,null,new common_Point(0,0),new common_FPoint(0.5,0),null,notificationBackground);
			this.notificationPanel.direction = gui_GUIContainerDirection.Vertical;
			this.notificationScrollableOuter = new gui_ContainerWithScrollbar(500,100,this,this.notificationStage,this.notificationPanel,null,null,null,null,null,0);
			this.notificationPanel.addChild(this.notificationScrollableOuter);
			this.notificationInner = new gui_GUIContainer(this,this.stage,this.notificationScrollableOuter,new common_Point(0,0),null,null,null,{ top : 0, right : 0, bottom : 0, left : 0});
			this.notificationInner.direction = gui_GUIContainerDirection.Vertical;
			this.notificationScrollableOuter.setInnerContainer(this.notificationInner);
			this.addNotificationTitle(title);
			this.notificationPanelTimeout = -1;
		}
	}
	,addNotificationTitle: function(text,textUpdateFunction,icon) {
		if(text == null) {
			text = "";
		}
		var _gthis = this;
		var thisStage = this.notificationStage;
		var parent = this.notificationPanel;
		var spacing = new gui_GUISpacing(this.notificationInner,new common_Point(0,0));
		this.notificationInner.addChild(spacing);
		var container = new gui_GUIContainerWithSizeCallback(this,thisStage,parent);
		container.fillSecondarySize = true;
		container.setSizeCallback(function() {
			spacing.rect.width = container.rect.width - 6;
			spacing.updateSize();
		});
		container.addChild(new gui_GUISpacing(container,new common_Point(3,0)));
		if(icon != null) {
			var iconSprite = new PIXI.Sprite(icon);
			container.addChild(new gui_GUISpacing(container,new common_Point(1,0)));
			container.addChild(new gui_ContainerHolder(parent,this.windowStage,iconSprite,{ top : 4, bottom : 0, left : 0, right : 0}));
			container.addChild(new gui_GUISpacing(container,new common_Point(2,0)));
		}
		var textElem = new gui_TextElement(container,thisStage,text,textUpdateFunction,"Arial16",{ left : 0, top : 3, right : 0, bottom : -3},null,true);
		container.addChild(textElem);
		container.addChild(new gui_GUIFiller(container));
		var closeButton = new gui_ImageButton(this,thisStage,container,function() {
			if(_gthis.notificationPanel != null) {
				_gthis.notificationPanel.destroy();
				_gthis.notificationPanel = null;
			}
		},Resources.getTexture("spr_icon_close"),null,null,null,this.game.isMobile ? "spr_button_windowheader_mobi" : "spr_button_windowheader",this.game.isMobile ? 2 : 1);
		container.addChild(closeButton);
		parent.insertChild(container,0);
		this.notificationTitleElem = textElem;
		if(this.game.isMobile) {
			this.notificationInner.padding.top = 0;
		}
		return textElem;
	}
	,removeNotifyPanel: function() {
		if(this.notificationPanel != null) {
			this.notificationPanel.destroy();
			this.notificationPanel = null;
			this.notificationPanelTimeout = -1;
		}
	}
	,addGeneralStatistics: function() {
		var _gthis = this;
		var generalStatistics = new gui_GUIContainer(this,this.stage,this.cityInfo,null);
		generalStatistics.alignment = gui_GUIContainerAlignment.RightOrBottom;
		generalStatistics.direction = gui_GUIContainerDirection.Vertical;
		this.cityInfo.addChild(generalStatistics);
		var happiness = this.city.simulation.happiness;
		var populationAndHappiness = new gui_GUIContainer(this,this.stage,generalStatistics);
		populationAndHappiness.fillSecondarySize = true;
		generalStatistics.addChild(populationAndHappiness);
		var popInfoButton = this.createInfoButton(function() {
			if(_gthis.windowRelatedTo == "popInfo") {
				_gthis.closeWindow();
			} else {
				_gthis.createWindow("popInfo");
				gui_PopulationInfoWindow.create(_gthis.city,_gthis,_gthis.innerWindowStage,_gthis.windowInner);
			}
		},function() {
			var numberOfChildren = Lambda.count(_gthis.city.simulation.citizens,function(c) {
				return c.get_age() <= 16;
			});
			_gthis.tooltip.setText(common_Localize.lo("population"),common_Localize.lo("total_amount_of_citizens") + "\n" + (numberOfChildren == 1 ? common_Localize.lo("is_one_child") : common_Localize.lo("are_n_children",[numberOfChildren])) + "\n" + (_gthis.city.simulation.citizens.length >= 1950 ? common_Localize.lo("tap_for_age_distribution_or_pop_limit") : common_Localize.lo("tap_for_age_distribution")) + _gthis.game.textHelper.ifNotMobile("\n\n" + common_Localize.lo("follow_hint")));
		},function() {
			return Std.string(_gthis.city.simulation.citizens.length | 0);
		},"spr_population",populationAndHappiness,23,function() {
			return _gthis.windowRelatedTo == "popInfo";
		});
		popInfoButton.keyboardButton = Keyboard.getLetterCode("C");
		populationAndHappiness.addChild(popInfoButton);
		var happinessBox = null;
		happinessBox = this.createInfoButton(function() {
			if(_gthis.windowRelatedTo == "happinessWindow") {
				_gthis.closeWindow();
			} else {
				var createHappinessWindow = function() {
					_gthis.createWindow("happinessWindow");
					gui_HappinessWindow.create(_gthis.city,_gthis,_gthis.innerWindowStage,_gthis.windowInner);
				};
				createHappinessWindow();
				_gthis.city.gui.clearWindowStack();
				_gthis.city.gui.addWindowToStack(createHappinessWindow);
			}
		},function() {
			var enthusiasmPart = "";
			var shortagePart = "";
			var boostPart = "";
			if(happiness.foodShortageUnhappiness > 0) {
				shortagePart += common_Localize.lo("food_shortage_unhappiness") + " " + (happiness.foodShortageUnhappiness | 0) + "\n";
			}
			if(happiness.foodRationingUnhappiness > 0) {
				shortagePart += common_Localize.lo("food_rationing_unhappiness") + " " + Math.ceil(happiness.foodRationingUnhappiness) + "\n";
			}
			if(happiness.overtimeUnhappinessShown > 0) {
				shortagePart += common_Localize.lo("mandatory_overtime_unhappiness") + " " + Math.ceil(happiness.overtimeUnhappinessShown) + "\n";
			}
			if(happiness.enthusiasmHappiness != 0) {
				enthusiasmPart += common_Localize.lo("new_city_enthousiasm") + " " + (happiness.enthusiasmHappiness | 0) + "\n";
			}
			var _g = 0;
			var _g1 = happiness.happinessBoosts;
			while(_g < _g1.length) {
				var boost = _g1[_g];
				++_g;
				boostPart += boost.text + ": " + (boost.boost | 0) + "\n";
			}
			var secondPart = common_Localize.lo("sense_of_purpose") + " " + (happiness.purposeHappiness | 0) + "\n";
			if(happiness.hippieLifestyle) {
				secondPart = common_Localize.lo("one_with_nature_happiness") + ": " + (happiness.oneWithNatureHappiness | 0) + "\n";
			}
			var gloryPart = "";
			if(_gthis.city.progress.story.storyName == "cityofthekey" || _gthis.city.progress.ruleset == progress_Ruleset.KeyCity) {
				gloryPart = common_Localize.lo("glory_of_the_key") + ": " + ("" + (happiness.gloryOfTheKey.gloryOfTheKeyHappiness | 0)) + "\n";
			}
			_gthis.tooltip.setText(happinessBox,common_Localize.lo("happiness_explainer") + "\n" + common_Localize.lo("home_happiness") + " " + (happiness.homeHappiness | 0) + "\n" + secondPart + common_Localize.lo("entertainment_happiness") + " " + (happiness.entertainmentHappiness | 0) + "\n" + common_Localize.lo("education_happiness") + " " + (happiness.schoolHappiness | 0) + "\n" + common_Localize.lo("medical_happiness") + " " + (happiness.medicalHappiness | 0) + "\n" + gloryPart + shortagePart + "" + boostPart + "" + enthusiasmPart + "\n" + common_Localize.lo("citizens_work_at_speed",[common_MathExtensions.floatFormat(Math,happiness.actionSpeedModifier,2)]),common_Localize.lo("happiness"));
		},function() {
			if(_gthis.city.simulation.happiness.happiness >= 99.99) {
				if(_gthis.city.simulation.happiness.happiness >= 124.99) {
					return "xD";
				} else {
					return ":D";
				}
			} else {
				return Std.string(_gthis.city.simulation.happiness.happiness | 0);
			}
		},"spr_happiness",populationAndHappiness,26,function() {
			return _gthis.windowRelatedTo == "happinessWindow";
		});
		happinessBox.keyboardButton = Keyboard.getLetterCode("H");
		happinessBox.container.fillPrimarySize = true;
		populationAndHappiness.addChild(happinessBox);
		var simulation = this.city.simulation;
		var stats = simulation.stats;
		var homelessStats = null;
		homelessStats = this.createInfoButton(function() {
			if(_gthis.windowRelatedTo == "houseInfo") {
				_gthis.closeWindow();
			} else {
				var doCreateHousingDistroWindow = null;
				doCreateHousingDistroWindow = function() {
					_gthis.createWindow("houseInfo");
					gui_HouseInformationWindow.create(_gthis.city,_gthis,_gthis.innerWindowStage,_gthis.windowInner);
					_gthis.city.gui.clearWindowStack();
					_gthis.city.gui.addWindowToStack(doCreateHousingDistroWindow);
				};
				doCreateHousingDistroWindow();
			}
		},function() {
			_gthis.tooltip.setText(homelessStats,gui_HouseInformationWindow.getHousingHelpText(stats),common_Localize.lo("housing"));
		},function() {
			if(simulation.houseAssigner.currentlyRateLimited) {
				return "...";
			}
			if(stats.peopleWithHome >= stats.people) {
				return "" + (stats.houseCapacity - stats.peopleWithHome);
			}
			return "[red]-" + (stats.people - stats.peopleWithHome);
		},"spr_housing",generalStatistics,20,function() {
			return _gthis.windowRelatedTo == "houseInfo";
		});
		generalStatistics.addChild(homelessStats);
		var stats1 = this.city.simulation.stats;
		this.workerAssignButton = this.createInfoButton(function() {
			if(_gthis.windowRelatedTo == "workersAssign") {
				_gthis.closeWindow();
			} else {
				_gthis.createWindow("workersAssign");
				gui_WorkerDistributionWindow.create(_gthis.city,_gthis,_gthis.innerWindowStage,_gthis.windowInner);
			}
		},function() {
			_gthis.tooltip.setText(common_Localize.lo("work"),common_Localize.lo("work_tooltip",[stats1.jobs]));
		},function() {
			return "" + stats1.peopleWithAJob + "/" + stats1.laborForce;
		},"spr_work",generalStatistics,20,function() {
			return _gthis.windowRelatedTo == "workersAssign";
		});
		this.workerAssignButton.keyboardButton = Keyboard.getLetterCode("W");
		generalStatistics.addChild(this.workerAssignButton);
	}
	,addAllMaterialsInfo: function() {
		var _gthis = this;
		var getProductionInfo = function(materialName,displayName) {
			if(displayName == null) {
				displayName = materialName;
			}
			var consumeText = "";
			var consumptionYesterday = Math.floor(_gthis.city.simulation.stats.materialUsed[MaterialsHelper.findMaterialIndex(materialName)][1]);
			var consumptionToday = Math.floor(_gthis.city.simulation.stats.materialUsed[MaterialsHelper.findMaterialIndex(materialName)][0]);
			if((consumptionYesterday != 0 || consumptionToday != 0) && materialName != "food") {
				if(materialName == "knowledge") {
					consumeText = "\n" + common_Localize.lo("operating_cost",[consumptionYesterday,displayName,consumptionToday]);
				} else {
					consumeText = "\n" + common_Localize.lo("factory_operating_cost",[consumptionYesterday,displayName,consumptionToday]);
				}
			}
			return "\n" + common_Localize.lo("citizen_production_cost",[Math.floor(_gthis.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex(materialName)][1]),displayName,Math.floor(_gthis.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex(materialName)][0])]) + consumeText;
		};
		this.materialsInfo = new gui_ContainerWithScrollbar(1000,this.city.game.rect.height,this,this.stage,this.cityInfo,new common_Point(0,0),new common_FPoint(0,0),null,null,null,0);
		this.materialsInfo.disableScrollbar = true;
		this.materialsInfoInner = new gui_GUIContainer(this,this.stage,this.cityInfo,new common_Point(0,0),new common_FPoint(0,0));
		this.materialsInfo.setInnerContainer(this.materialsInfoInner);
		this.materialsInfoInner.direction = gui_GUIContainerDirection.Vertical;
		this.cityInfo.addChild(this.materialsInfo);
		var materialsUsed = this.city.simulation.stats.materialUsed;
		var foodInfo = this.addMaterialInfo("food",common_StringExtensions.firstToUpper(common_Localize.lo("food")),function() {
			var shortageText = "";
			var eating = _gthis.city.simulation.eating;
			if(eating.foodShortage > 0.1) {
				shortageText = "\n" + common_Localize.lo("not_enough_food",[Math.ceil(eating.foodShortage)]);
			}
			return eating.getFoodText() + getProductionInfo("food",common_Localize.lo("food")) + shortageText;
		},function() {
			return Math.floor(_gthis.city.materials.food);
		},"spr_resource_food",function() {
			return _gthis.city.simulation.eating.foodShortage > 0;
		},"food");
		this.woodAmountDisplay = this.addMaterialInfo("wood",common_StringExtensions.firstToUpper(common_Localize.lo("wood")),function() {
			return common_Localize.lo("wood_use") + getProductionInfo("wood",common_Localize.lo("wood"));
		},function() {
			return Math.floor(_gthis.city.materials.wood);
		},"spr_resource_wood",null,"wood");
		this.stoneAmountDisplay = this.addMaterialInfo("stone",common_StringExtensions.firstToUpper(common_Localize.lo("stone")),function() {
			return common_Localize.lo("stone_use") + getProductionInfo("stone",common_Localize.lo("stone"));
		},function() {
			return Math.floor(_gthis.city.materials.stone);
		},"spr_resource_stone",null,"stone");
		this.addMaterialInfo("knowledge",common_StringExtensions.firstToUpper(common_Localize.lo("knowledge")),function() {
			return common_Localize.lo("knowledge_use") + getProductionInfo("knowledge",common_Localize.lo("knowledge"));
		},function() {
			return Math.floor(_gthis.city.materials.knowledge);
		},"spr_resource_knowledge",null,"knowledge");
		this.addMaterialInfo("machineParts",common_StringExtensions.firstToUpper(common_Localize.lo("machine_parts")),function() {
			return common_Localize.lo("machine_parts_use") + getProductionInfo("machineParts",common_Localize.lo("machine_parts"));
		},function() {
			return Math.floor(_gthis.city.materials.machineParts);
		},"spr_resource_machineparts",null,"machineParts");
		this.addMaterialInfo("refinedMetal",common_StringExtensions.firstToUpper(common_Localize.lo("refined_metals")),function() {
			return common_Localize.lo("refined_metals_use") + getProductionInfo("refinedMetal",common_Localize.lo("refined_metals"));
		},function() {
			return Math.floor(_gthis.city.materials.refinedMetal);
		},"spr_resource_refinedmetal",null,"refinedMetal");
		this.addMaterialInfo("computerChips",common_StringExtensions.firstToUpper(common_Localize.lo("computer_chips")),function() {
			return common_Localize.lo("computer_chips_use") + getProductionInfo("computerChips",common_Localize.lo("computer_chips"));
		},function() {
			return Math.floor(_gthis.city.materials.computerChips);
		},"spr_resource_computerchips",null,"computerChips");
		if(this.city.progress.unlocks.unlockedMaterial("graphene")) {
			this.addMaterialInfo("graphene",common_StringExtensions.firstToUpper(common_Localize.lo("graphene")),function() {
				return common_Localize.lo("graphene_use") + getProductionInfo("graphene",common_Localize.lo("graphene"));
			},function() {
				return Math.floor(_gthis.city.materials.graphene);
			},"spr_resource_graphene",null,"graphene");
		}
		if(this.city.progress.unlocks.unlockedMaterial("rocketFuel")) {
			this.addMaterialInfo("rocketFuel",common_StringExtensions.firstToUpper(common_Localize.lo("rocketFuel")),function() {
				return common_Localize.lo("rocketFuel_use") + getProductionInfo("rocketFuel",common_Localize.lo("rocketFuel"));
			},function() {
				return Math.floor(_gthis.city.materials.rocketFuel);
			},"spr_resource_rocketfuel",null,"rocketFuel");
		}
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var material = [_g1[_g]];
			++_g;
			this.addMaterialInfo(material[0].variableName,material[0].displayName,(function(material) {
				return function() {
					return material[0].description + material[0].tooltipExt() + getProductionInfo(material[0].variableName,material[0].displayName.toLowerCase());
				};
			})(material),(function(material) {
				return function() {
					return Math.floor(_gthis.city.materials[material[0].variableName]);
				};
			})(material),"spr_resource_" + material[0].variableName.toLowerCase(),null,material[0].variableName);
		}
		this.materialsInfo.setScrollPosition(new common_Point(0,this.materialsInfoScrollY));
	}
	,resize: function() {
		GUI.prototype.resize.call(this);
		if(this.persistentFullVersionUpsell != null) {
			this.persistentFullVersionUpsell.resize();
		}
		this.buildingButtons.resize();
		this.cityInfo.updatePosition(new common_Point(this.game.rect.width - this.safeAreaRight,this.game.rect.height - this.safeAreaBottom));
		if(this.notificationPanel != null) {
			this.notificationPanel.updatePosition(new common_Point(this.game.rect.width / 2 | 0,0));
		}
		if(this.resumeGameControl != null) {
			this.resumeGameControl.updatePosition();
		}
		if(this.materialsInfo != null) {
			this.materialsInfo.scrollable.maxHeight = this.game.rect.height - this.safeAreaBottom;
			this.materialsInfo.maxHeight = this.game.rect.height - this.safeAreaBottom;
			this.materialsInfo.scrollable.updateSize();
		}
		if(this.game.application.height % this.game.scaling == 0 || this.safeAreaBottom > 0) {
			this.outerStage.position.set(0,0);
		} else {
			this.outerStage.position.set(0,this.game.scaling - this.game.application.height % this.game.scaling);
		}
	}
	,update: function(timeMod) {
		this.buildingButtons.update(timeMod);
		this.cityInfo.update();
		if(this.notificationPanel != null) {
			this.notificationPanel.update();
			if(this.notificationPanelTimeout > 0) {
				this.notificationPanelTimeout -= timeMod;
				this.notificationPanel.stage.alpha = Math.min(1,this.notificationPanelTimeout / 120);
				if(this.notificationPanelTimeout <= 0) {
					this.removeNotifyPanel();
				}
			}
		}
		if(this.resumeGameControl != null) {
			this.resumeGameControl.update(timeMod);
		}
		GUI.prototype.update.call(this,timeMod);
		var tmp = this.window == null;
	}
	,triggerPremiumUpsellExperienceIfDesiredForMobile: function(campaign,andThen) {
		if(5 == 8 && Settings.language == "en" && !Config.hasPremium()) {
			this.triggerPremiumUpsellExperience(campaign,andThen);
		} else if(andThen != null) {
			andThen();
		}
	}
	,triggerPremiumUpsellExperienceIfDesired: function(campaign,andThen) {
		if(Config.get_isCoolMathWithCrossPromotion()) {
			this.triggerPremiumUpsellExperience(campaign,andThen);
		} else if(andThen != null) {
			andThen();
		}
	}
	,triggerPremiumUpsellExperience: function(campaign,onClose) {
		this.createWindow("premiumUpsell",Resources.getTexture("spr_9p_window_purple"),this.city.game.isMobile ? 25 : 40,4,"spr_windowparts_purple");
		gui_PremiumInfoWindow.create(this.city,this,this.innerWindowStage,this.windowInner,campaign,onClose);
	}
	,onEscapePressWithoutWindow: function() {
		gui_GameMenu.create(this,this.city);
	}
	,handleMouse: function(mouse) {
		var changeMousePosBy_x = 0;
		var changeMousePosBy_y = Math.round(this.outerStage.position.y);
		var _this = mouse.unscaledPosition;
		var _this_x = _this.x - changeMousePosBy_x;
		var _this_y = _this.y - changeMousePosBy_y;
		var withInt = this.city.game.scaling;
		var inlPoint_x = _this_x / withInt | 0;
		var inlPoint_y = _this_y / withInt | 0;
		mouse.position.y = inlPoint_y;
		var handleMouse = this.internalHandleMouse(mouse);
		var _this = mouse.unscaledPosition;
		var _this_x = _this.x + changeMousePosBy_x;
		var _this_y = _this.y + changeMousePosBy_y;
		var withInt = this.city.game.scaling;
		var inlPoint_x = _this_x / withInt | 0;
		var inlPoint_y = _this_y / withInt | 0;
		mouse.position.y = inlPoint_y;
		return handleMouse;
	}
	,internalHandleMouse: function(mouse) {
		if(this.resumeGameControl != null) {
			if(this.resumeGameControl.handleMouse(mouse)) {
				return true;
			}
		}
		var _g = 0;
		var _g1 = this.overlayElements;
		while(_g < _g1.length) {
			var overlayElem = _g1[_g];
			++_g;
			if(overlayElem.handleMouse(mouse)) {
				return true;
			}
		}
		if(this.notificationPanel != null) {
			if(this.notificationPanel.handleMouse(mouse)) {
				if(this.notificationPanelTimeout >= 0 && this.notificationPanelTimeout < 180) {
					this.notificationPanelTimeout = 180;
				}
				return true;
			}
		}
		if(GUI.prototype.handleMouse.call(this,mouse)) {
			return true;
		}
		if(this.buildingButtons.handleMouse(mouse)) {
			return true;
		}
		if(this.cityInfo.handleMouse(mouse)) {
			return true;
		}
		if(this.persistentFullVersionUpsell != null) {
			if(this.persistentFullVersionUpsell.handleMouse(mouse)) {
				return true;
			}
		}
		return false;
	}
	,addMaterialInfo: function(material,name,info,getAmount,textureName,makeRed,identifier) {
		var _gthis = this;
		if(makeRed == null) {
			makeRed = function() {
				return false;
			};
		}
		var ib = this.createInfoBoxForMaterialsDynamicTooltip(material,name,info,function() {
			var basicString = Std.string(getAmount());
			if(makeRed != null && makeRed()) {
				return "[red]" + basicString;
			}
			return basicString;
		},textureName,this.materialsInfoInner,42,this.materialsInfo.scrollable.stage);
		var notShowDAFor = 0;
		var showDAFor = 0;
		ib.onUpdate = function() {
			var shouldNotShowDownArrow = _gthis.city.simulation.stats.materialUsed[MaterialsHelper.findMaterialIndex(identifier)][1] + 0.2 < _gthis.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex(identifier)][1] || _gthis.city.simulation.stats.materialUsed[MaterialsHelper.findMaterialIndex(identifier)][1] < 0.2 && identifier != "food" || 1 + ((_gthis.city.simulation.time.timeSinceStart | 0) / 1440 | 0) <= 5;
			if(!shouldNotShowDownArrow) {
				var threeDayTotalUse = 0.0;
				var threeDayTotalProd = 0.0;
				var skipDays = 0;
				while(skipDays < 2 && _gthis.city.simulation.festivalManager.wasFestivalOnDay[1 + skipDays]) ++skipDays;
				threeDayTotalUse += _gthis.city.simulation.stats.materialUsed[MaterialsHelper.findMaterialIndex(identifier)][1 + skipDays];
				threeDayTotalProd += _gthis.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex(identifier)][1 + skipDays];
				while(skipDays < 2 && _gthis.city.simulation.festivalManager.wasFestivalOnDay[2 + skipDays]) ++skipDays;
				threeDayTotalUse += _gthis.city.simulation.stats.materialUsed[MaterialsHelper.findMaterialIndex(identifier)][2 + skipDays];
				threeDayTotalProd += _gthis.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex(identifier)][2 + skipDays];
				while(skipDays < 2 && _gthis.city.simulation.festivalManager.wasFestivalOnDay[3 + skipDays]) ++skipDays;
				threeDayTotalUse += _gthis.city.simulation.stats.materialUsed[MaterialsHelper.findMaterialIndex(identifier)][3 + skipDays];
				threeDayTotalProd += _gthis.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex(identifier)][3 + skipDays];
				shouldNotShowDownArrow = threeDayTotalUse + 0.2 <= threeDayTotalProd;
			}
			if(!shouldNotShowDownArrow) {
				var prodToday = _gthis.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex(identifier)][0];
				var consToday = _gthis.city.simulation.stats.materialUsed[MaterialsHelper.findMaterialIndex(identifier)][0];
				if(_gthis.city.simulation.time.timeSinceStart / 60 % 24 > 10 && prodToday > consToday) {
					if(!ib.hasAdditionalSprite()) {
						shouldNotShowDownArrow = true;
					} else if(prodToday * (1.1 + 0.1 * Math.max(0,12.0 - _gthis.city.simulation.time.timeSinceStart / 60 % 24)) > consToday) {
						shouldNotShowDownArrow = true;
					}
				}
			}
			var shouldNormallyNotShowDA = _gthis.city.progress.sandbox.unlimitedResources || shouldNotShowDownArrow || notShowDAFor > 0;
			if(shouldNormallyNotShowDA && showDAFor <= 0) {
				ib.setAdditionalSprite(null);
				if(shouldNormallyNotShowDA) {
					notShowDAFor = 20;
				} else {
					notShowDAFor -= 1;
				}
			} else {
				ib.setAdditionalSprite(Resources.getTexture("spr_resource_downtrend"));
				if(!shouldNormallyNotShowDA) {
					showDAFor = 20;
				} else {
					showDAFor -= 1;
				}
			}
		};
		return ib;
	}
	,createInfoBoxForMaterialsDynamicTooltip: function(material,title,info,getAmount,textureName,parent,minWidth,stage) {
		if(minWidth == null) {
			minWidth = 42;
		}
		var _gthis = this;
		var button;
		if(stage == null) {
			stage = this.stage;
		}
		button = new gui_ContainerButton(this,stage,parent,function() {
			if(_gthis.windowRelatedTo == material) {
				_gthis.closeWindow();
			} else {
				_gthis.createWindow(material,Resources.getTexture("spr_9p_window_moreopaque"));
				gui_infoWindows_MaterialInfoWindow.create(_gthis.city,_gthis,_gthis.innerWindowStage,_gthis.windowInner,material,title);
			}
		},function() {
			return _gthis.windowRelatedTo == material;
		},function() {
			_gthis.tooltip.setText(button,info(),title);
		},"spr_transparentbutton_info");
		button.container.fillSecondarySize = true;
		var newInfoBox = new gui_InfoBox(this,stage,button.container,function() {
			return getAmount();
		},Resources.getTexture(textureName),minWidth,function() {
		},"none",function() {
			return _gthis.city.progress.sandbox.unlimitedResources;
		});
		newInfoBox.fillSecondarySize = true;
		newInfoBox.fillPrimarySize = true;
		button.container.addChild(newInfoBox);
		parent.addChild(button);
		return newInfoBox;
	}
	,createInfoButton: function(onClick,onHover,getAmount,textureName,parent,minWidth,isActive) {
		if(minWidth == null) {
			minWidth = 42;
		}
		var infoButton = new gui_ContainerButton(this,this.stage,parent,onClick,isActive,onHover,"spr_transparentbutton_info");
		infoButton.container.fillSecondarySize = true;
		var extraSpacing = this.game.isMobile ? 3 : 0;
		var extraSpacingText = this.game.isMobile ? 2 : 0;
		infoButton.container.padding = { left : 2 + extraSpacing, right : extraSpacing + 3, top : extraSpacing + 2, bottom : extraSpacing + (-1)};
		infoButton.container.updateSize();
		infoButton.container.addChild(new gui_ContainerHolder(infoButton.container,this.stage,new PIXI.Sprite(Resources.getTexture(textureName))));
		infoButton.container.addChild(new gui_TextElement(infoButton.container,this.stage,null,getAmount,null,{ left : 1 + extraSpacingText, right : 0, top : 1, bottom : 0},null,false,true));
		infoButton.container.minWidth = minWidth;
		return infoButton;
	}
	,closeWindow: function(inProcessOfOpeningAnother) {
		if(inProcessOfOpeningAnother == null) {
			inProcessOfOpeningAnother = false;
		}
		if(this.city.pauseGame && this.pausedForWindow && (!inProcessOfOpeningAnother || 5 != 8)) {
			this.city.set_pauseGame(false);
			this.pausedForWindow = false;
		}
		if(!this.city.pauseGame && (this.city.gui.windowStackMeta.indexOf("GameMenu") == -1 || this.city.gui.windowStackMeta.length == 1) && !inProcessOfOpeningAnother) {
			common_PokiHelpers.reportStartGameplay();
		}
		GUI.prototype.closeWindow.call(this,inProcessOfOpeningAnother);
	}
	,pauseForWindow: function() {
		var wasPaused = this.city.pauseGame;
		var wasPausedForWindow = this.pausedForWindow;
		this.city.set_pauseGame(true);
		if(wasPausedForWindow || !wasPaused) {
			this.pausedForWindow = true;
		}
	}
	,activateLoserState: function() {
		this.cityInfo.clear();
		this.buildingButtons.activateLoserState();
	}
	,showTutorialArrows1: function() {
		var _gthis = this;
		var oldWindowOnDestroy = this.windowOnDestroy;
		var windowClosed = false;
		this.windowOnDestroy = function() {
			windowClosed = true;
			if(oldWindowOnDestroy != null) {
				oldWindowOnDestroy();
			}
		};
		this.overlayElements.push(new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.windowInner.children[_gthis.windowInner.children.length - 1].children[1];
		},function() {
			return !windowClosed;
		},gui_HelpArrowDirection.Left,180));
		this.buildingButtons.showTutorialArrows1(this.overlayElements,function() {
			return windowClosed;
		},this.gameHelpStage);
	}
	,showTutorialArrowsBuildStoneMine: function(windowClosed) {
		var _gthis = this;
		var woodAmountArrow = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.woodAmountDisplay;
		},function() {
			if(windowClosed()) {
				return _gthis.city.materials.wood < 4;
			} else {
				return false;
			}
		},gui_HelpArrowDirection.DownHint,0);
		woodAmountArrow.addText(common_Localize.lo("see_wood_here"));
		this.overlayElements.push(woodAmountArrow);
		this.buildingButtons.showTutorialArrows101(this.overlayElements,function() {
			return _gthis.city.materials.wood >= 4;
		},this.gameHelpStage);
	}
	,showTutorialArrows2: function(windowClosed) {
		var _gthis = this;
		var everHadAnyPrio = false;
		var origWindow = null;
		var everHadPrio = function() {
			if(everHadAnyPrio && origWindow == null) {
				origWindow = _gthis.window;
			}
			everHadAnyPrio = everHadAnyPrio || Object.prototype.hasOwnProperty.call(_gthis.city.simulation.jobAssigner.priorityJobs.h,"buildings.StoneMine") && _gthis.city.simulation.jobAssigner.priorityJobs.h["buildings.StoneMine"] != 0;
			return everHadAnyPrio;
		};
		this.overlayElements.push(new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.hideShowUIButton;
		},function() {
			if(windowClosed() && gui_WorkerDistributionWindow.tutorialStoneMineUpButton == null && !everHadPrio()) {
				return _gthis.cityExtraInfoHidden;
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Down));
		var ha2 = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.workerAssignButton;
		},function() {
			if(windowClosed() && gui_WorkerDistributionWindow.tutorialStoneMineUpButton == null) {
				return !everHadPrio();
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Down);
		if(!this.game.isMobile) {
			ha2.useBigMovement();
		}
		this.overlayElements.push(ha2);
		this.overlayElements.push(new gui_HelpArrow(this,this.gameHelpStage,function() {
			return gui_WorkerDistributionWindow.tutorialStoneMineUpButton;
		},function() {
			if(gui_WorkerDistributionWindow.tutorialStoneMineUpButton != null) {
				return !everHadPrio();
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Left));
		var stoneAmountArrow = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.woodAmountDisplay;
		},function() {
			if(everHadPrio()) {
				if(_gthis.window != null) {
					return _gthis.window == origWindow;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},gui_HelpArrowDirection.DownHint,0);
		if(this.game.rect.width < 900) {
			stoneAmountArrow.pleaseAlignExtraTextRight = true;
		}
		stoneAmountArrow.addText(common_Localize.lo("great_gather_stone"));
		this.overlayElements.push(stoneAmountArrow);
		this.buildingButtons.showTutorialArrows2(this.overlayElements,everHadPrio,this.gameHelpStage,windowClosed);
		var needsSecondHelp = function() {
			if(_gthis.city.materials.stone > 6 && _gthis.city.materials.wood < 6) {
				return !Lambda.exists(_gthis.city.permanents,function(pm) {
					if(pm.is(buildings_WoodcuttingCentre)) {
						return pm.workers.length > 0;
					} else {
						return false;
					}
				});
			} else {
				return false;
			}
		};
		var hasWorkersOnStone = function() {
			if(Object.prototype.hasOwnProperty.call(_gthis.city.simulation.jobAssigner.priorityJobs.h,"buildings.StoneMine")) {
				return _gthis.city.simulation.jobAssigner.priorityJobs.h["buildings.StoneMine"] >= 3;
			} else {
				return false;
			}
		};
		var reduceStoneText = common_Localize.lo("you_have_enough_stone");
		var ciButton = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.hideShowUIButton;
		},function() {
			if(gui_WorkerDistributionWindow.tutorialStoneMineUpButton == null && needsSecondHelp()) {
				return _gthis.cityExtraInfoHidden;
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Down);
		ciButton.addText(reduceStoneText);
		this.overlayElements.push(ciButton);
		var waButton = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.workerAssignButton;
		},function() {
			if(gui_WorkerDistributionWindow.tutorialStoneMineUpButton == null) {
				return needsSecondHelp();
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Down);
		waButton.addText(reduceStoneText);
		this.overlayElements.push(waButton);
		var stoneMineDownButton = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return gui_WorkerDistributionWindow.tutorialStoneMineDownButton;
		},function() {
			if(gui_WorkerDistributionWindow.tutorialStoneMineDownButton != null && needsSecondHelp()) {
				return hasWorkersOnStone();
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Left);
		stoneMineDownButton.addText(common_Localize.lo("reduce_stone_mining_priority"));
		this.overlayElements.push(stoneMineDownButton);
		var woodUpButton = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return gui_WorkerDistributionWindow.tutorialWoodCuttersUpButton;
		},function() {
			if(gui_WorkerDistributionWindow.tutorialWoodCuttersUpButton != null && needsSecondHelp()) {
				return !hasWorkersOnStone();
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Left);
		woodUpButton.addText(common_Localize.lo("increase_woodcutting_priority"));
		this.overlayElements.push(woodUpButton);
	}
	,showTutorialArrows3: function() {
		var _gthis = this;
		var storyHelpButtonUsed = false;
		var stoneAmountArrow = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.storyHelpButton;
		},function() {
			if(!storyHelpButtonUsed) {
				return _gthis.window == null;
			} else {
				return false;
			}
		},gui_HelpArrowDirection.DownHint,0);
		stoneAmountArrow.addText(this.city.game.isMobile ? common_Localize.lo("hint_hint") : common_Localize.lo("hint_hint_pc"));
		this.overlayElements.push(stoneAmountArrow);
		this.storyHelpButtonOnUse = function() {
			storyHelpButtonUsed = true;
			_gthis.storyHelpButtonOnUse = null;
		};
	}
	,showTutorialArrows4: function() {
		var _gthis = this;
		if(this.simulationSpeedChosen == 0) {
			var gameSpeedUsed = false;
			var speedHelpArrow = new gui_HelpArrow(this,this.gameHelpStage,function() {
				return _gthis.gameSpeedButton;
			},function() {
				if(!gameSpeedUsed) {
					return _gthis.window == null;
				} else {
					return false;
				}
			},gui_HelpArrowDirection.DownHint,0);
			speedHelpArrow.addText(common_Localize.lo("speedup_hint"));
			if(this.game.isMobile) {
				speedHelpArrow.addHeaderAndCloseButton(common_Localize.lo("tip"));
			}
			this.overlayElements.push(speedHelpArrow);
			this.gameSpeedOnUse = function() {
				gameSpeedUsed = true;
				_gthis.gameSpeedOnUse = null;
			};
		}
	}
	,showTutorialArrowsBoost: function() {
		var _gthis = this;
		if(!this.city.simulation.boostManager.boostShownExplainer) {
			var boostArrow = new gui_HelpArrow(this,this.gameHelpStage,function() {
				return _gthis.city.simulation.boostManager.infoButton;
			},function() {
				return _gthis.window == null;
			},gui_HelpArrowDirection.UpHint,0);
			boostArrow.addText(common_Localize.lo("boost_use_case") + "\n" + common_Localize.lo("boost_earn_extra_reward"));
			boostArrow.addHeaderAndCloseButton(common_Localize.lo("tip"));
			this.overlayElements.push(boostArrow);
			this.city.simulation.boostManager.boostShownExplainer = true;
			common_Storage.setItem("boostShownExplainer","boostShownExplainer",function() {
			});
		}
	}
	,showTutorialArrowsSwitchCity: function() {
		var _gthis = this;
		var arrow = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.rocketMenuButton;
		},function() {
			return true;
		},gui_HelpArrowDirection.DownHint);
		this.overlayElements.push(arrow);
		arrow.addText(common_Localize.lo("rocket_other_city_tutorial"));
	}
	,showScreenshotHelpInfo: function(screenshotButton) {
		var _gthis = this;
		var arrow = new gui_HelpArrow(this,this.gameHelpStage,function() {
			return screenshotButton;
		},function() {
			if(_gthis.window == null || _gthis.windowRelatedTo != "gameMenu") {
				_gthis.city.gui.clearTutorial();
				return false;
			}
			return true;
		},gui_HelpArrowDirection.DownHint);
		this.overlayElements.push(arrow);
		arrow.addText(common_Localize.lo("tip_full_city_screenshot"));
		arrow.addHeaderAndCloseButton(common_Localize.lo("tip"));
	}
	,showTutorialArrowsInviteCitizens: function() {
		this.buildingButtons.showTutorialArrowsInviteCitizens(this.overlayElements,this.gameHelpStage);
	}
	,showWindowCloseWarning: function(time) {
		if(time == null) {
			time = 300;
		}
		var _gthis = this;
		var oldWindowOnDestroy = this.windowOnDestroy;
		var windowClosed = false;
		this.windowOnDestroy = function() {
			windowClosed = true;
			if(oldWindowOnDestroy != null) {
				oldWindowOnDestroy();
			}
		};
		this.overlayElements.push(new gui_HelpArrow(this,this.gameHelpStage,function() {
			return _gthis.windowInner.children[_gthis.windowInner.children.length - 1].children[1];
		},function() {
			return !windowClosed;
		},gui_HelpArrowDirection.Left,time));
		return function() {
			return windowClosed;
		};
	}
	,clearTutorial: function() {
		var _g = 0;
		var _g1 = this.overlayElements;
		while(_g < _g1.length) {
			var elem = _g1[_g];
			++_g;
			elem.destroy();
		}
		this.overlayElements = [];
	}
	,refreshCategoryBuildingsShown: function() {
		this.buildingButtons.refreshCategoryBuildingsShown();
	}
	,createResumeGameControl: function() {
		var _gthis = this;
		if(this.resumeGameControl == null) {
			this.outerStage.alpha = 0.3;
			this.notificationStage.alpha = 3.3333333333333335;
			this.resumeGameControl = new gui_ResumeGameControl(this,this.notificationStage,this.city,function() {
				_gthis.resumeGameControl = null;
				_gthis.outerStage.alpha = 1;
			});
		}
	}
	,__class__: gui_CityGUI
});
