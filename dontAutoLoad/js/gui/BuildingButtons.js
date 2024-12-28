var gui_BuildingButtons = $hxClasses["gui.BuildingButtons"] = function(gui,city) {
	this.mirrored = false;
	this.wasLargeMobile = false;
	this.previouslyShownCategory = "";
	this.inviteCitizensButton = null;
	this.mobileStopBuildingOrManagingButton = null;
	this.activateBuildModeButton = null;
	this.activateManagementModeButton = null;
	this.buildingModeEnabled = false;
	this.shownManagementOptions = false;
	this.shownBuildingModes = false;
	this.shownSubCategory = null;
	this.creatableCityElementsThatNeededAttention = [];
	this.categoryButtonPosition = new haxe_ds_StringMap();
	this.gui = gui;
	this.city = city;
	this.createBuildingButtons();
	this.shownCategory = "";
	this.buttonsByCategory = new haxe_ds_StringMap();
	this.buttonsInCategory = new haxe_ds_StringMap();
	this.wasLargeMobile = this.gui.game.isLargeMobile;
};
gui_BuildingButtons.__name__ = "gui.BuildingButtons";
gui_BuildingButtons.prototype = {
	resize: function() {
		this.buildingButtons.updatePosition(new common_Point(this.gui.safeAreaLeft,this.gui.game.rect.height - this.gui.safeAreaBottom));
		this.allBuildingModeButtons.updatePosition(new common_Point(this.gui.safeAreaLeft,this.gui.game.rect.height - this.gui.safeAreaBottom - 20 - 2));
		this.allManagementOptionsButtons.updatePosition(new common_Point(this.gui.safeAreaLeft,this.gui.game.rect.height - this.gui.safeAreaBottom - 20 - 2));
		if(this.gui.game.isMobile) {
			if(this.gui.game.isLargeMobile != this.wasLargeMobile) {
				if(this.wasLargeMobile) {
					this.buildingModeEnabled = this.city.builder != null || this.shownCategory != "" || this.shownBuildingModes;
				} else {
					if(this.buildingModeEnabled) {
						this.mobileStopBuildingOrManagingButton = null;
						this.gui.createCityInfo();
					}
					this.buildingModeEnabled = false;
				}
				this.refreshCategoryBuildingsShown();
				this.wasLargeMobile = this.gui.game.isLargeMobile;
			}
		}
	}
	,update: function(timeMod) {
		this.allBuildingModeButtons.update();
		this.buildingButtons.update();
		this.allManagementOptionsButtons.update();
		this.updateGoalAttentions();
	}
	,handleMouse: function(mouse) {
		if(this.allBuildingModeButtons.handleMouse(mouse)) {
			return true;
		}
		if(this.buildingButtons.handleMouse(mouse)) {
			return true;
		}
		if(this.allManagementOptionsButtons.handleMouse(mouse)) {
			return true;
		}
		return false;
	}
	,activateLoserState: function() {
		this.buildingButtons.clear();
		this.allBuildingModeButtons.clear();
		this.allManagementOptionsButtons.clear();
	}
	,createBuildingButtons: function() {
		this.buildingButtons = new gui_GUIContainer(this.gui,this.gui.stage,null,new common_Point(this.gui.safeAreaLeft,this.gui.game.rect.height - this.gui.safeAreaBottom),new common_FPoint(0,1));
		this.categoryButtons = new gui_GUIContainer(this.gui,this.gui.stage,this.buildingButtons);
		this.allBuildingModeButtons = new gui_GUIContainer(this.gui,this.gui.stage,null,new common_Point(this.gui.safeAreaLeft,this.gui.game.rect.height - 20 - 2 - this.gui.safeAreaBottom),new common_FPoint(0,1));
		this.allManagementOptionsButtons = new gui_GUIContainer(this.gui,this.gui.stage,null,new common_Point(this.gui.safeAreaLeft,this.gui.game.rect.height - 20 - 2 - this.gui.safeAreaBottom),new common_FPoint(0,1));
		this.buildingInCategoryButtons = new gui_GUIContainer(this.gui,this.gui.stage,this.buildingButtons);
		this.buildingButtons.direction = gui_GUIContainerDirection.Vertical;
		this.buildingInCategoryButtons.direction = this.gui.game.isMobile ? gui_GUIContainerDirection.Vertical : gui_GUIContainerDirection.Horizontal;
		this.buildingInCategoryButtonsCol = null;
		this.buildingInCategoryButtonsColAmount = 0;
		this.allBuildingModeButtons.direction = this.gui.game.isMobile ? gui_GUIContainerDirection.Horizontal : gui_GUIContainerDirection.Vertical;
		this.allManagementOptionsButtons.direction = this.gui.game.isMobile ? gui_GUIContainerDirection.Horizontal : gui_GUIContainerDirection.Vertical;
		this.buildingButtons.addChild(this.buildingInCategoryButtons);
		this.buildingButtons.addChild(this.categoryButtons);
		if(this.gui.game.isMobile && !this.gui.game.isLargeMobile) {
			this.createMobileBuildButton();
		} else {
			this.createBuildingCategoryButtons();
		}
	}
	,showTutorialArrows1: function(overlayElements,windowClosed,gameHelpStage) {
		var _gthis = this;
		var firstBuildArrow = new gui_HelpArrow(this.gui,gameHelpStage,function() {
			return _gthis.categoryButtons.children[_gthis.buildingModeEnabled && !_gthis.gui.game.isLargeMobile ? 1 : 0];
		},function() {
			if(windowClosed() && _gthis.city.builder == null) {
				return _gthis.shownCategory == "";
			} else {
				return false;
			}
		});
		if(!this.gui.game.isMobile) {
			firstBuildArrow.useBigMovement();
		}
		overlayElements.push(firstBuildArrow);
		var secondBuildArrow = new gui_HelpArrow(this.gui,gameHelpStage,function() {
			var currentCategoryButtons = _gthis.buildingInCategoryButtons.children[0];
			return currentCategoryButtons.children[currentCategoryButtons.children.length - 1];
		},function() {
			if(windowClosed() && _gthis.city.builder == null) {
				return _gthis.shownCategory != "";
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Left);
		overlayElements.push(secondBuildArrow);
	}
	,showTutorialArrows101: function(overlayElements,shouldShow,gameHelpStage) {
		var _gthis = this;
		var helpArrow1 = new gui_HelpArrow(this.gui,gameHelpStage,function() {
			return _gthis.categoryButtons.children[_gthis.buildingModeEnabled && !_gthis.gui.game.isLargeMobile ? 1 : 0];
		},function() {
			if(shouldShow() && _gthis.city.builder == null) {
				return _gthis.shownCategory == "";
			} else {
				return false;
			}
		});
		overlayElements.push(helpArrow1);
		var helpArrow2 = new gui_HelpArrow(this.gui,gameHelpStage,function() {
			var currentCategoryButtons = _gthis.buildingInCategoryButtons.children[0];
			return currentCategoryButtons.children[currentCategoryButtons.direction == gui_GUIContainerDirection.Horizontal ? currentCategoryButtons.children.length - 1 : currentCategoryButtons.children.length - 2];
		},function() {
			if(shouldShow() && _gthis.city.builder == null) {
				return _gthis.shownCategory != "";
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Left);
		overlayElements.push(helpArrow2);
		var text = common_Localize.lo("you_have_enough_wood");
		helpArrow1.addText(text);
		helpArrow2.addText(text);
	}
	,showTutorialArrows2: function(overlayElements,everHadPrio,gameHelpStage,windowClosed) {
		var _gthis = this;
		overlayElements.push(new gui_HelpArrow(this.gui,gameHelpStage,function() {
			return _gthis.mobileStopBuildingOrManagingButton;
		},function() {
			if(windowClosed() && gui_WorkerDistributionWindow.tutorialStoneMineUpButton == null) {
				return !everHadPrio();
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Down));
	}
	,showTutorialArrowsInviteCitizens: function(overlayElements,gameHelpStage) {
		var _gthis = this;
		overlayElements.push(new gui_HelpArrow(this.gui,gameHelpStage,function() {
			return _gthis.inviteCitizensButton;
		},function() {
			return _gthis.gui.windowRelatedTo != "invite_people";
		},gui_HelpArrowDirection.Left));
		overlayElements.push(new gui_HelpArrow(this.gui,gameHelpStage,function() {
			return _gthis.activateManagementModeButton;
		},function() {
			if(_gthis.inviteCitizensButton == null) {
				return _gthis.gui.windowRelatedTo != "invite_people";
			} else {
				return false;
			}
		},gui_HelpArrowDirection.Down));
	}
	,createMobileBuildButton: function() {
		var _gthis = this;
		var createMobileStopBuildingOrManagingButton = null;
		var activateMobileBuild = function(wasAlreadyOpen) {
			if(wasAlreadyOpen == null) {
				wasAlreadyOpen = false;
			}
			_gthis.buildingModeEnabled = true;
			_gthis.activateBuildModeButton = null;
			_gthis.activateManagementModeButton = null;
			if(!wasAlreadyOpen && _gthis.gui.windowRelatedTo != "travel_time") {
				_gthis.gui.closeWindow();
			}
			_gthis.gui.hideCityInfo();
			_gthis.categoryButtons.clear();
			createMobileStopBuildingOrManagingButton();
			_gthis.createBuildingCategoryButtons();
			if(_gthis.previouslyShownCategory != "") {
				_gthis.showOrHideBuildingsOfCategory(_gthis.previouslyShownCategory,null,_gthis.categoryButtonPosition.h[_gthis.previouslyShownCategory],false,true,true);
				_gthis.previouslyShownCategory = "";
			}
		};
		var createMobileBuildButtonInternal = function() {
			var mobileBuildButton = new gui_ImageButton(_gthis.gui,_gthis.gui.stage,_gthis.categoryButtons,function() {
				activateMobileBuild();
			},Resources.getTexture("spr_icon_build"),function() {
				return false;
			},function() {
				_gthis.gui.tooltip.setText(mobileBuildButton,common_Localize.lo("build"));
			});
			_gthis.categoryButtons.addChild(mobileBuildButton);
			_gthis.activateBuildModeButton = mobileBuildButton;
		};
		createMobileStopBuildingOrManagingButton = function() {
			var _gthis1 = _gthis.gui;
			var _gthis2 = _gthis.gui.stage;
			var _gthis3 = _gthis.categoryButtons;
			var createMobileStopBuildingOrManagingButton = Resources.getTexture("spr_arrow_back");
			_gthis.mobileStopBuildingOrManagingButton = new gui_ImageButton(_gthis1,_gthis2,_gthis3,function() {
				_gthis.mobileStopBuildingOrManaging();
			},createMobileStopBuildingOrManagingButton,function() {
				return false;
			},function() {
				_gthis.gui.tooltip.setText(_gthis.mobileStopBuildingOrManagingButton,common_Localize.lo("back"));
			});
			_gthis.categoryButtons.addChild(_gthis.mobileStopBuildingOrManagingButton);
		};
		if(this.buildingModeEnabled) {
			activateMobileBuild(true);
			this.shownManagementOptions = false;
			return;
		}
		var activateMobileManagement = function(wasAlreadyOpen) {
			if(wasAlreadyOpen == null) {
				wasAlreadyOpen = false;
			}
			_gthis.shownManagementOptions = true;
			_gthis.activateBuildModeButton = null;
			_gthis.activateManagementModeButton = null;
			if(!wasAlreadyOpen) {
				_gthis.gui.closeWindow();
			}
			_gthis.gui.hideCityInfo();
			_gthis.categoryButtons.clear();
			createMobileStopBuildingOrManagingButton();
			_gthis.showManagementOptions(_gthis.categoryButtons);
		};
		var createMobileManageButtonInternal = function() {
			var mobileManageButton = new gui_ImageButton(_gthis.gui,_gthis.gui.stage,_gthis.categoryButtons,function() {
				activateMobileManagement();
			},Resources.getTexture("spr_icon_management"),function() {
				return false;
			},function() {
				_gthis.gui.tooltip.setText(mobileManageButton,common_Localize.lo("management"));
			});
			_gthis.categoryButtons.addChild(mobileManageButton);
			_gthis.activateManagementModeButton = mobileManageButton;
		};
		if(this.shownManagementOptions) {
			activateMobileManagement(true);
			this.buildingModeEnabled = false;
			return;
		}
		createMobileBuildButtonInternal();
		if(this.city.progress.unlocks.unlockedManagementOptions) {
			createMobileManageButtonInternal();
		}
	}
	,mobileStopBuildingOrManaging: function() {
		if(!this.buildingModeEnabled && !this.shownManagementOptions) {
			return;
		}
		this.mobileStopBuildingOrManagingButton = null;
		this.inviteCitizensButton = null;
		this.buildingModeEnabled = false;
		this.shownManagementOptions = false;
		this.gui.createCityInfo();
		this.categoryButtons.clear();
		if(this.shownCategory != "") {
			this.previouslyShownCategory = this.shownCategory;
			this.showOrHideBuildingsOfCategory(this.shownCategory,this.shownSubCategory,this.categoryButtonPosition.h[this.shownCategory],false,true,true);
		}
		this.closeExtraBuildingModes();
		this.createMobileBuildButton();
	}
	,createBuildingCategoryButtons: function() {
		var _gthis = this;
		var totalWidth = 0;
		this.buttonsByCategory = new haxe_ds_StringMap();
		this.buttonsInCategory = new haxe_ds_StringMap();
		var _g = 0;
		var _g1 = Resources.buildingCategoriesInfo;
		while(_g < _g1.length) {
			var category = [_g1[_g]];
			++_g;
			var anyUnlocked = false;
			var _g2 = 0;
			var _g3 = this.city.progress.resources.buildingInfoArray;
			while(_g2 < _g3.length) {
				var building = _g3[_g2];
				++_g2;
				var name = "buildings." + building.className;
				var classToBuild = $hxClasses[name];
				var unlockState = this.city.progress.unlocks.getUnlockState(classToBuild);
				if(building.category == category[0].name && (unlockState == progress_UnlockState.Unlocked || unlockState == progress_UnlockState.Researched || unlockState == progress_UnlockState.Createable)) {
					anyUnlocked = true;
				}
			}
			var _g4 = 0;
			var _g5 = Resources.decorationsInfo;
			while(_g4 < _g5.length) {
				var decoration = _g5[_g4];
				++_g4;
				if(decoration.category == category[0].name && this.city.progress.unlocks.unlockedDecorationTab) {
					anyUnlocked = true;
				}
			}
			var _g6 = 0;
			var _g7 = Resources.worldResourcesInfo;
			while(_g6 < _g7.length) {
				var worldInfo = _g7[_g6];
				++_g6;
				if(worldInfo.category == category[0].name && this.city.progress.unlocks.unlockedDecorationTab) {
					anyUnlocked = true;
				}
			}
			if(anyUnlocked) {
				var categoryButton = [null];
				var totalWidthNow = [totalWidth];
				categoryButton[0] = new gui_ImageButton(this.gui,this.gui.stage,this.categoryButtons,(function(totalWidthNow,categoryButton,category) {
					return function() {
						_gthis.shownSubCategory = null;
						categoryButton[0].stopNotify();
						_gthis.showOrHideBuildingsOfCategory(category[0].name,null,totalWidthNow[0]);
						_gthis.updateGoalAttentions();
					};
				})(totalWidthNow,categoryButton,category),Resources.getTexture(category[0].image),(function(category) {
					return function() {
						return _gthis.shownCategory == category[0].name;
					};
				})(category),(function(categoryButton,category) {
					return function() {
						_gthis.gui.tooltip.setText(categoryButton[0],category[0].description,category[0].displayName);
					};
				})(categoryButton,category),null,"spr_transparentbutton");
				this.categoryButtons.addChild(categoryButton[0]);
				this.categoryButtonPosition.h[category[0].name] = totalWidth;
				this.buttonsByCategory.h[category[0].name] = categoryButton[0];
				totalWidth += 22;
				if(this.city.progress.unlocks.getShouldNotifyForCategoryUnlock(category[0].name)) {
					if(this.shownCategory == category[0].name || this.previouslyShownCategory == category[0].name) {
						this.city.progress.unlocks.stopNotifyCategoryUnlock(category[0].name);
					} else {
						categoryButton[0].notify(false,(function(_g,categoryName) {
							return function() {
								_g[0](categoryName[0]);
							};
						})([($_=this.city.progress.unlocks,$bind($_,$_.stopNotifyCategoryUnlock))],[category[0].name]));
					}
				}
			}
		}
		if(this.city.progress.unlocks.unlockedBuildingModeButton) {
			this.addBuildingModeButtons();
		}
		if(!this.gui.game.isMobile || this.gui.game.isLargeMobile) {
			if(this.city.progress.unlocks.unlockedManagementOptions) {
				this.addManagementButtons();
			}
		}
	}
	,showOrHideBuildingsOfCategory: function(category,subCategory,atWidth,neverHide,destroyBuilder,keepExtraBuildingModesOpen) {
		if(keepExtraBuildingModesOpen == null) {
			keepExtraBuildingModesOpen = false;
		}
		if(destroyBuilder == null) {
			destroyBuilder = true;
		}
		if(neverHide == null) {
			neverHide = false;
		}
		this.buildingInCategoryButtons.clear();
		if(!keepExtraBuildingModesOpen) {
			this.closeExtraBuildingModes();
		}
		if(!keepExtraBuildingModesOpen && this.shownManagementOptions) {
			this.closeManagementOptions();
		}
		this.buildingInCategoryButtonsCol = null;
		this.buildingInCategoryButtonsColAmount = 0;
		this.buildingInCategoryButtonsNumberOfCols = 0;
		this.buttonsInCategory = new haxe_ds_StringMap();
		if(destroyBuilder && this.city.builder != null) {
			this.city.builder.cancel();
		}
		if(this.shownCategory == category && this.shownSubCategory == subCategory && !neverHide) {
			this.shownCategory = "";
		} else {
			this.shownCategory = category;
			var categoryID = category;
			if(subCategory != null) {
				categoryID += "_" + subCategory;
			}
			this.shownSubCategory = subCategory;
			if(atWidth != null && !this.gui.game.isMobile) {
				this.buildingInCategoryButtons.padding.left = atWidth;
			}
			if(subCategory != null) {
				this.createSubCategoryBackButton(atWidth);
				if(this.categoryHasMirror(categoryID)) {
					this.createSubCategoryMirrorButton(atWidth);
				}
			}
			var _g = 0;
			var _g1 = this.city.progress.resources.buildingInfoArray;
			while(_g < _g1.length) {
				var building = _g1[_g];
				++_g;
				var name = "buildings." + building.className;
				var classToBuild = $hxClasses[name];
				var unlockState = this.city.progress.unlocks.getUnlockState(classToBuild);
				var notificationState = this.city.progress.unlocks.getShouldNotifyForUnlock(classToBuild);
				if(building.category == categoryID && (unlockState == progress_UnlockState.Unlocked || unlockState == progress_UnlockState.Researched || unlockState == progress_UnlockState.Createable)) {
					this.addBuildingButton(classToBuild,unlockState,notificationState);
				}
				if(category == "Transportation" && building.className == "HyperElevator") {
					var _g2 = 0;
					var _g3 = Resources.bridgesInfo;
					while(_g2 < _g3.length) {
						var bridgeInfo = _g3[_g2];
						++_g2;
						var name1 = "miscCityElements." + bridgeInfo.className;
						var classToBuild1 = $hxClasses[name1];
						var unlockState1 = this.city.progress.unlocks.getUnlockState(classToBuild1);
						var notificationState1 = this.city.progress.unlocks.getShouldNotifyForUnlock(classToBuild1);
						if(unlockState1 == progress_UnlockState.Unlocked || unlockState1 == progress_UnlockState.Researched || unlockState1 == progress_UnlockState.Createable) {
							this.addBridgeButton(bridgeInfo,unlockState1,notificationState1);
						}
					}
				}
			}
			var _g = 0;
			var _g1 = Resources.decorationsInfo;
			while(_g < _g1.length) {
				var decoration = _g1[_g];
				++_g;
				if(decoration.category == categoryID && (decoration.specialInfo == null || decoration.specialInfo.indexOf("snow") != -1 && Config.isSnowThemed || decoration.specialInfo.indexOf("geneEditingReq") != -1 && this.city.upgrades.vars.hasGeneEditing)) {
					this.addDecorationButton(decoration);
				}
			}
			var _g = 0;
			var _g1 = Resources.worldResourcesInfo;
			while(_g < _g1.length) {
				var worldInfo = _g1[_g];
				++_g;
				if(worldInfo.category == categoryID && (worldInfo.specialInfo == null || (worldInfo.specialInfo.indexOf("snow") == -1 || this.city.progress.story.storyName == "snowWorld"))) {
					this.addWorldResourceButton(worldInfo);
				}
			}
			if(category == "Transportation" && this.city.progress.unlocks.unlockedMaterial("graphene")) {
				var unlockState = this.city.progress.unlocks.getShouldNotifyForMiscUnlock("FloatingPlatform");
				this.addFloatingPlatformButton(unlockState);
			}
			if(category == "Houses" && this.city.progress.unlocks.unlockedCustomHouses) {
				this.createCustomBuildingButton(atWidth);
			}
			this.addSubCategories(categoryID,atWidth);
			var val2 = this.buildingInCategoryButtons.padding.left;
			this.buildingInCategoryButtons.padding.left = val2 > 0 ? val2 : 0;
			this.buildingInCategoryButtons.updateSize();
		}
	}
	,addFloatingPlatformButton: function(notificationState) {
		var _gthis = this;
		this.makeSpaceForBuildingButton();
		var floatingPlatformButton = new gui_ImageButton(this.gui,this.gui.stage,this.buildingInCategoryButtonsCol,($_=this.city,$bind($_,$_.createOrRemoveFloatingPlatformBuilder)),Resources.getTexture("spr_floatingplatform"),function() {
			if(_gthis.city.builder != null) {
				if(_gthis.city.builder.builderType._hx_index == 4) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},function() {
			_gthis.showFloatingPlatformTooltip(floatingPlatformButton,false);
		});
		if(notificationState) {
			var _g = ($_=this.city.progress.unlocks,$bind($_,$_.stopNotifyMiscUnlock));
			var categoryName = "FloatingPlatform";
			var tmp = function() {
				_g(categoryName);
			};
			floatingPlatformButton.notify(true,tmp);
		}
		if(this.gui.game.isMobile) {
			this.buildingInCategoryButtonsCol.addChild(floatingPlatformButton);
		} else {
			this.buildingInCategoryButtonsCol.insertChild(floatingPlatformButton,0);
		}
	}
	,addBridgeButton: function(bridgeInfo,unlockState,notificationState) {
		var _gthis = this;
		this.makeSpaceForBuildingButton();
		var name = "miscCityElements." + bridgeInfo.className;
		var bridgeType = $hxClasses[name];
		var bridgeNeedsUnlock = unlockState == progress_UnlockState.Unlocked || !Config.hasPremium();
		var mainTexture = bridgeNeedsUnlock ? Resources.getTexture("spr_lockedbuilding@0,0,20,20") : Resources.getTexture(bridgeInfo.textureName,new common_Rectangle(66,0,20,20));
		var bridgeButton = new gui_ImageButton(this.gui,this.gui.stage,this.buildingInCategoryButtonsCol,function() {
			if(bridgeNeedsUnlock) {
				if(_gthis.city.builder != null) {
					_gthis.city.builder.cancel();
				}
				if(!Config.hasPremium()) {
					mobileSpecific_PremiumWall.showPremiumWall(_gthis.city.gui);
				} else {
					_gthis.gui.showSimpleWindow(bridgeInfo.showUnlockHint,"",true,true);
				}
				return;
			}
			_gthis.city.createOrRemoveBridgeBuilder(bridgeInfo);
		},mainTexture,function() {
			if(_gthis.city.builder != null) {
				return Type.enumEq(_gthis.city.builder.builderType,BuilderType.Bridge(bridgeInfo));
			} else {
				return false;
			}
		},function() {
			if(!Config.hasPremium()) {
				_gthis.gui.tooltip.setText(bridgeButton,common_Localize.lo("get_premium_to_unlock"));
			} else {
				_gthis.showBridgeTooltip(bridgeInfo,bridgeButton,false);
			}
		},bridgeNeedsUnlock ? Resources.getTexture("spr_lockedbuilding@22,0,20,20") : Resources.getTexture(bridgeInfo.textureName,new common_Rectangle(88,0,20,20)));
		if(notificationState) {
			var _g = ($_=this.city.progress.unlocks,$bind($_,$_.stopNotifyForUnlock));
			var element = bridgeType;
			var tmp = function() {
				_g(element);
			};
			bridgeButton.notify(true,tmp);
		}
		if(this.gui.game.isMobile) {
			this.buildingInCategoryButtonsCol.addChild(bridgeButton);
		} else {
			this.buildingInCategoryButtonsCol.insertChild(bridgeButton,0);
		}
	}
	,addSubCategories: function(category,atWidth) {
		if(category == "Decoration & Nature") {
			this.addSubCategoryButton(category,"coloredBlocks",atWidth,common_Localize.lo("colored_blocks"),"spr_coloredblock");
			this.addSubCategoryButton(category,"slantedroofs",atWidth,common_Localize.lo("slanted_roofs"),"spr_slantedroof");
			this.addSubCategoryButton(category,"slantedrooftops",atWidth,common_Localize.lo("slanted_rooftops"),"spr_slantedrooftop");
			this.addSubCategoryButton(category,"roofbottom",atWidth,common_Localize.lo("roof_bottoms"),"spr_roofbottom");
			this.addSubCategoryButton(category,"domeroofs",atWidth,common_Localize.lo("domeroofs"),"spr_domeroof");
		}
	}
	,categoryHasMirror: function(cat) {
		if(cat == "Decoration & Nature_slantedroofs") {
			return true;
		}
		return false;
	}
	,addSubCategoryButton: function(category,subCategory,atWidth,text,textureName) {
		var _gthis = this;
		this.makeSpaceForBuildingButton();
		var subCategoryButton = new gui_ImageButton(this.gui,this.gui.stage,this.buildingInCategoryButtonsCol,function() {
			gui_ColorPicker.colorPickedOnLastMultiMenuOpen = gui_ColorPicker.colorPicked;
			_gthis.showOrHideBuildingsOfCategory(category,subCategory,atWidth);
		},Resources.getTexturesByWidth(textureName,20)[0],function() {
			return false;
		},function() {
			_gthis.gui.tooltip.setText(subCategoryButton,text);
		});
		if(this.gui.game.isMobile) {
			this.buildingInCategoryButtonsCol.addChild(subCategoryButton);
		} else {
			this.buildingInCategoryButtonsCol.insertChild(subCategoryButton,0);
		}
	}
	,refreshCategoryBuildingsShown: function() {
		this.buildingButtons.destroy();
		this.allBuildingModeButtons.destroy();
		this.allManagementOptionsButtons.destroy();
		this.buttonsByCategory = new haxe_ds_StringMap();
		this.createBuildingButtons();
		if(this.shownCategory != "") {
			this.showOrHideBuildingsOfCategory(this.shownCategory,this.shownSubCategory,this.categoryButtonPosition.h[this.shownCategory],true,false,true);
		}
		this.updateGoalAttentions();
	}
	,makeSpaceForBuildingButton: function() {
		var tooManyBuildingsInCol;
		if(this.gui.game.isMobile) {
			var val2 = (this.gui.game.rect.width - 40 - this.gui.safeAreaLeft - this.gui.safeAreaRight) / 22 | 0;
			tooManyBuildingsInCol = this.buildingInCategoryButtonsColAmount >= (val2 > 2 ? val2 : 2);
		} else {
			var val2 = (this.gui.game.rect.height - 40 - this.gui.safeAreaTop - this.gui.safeAreaBottom) / 22 | 0;
			tooManyBuildingsInCol = this.buildingInCategoryButtonsColAmount >= (val2 > 2 ? val2 : 2);
		}
		if(this.buildingInCategoryButtonsCol == null || tooManyBuildingsInCol) {
			this.buildingInCategoryButtonsColAmount = 0;
			this.buildingInCategoryButtonsCol = new gui_GUIContainer(this.gui,this.gui.stage,this.buildingInCategoryButtons);
			if(this.gui.game.isMobile) {
				this.buildingInCategoryButtonsCol.direction = gui_GUIContainerDirection.Horizontal;
				this.buildingInCategoryButtonsCol.alignment = gui_GUIContainerAlignment.LeftOrTop;
				this.buildingInCategoryButtons.insertChild(this.buildingInCategoryButtonsCol,0);
			} else {
				this.buildingInCategoryButtonsCol.direction = gui_GUIContainerDirection.Vertical;
				this.buildingInCategoryButtonsCol.alignment = gui_GUIContainerAlignment.LeftOrTop;
				this.buildingInCategoryButtons.addChild(this.buildingInCategoryButtonsCol);
			}
			this.buildingInCategoryButtonsNumberOfCols += 1;
		}
		this.buildingInCategoryButtonsColAmount += 1;
	}
	,addBuildingButton: function(buildingType,unlockState,notificationState) {
		var _gthis = this;
		var sprName = Reflect.field(buildingType,"spriteName");
		var typeClassName = buildingType.__name__;
		var buildingInfo = this.city.progress.resources.buildingInfo.h[typeClassName];
		var buildingButton;
		var buildingNeedsUnlock = (buildingInfo.showUnlockHint != null || buildingInfo.specialInfo.indexOf("premium") != -1 && !Config.hasPremium()) && (unlockState == progress_UnlockState.Unlocked || buildingInfo.specialInfo.indexOf("premium") != -1 && !Config.hasPremium());
		if(buildingNeedsUnlock && this.city.progress.unlocks.getLimitedUnlockNumber(buildingType) > 0) {
			buildingNeedsUnlock = false;
		}
		var buildingPremiumWallUnlock = false;
		if(buildingNeedsUnlock && buildingInfo.specialInfo.indexOf("premium") != -1 && !Config.hasPremium()) {
			var limitedUnlockNumber = mobileSpecific_PremiumWall.getLimitedUnlockNumberPerAdForBuilding(buildingInfo);
			if(limitedUnlockNumber != null && limitedUnlockNumber > 0) {
				buildingPremiumWallUnlock = true;
			}
		}
		var isMulti = buildingInfo.specialInfo.indexOf("as_multi_decor") != -1;
		var buildings;
		var mainTextures = [Resources.getTexture(buildingNeedsUnlock ? buildingPremiumWallUnlock ? "spr_lockedbuilding@44,0,20,20" : "spr_lockedbuilding@0,0,20,20" : "" + sprName + "@0,0,20,20")];
		var backTextures = null;
		if(isMulti && !buildingNeedsUnlock) {
			if(buildingInfo.specialInfo.indexOf("has_multi_decor_spec") != -1) {
				var _this = Lambda.find(buildingInfo.specialInfo,function(si) {
					return StringTools.startsWith(si,"multi_decor_spec");
				}).split(":")[1].split(",");
				var result = new Array(_this.length);
				var _g = 0;
				var _g1 = _this.length;
				while(_g < _g1) {
					var i = _g++;
					result[i] = Resources.getTexture(_this[i] + "@0,0,20,20");
				}
				mainTextures = result;
				var _this = Lambda.find(buildingInfo.specialInfo,function(si) {
					return StringTools.startsWith(si,"multi_decor_spec");
				}).split(":")[1].split(",");
				var result = new Array(_this.length);
				var _g = 0;
				var _g1 = _this.length;
				while(_g < _g1) {
					var i = _g++;
					result[i] = Resources.getTexture(_this[i] + "@44,0,20,20");
				}
				backTextures = result;
			} else {
				mainTextures = Resources.getTexturesByWidth(sprName,20);
			}
			var _g = [];
			var _g1 = 0;
			var _g2 = mainTextures.length;
			while(_g1 < _g2) {
				var i = _g1++;
				_g.push(i);
			}
			buildings = _g;
		} else {
			buildings = [0];
		}
		var hasCAButton = false;
		if(buildingInfo.specialInfo.indexOf("as_multi_decor_anycolor") != -1 && gui_ColorPicker.colorPickedOnLastMultiMenuOpen > -1) {
			buildings.splice(0,0,mainTextures.length - 1);
			hasCAButton = true;
		}
		var _g = 0;
		var _g1 = buildings.length;
		while(_g < _g1) {
			var i = [_g++];
			var bld = [buildings[i[0]]];
			var colorAppearance = [-1];
			if(i[0] == 0 && bld[0] == mainTextures.length - 1 && hasCAButton) {
				colorAppearance[0] = gui_ColorPicker.colorPickedOnLastMultiMenuOpen;
			}
			this.makeSpaceForBuildingButton();
			buildingButton = new gui_ImageButton(this.gui,this.gui.stage,this.buildingInCategoryButtonsCol,(function(colorAppearance,bld,i) {
				return function() {
					if(_gthis.gui.game.isMobile) {
						_gthis.closeExtraBuildingModes();
					}
					if(buildingNeedsUnlock) {
						if(_gthis.city.builder != null) {
							_gthis.city.builder.cancel();
						}
						if(buildingInfo.specialInfo.indexOf("premium") != -1 && !Config.hasPremium()) {
							mobileSpecific_PremiumWall.showPremiumWall(_gthis.city.gui,buildingInfo,_gthis.city);
						} else {
							_gthis.gui.showSimpleWindow(buildingInfo.showUnlockHint,"",true,true);
						}
						return;
					}
					if(buildingInfo.specialInfo.indexOf("as_multi_decor_anycolor") != -1 && i[0] == buildings.length - 1) {
						if(_gthis.city.builder != null) {
							_gthis.city.builder.cancel();
						}
						_gthis.city.gui.clearWindowStack();
						gui_ColorPickerWindow.createWindow(_gthis.city,(function(bld) {
							return function(pickedCol) {
								_gthis.city.createOrRemoveBuilder(buildingType,false,bld[0],buildingInfo.specialInfo.indexOf("mirrorable") != -1 && _gthis.mirrored,pickedCol);
							};
						})(bld));
					} else if(_gthis.gui.get_keyboard().down[17]) {
						var foundBuilding = cityActions_CityHighlightBuildingsOfType.findLeastUpgraded(_gthis.city,buildingType);
						if(foundBuilding == null) {
							_gthis.city.createOrRemoveBuilder(buildingType,false,bld[0],buildingInfo.specialInfo.indexOf("mirrorable") != -1 && _gthis.mirrored,colorAppearance[0]);
						} else {
							foundBuilding.showWindow();
						}
					} else {
						_gthis.city.createOrRemoveBuilder(buildingType,false,bld[0],buildingInfo.specialInfo.indexOf("mirrorable") != -1 && _gthis.mirrored,colorAppearance[0]);
					}
				};
			})(colorAppearance,bld,i),mainTextures[bld[0]],(function(colorAppearance,bld,i) {
				return function() {
					if(_gthis.city.builder != null && _gthis.city.builder.get_buildingToBuild() == buildingType && _gthis.city.builder.decorationAppearance == bld[0] && (!hasCAButton || i[0] != buildings.length - 1)) {
						return _gthis.city.builder.decorationAppearanceColor == colorAppearance[0];
					} else {
						return false;
					}
				};
			})(colorAppearance,bld,i),(function() {
				return function() {
					if(buildingNeedsUnlock) {
						if(buildingInfo.specialInfo.indexOf("premium") != -1 && !Config.hasPremium()) {
							if(buildingPremiumWallUnlock) {
								_gthis.gui.tooltip.setText(buildingButton,common_Localize.lo("get_premium_or_ad_to_unlock"));
							} else {
								_gthis.gui.tooltip.setText(buildingButton,common_Localize.lo("get_premium_to_unlock"));
							}
						} else {
							_gthis.gui.tooltip.setText(buildingButton,buildingInfo.showUnlockHint);
						}
						return;
					}
					if(!_gthis.gui.get_keyboard().down[17]) {
						_gthis.showBuildingTooltip(buildingInfo,buildingType,buildingButton);
					} else {
						cityActions_CityHighlightBuildingsOfType.doHighlight(_gthis.city,buildingType);
					}
				};
			})(),backTextures == null ? buildingInfo.buttonBack == "none" ? null : Resources.getTexture(buildingNeedsUnlock ? "spr_lockedbuilding@22,0,20,20" : buildingInfo.buttonBack == null ? "" + sprName + "@44,0,20,20" : buildingInfo.buttonBack) : backTextures[bld[0]]);
			if(colorAppearance[0] > -1) {
				buildingButton.imageSprite.tint = colorAppearance[0];
			}
			if(notificationState) {
				buildingButton.notify(true,(function(_g,element) {
					return function() {
						_g[0](element[0]);
					};
				})([($_=this.city.progress.unlocks,$bind($_,$_.stopNotifyForUnlock))],[buildingType]));
			}
			if(this.mirrored && buildingInfo.specialInfo.indexOf("mirrorable") != -1) {
				buildingButton.mirror();
			}
			if(buildingInfo.specialInfo.indexOf("as_multi_decor_anycolor") != -1 && i[0] == buildings.length - 1) {
				buildingButton.addExtraSprite("spr_recolorable");
			}
			this.buttonsInCategory.h[typeClassName] = buildingButton;
			if(this.gui.game.isMobile) {
				this.buildingInCategoryButtonsCol.addChild(buildingButton);
			} else {
				this.buildingInCategoryButtonsCol.insertChild(buildingButton,0);
			}
			if(this.shownSubCategory != null && i[0] == 0 && this.city.builder == null) {
				this.city.createOrRemoveBuilder(buildingType,true,bld[0],buildingInfo.specialInfo.indexOf("mirrorable") != -1 && this.mirrored,colorAppearance[0]);
			}
		}
	}
	,showBuildingTooltipCustomHouse: function(properties,tooltipContext,continousDisplay) {
		if(continousDisplay == null) {
			continousDisplay = false;
		}
		var cost = properties.getCost(this.city);
		var extraInfo = [];
		var extraInfo2 = [];
		var buildingDescription = "";
		var operatingCost = new Materials();
		var operatingCostText = "";
		extraInfo.push({ texture : Resources.getTexture("spr_residents"), text : properties.customCapacity == null ? "null" : "" + properties.customCapacity});
		extraInfo.push({ texture : Resources.getTexture("spr_happiness"), text : properties.customAttractiveness == null ? "null" : "" + properties.customAttractiveness});
		if(properties.bonuses.indexOf(3) != -1) {
			operatingCost = this.city.simulation.operatingCost.calculateTeleporterCost(2);
		}
		if(operatingCost != null && operatingCost.any()) {
			operatingCostText = common_Localize.lo("operating_cost_pd") + " ";
		}
		if(continousDisplay) {
			this.gui.tooltip.setTextForContinuous(buildingDescription,common_Localize.lo("building_a_building",[common_Localize.lo("buildinginfo.json/CustomHouse.name")]),cost,extraInfo,extraInfo2,operatingCost,operatingCostText);
		} else {
			this.gui.tooltip.setText(tooltipContext,buildingDescription,common_Localize.lo("buildinginfo.json/CustomHouse.name"),cost,extraInfo,extraInfo2,operatingCost,operatingCostText);
		}
	}
	,showBuildingTooltip: function(buildingInfo,buildingType,tooltipContext,continousDisplay,decorationAppearanceColor) {
		if(decorationAppearanceColor == null) {
			decorationAppearanceColor = -1;
		}
		if(continousDisplay == null) {
			continousDisplay = false;
		}
		var cost = this.city.progress.buildingCost.getBuildingCost(buildingInfo);
		if(this.city.progress.unlocks.getUnlockState(buildingType) == progress_UnlockState.Researched) {
			cost.knowledge = 0;
		}
		var extraInfo = [];
		var extraInfo2;
		if(buildingInfo.tooltipBottomIconInfo != null) {
			var _this = buildingInfo.tooltipBottomIconInfo;
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				var ei = _this[i];
				result[i] = { text : ei.text, texture : Resources.getTexture(ei.texture)};
			}
			extraInfo2 = result;
		} else {
			extraInfo2 = [];
		}
		if(buildingInfo.jobs != null && buildingInfo.jobs != 0) {
			extraInfo.push({ texture : Resources.getTexture("spr_work"), text : buildingInfo.jobs == null ? "null" : "" + buildingInfo.jobs});
		}
		if(buildingInfo.residents != null && buildingInfo.residents != 0) {
			extraInfo.push({ texture : Resources.getTexture("spr_residents"), text : buildingInfo.residents == null ? "null" : "" + buildingInfo.residents});
		}
		if(buildingInfo.quality != null && buildingInfo.quality != 0) {
			extraInfo.push({ texture : Resources.getTexture("spr_happiness"), text : buildingInfo.quality == null ? "null" : "" + buildingInfo.quality});
		}
		if(this.city.upgrades.vars.hasGalacticLibrary && buildingInfo.specialInfo.indexOf("notUniqueIfGalacticLibrary") != -1) {
			var tmp = Resources.getTexture("spr_uniquebuilding");
			var text2 = common_Localize.lo("limitedBuilding",["2"]);
			extraInfo.push({ texture : tmp, text : Lambda.count(this.city.permanents,function(pm) {
				return pm.is(buildingType);
			}) >= 2 ? "[red]" + text2 : text2});
		} else if(buildingInfo.specialInfo.indexOf("unique") != -1) {
			extraInfo.push({ texture : Resources.getTexture("spr_uniquebuilding"), text : common_ArrayExtensions.any(this.city.permanents,function(pm) {
				return pm.is(buildingType);
			}) ? "[red]" + common_Localize.lo("already_built") : common_Localize.lo("unique")});
		} else if(this.city.progress.unlocks.getLimitedUnlockNumber(buildingType) != null) {
			extraInfo.push({ texture : Resources.getTexture("spr_uniquebuilding"), text : common_Localize.lo("premium_trial")});
		}
		if(buildingInfo.specialInfo.indexOf("limited") != -1) {
			var tmp = Resources.getTexture("spr_uniquebuilding");
			var limitedToCitizens = Std.parseInt(Lambda.find(buildingInfo.specialInfo,function(si) {
				return StringTools.startsWith(si,"limitedToCitizens");
			}).split(":")[1]);
			var currentLimit = Math.ceil(this.city.simulation.citizens.length / limitedToCitizens);
			var buildingNumber = Lambda.count(this.city.permanents,function(pm) {
				return pm.is(buildingType);
			});
			var text2 = common_Localize.lo("limited_per_citizens",[limitedToCitizens]);
			extraInfo.push({ texture : tmp, text : buildingNumber >= currentLimit ? "[red]" + text2 : text2});
		}
		if(buildingInfo.specialInfo.indexOf("halloween") != -1) {
			extraInfo.push({ texture : Resources.getTexture("spr_halloween"), text : common_Localize.lo("halloween")});
		}
		if(decorationAppearanceColor >= 0) {
			var col = decorationAppearanceColor;
			extraInfo.push({ texture : Resources.getTexture("spr_colorsample_10x10"), text : "[i" + thx_color_Rgb.toString(col) + "]"});
		}
		var buildingDescription = buildingInfo.description;
		if(common_ArrayExtensions.any(this.city.permanents,function(pm) {
			return pm.is(buildingType);
		})) {
			buildingDescription = StringTools.replace(buildingDescription,"!unlocks","");
		} else {
			buildingDescription = StringTools.replace(buildingDescription,"!unlocks"," " + common_Localize.lo("also_unlocks_new"));
		}
		buildingDescription += this.city.progress.buildingCost.getBuildingCostDescriptionAdder(buildingInfo);
		var operatingCost = this.city.simulation.operatingCost.getOperatingCost(buildingInfo);
		var operatingCostText = "";
		if(operatingCost != null && operatingCost.any()) {
			operatingCostText = this.city.simulation.operatingCost.getOperatingCostReason(buildingInfo);
		}
		if(continousDisplay) {
			this.gui.tooltip.setTextForContinuous(buildingDescription,common_Localize.lo("building_a_building",[buildingInfo.name]),cost,extraInfo,extraInfo2,operatingCost,operatingCostText);
		} else {
			this.gui.tooltip.setText(tooltipContext,buildingDescription,buildingInfo.name,cost,extraInfo,extraInfo2,operatingCost,operatingCostText);
		}
	}
	,addDecorationButton: function(decorationsInfo) {
		var _gthis = this;
		this.makeSpaceForBuildingButton();
		var decorationButton;
		var _g = ($_=this.city,$bind($_,$_.createOrRemoveDecorationBuilder));
		var decorationInfo = decorationsInfo;
		var value = function() {
			_g(decorationInfo);
		};
		decorationButton = new gui_ImageButton(this.gui,this.gui.stage,this.buildingInCategoryButtonsCol,value,Resources.getTexture("" + decorationsInfo.textureName + "@0,0,20,20"),function() {
			if(_gthis.city.builder != null) {
				var _g = _gthis.city.builder.builderType;
				var value;
				if(_g._hx_index == 1) {
					var d = _g.decorationInfo;
					value = d.name;
				} else {
					value = "";
				}
				return value == decorationsInfo.name;
			} else {
				return false;
			}
		},function() {
			_gthis.showDecorationTooltip(decorationsInfo,decorationButton);
		});
		if(this.gui.game.isMobile) {
			this.buildingInCategoryButtonsCol.addChild(decorationButton);
		} else {
			this.buildingInCategoryButtonsCol.insertChild(decorationButton,0);
		}
	}
	,showDecorationTooltip: function(decorationsInfo,target,continousDisplay) {
		if(continousDisplay == null) {
			continousDisplay = false;
		}
		var cost = Materials.fromDecorationInfo(decorationsInfo);
		if(continousDisplay) {
			if(decorationsInfo.isRemoveDecoration) {
				this.gui.tooltip.setTextForContinuous(decorationsInfo.description,decorationsInfo.name + "",cost);
			} else {
				this.gui.tooltip.setTextForContinuous(decorationsInfo.description,common_Localize.lo("placing_a_decoration",[decorationsInfo.name]),cost);
			}
		} else {
			this.gui.tooltip.setText(target,decorationsInfo.description,decorationsInfo.name,cost);
		}
	}
	,showFloatingPlatformTooltip: function(target,continousDisplay) {
		if(continousDisplay == null) {
			continousDisplay = false;
		}
		var cost = Builder.floatingPlatformCost;
		if(continousDisplay) {
			this.gui.tooltip.setTextForContinuous(common_Localize.lo("floating_platform_description"),common_Localize.lo("building_a_building",[common_Localize.lo("floating_platform")]),cost);
		} else {
			this.gui.tooltip.setText(target,common_Localize.lo("floating_platform_description"),common_Localize.lo("floating_platform"),cost);
		}
	}
	,showBridgeTooltip: function(bridgeInfo,target,continousDisplay) {
		if(continousDisplay == null) {
			continousDisplay = false;
		}
		var cost = Materials.fromBridgeInfo(bridgeInfo);
		var name = "miscCityElements." + bridgeInfo.className;
		if(this.city.progress.unlocks.getUnlockState($hxClasses[name]) == progress_UnlockState.Researched) {
			cost.knowledge = 0;
		}
		if(continousDisplay) {
			this.gui.tooltip.setTextForContinuous(bridgeInfo.description,common_Localize.lo("building_a_building",[bridgeInfo.name]),cost);
		} else {
			this.gui.tooltip.setText(target,bridgeInfo.description,bridgeInfo.name,cost);
		}
	}
	,addWorldResourceButton: function(worldResourceInfo) {
		var _gthis = this;
		var name = "worldResources." + worldResourceInfo.className;
		var classToBuild = $hxClasses[name];
		var unlockState = this.city.progress.unlocks.getUnlockState(classToBuild);
		if(unlockState == progress_UnlockState.Locked) {
			return;
		}
		this.makeSpaceForBuildingButton();
		var worldResourceButton;
		var _g = ($_=this.city,$bind($_,$_.createOrRemoveWorldResourceBuilder));
		var resourceInfo = worldResourceInfo;
		var value = function() {
			_g(resourceInfo);
		};
		worldResourceButton = new gui_ImageButton(this.gui,this.gui.stage,this.buildingInCategoryButtonsCol,value,Resources.getTexture("" + worldResourceInfo.textureName),function() {
			if(_gthis.city.builder != null) {
				var _g = _gthis.city.builder.builderType;
				var value;
				if(_g._hx_index == 2) {
					var d = _g.resourceInfo;
					value = d;
				} else {
					value = null;
				}
				return value == worldResourceInfo;
			} else {
				return false;
			}
		},function() {
			_gthis.showWorldResourceTooltip(worldResourceInfo,worldResourceButton);
		});
		if(this.gui.game.isMobile) {
			this.buildingInCategoryButtonsCol.addChild(worldResourceButton);
		} else {
			this.buildingInCategoryButtonsCol.insertChild(worldResourceButton,0);
		}
	}
	,showWorldResourceTooltip: function(worldResourceInfo,target,continousDisplay) {
		if(continousDisplay == null) {
			continousDisplay = false;
		}
		var cost = Materials.fromWorldResourceInfo(worldResourceInfo);
		if(continousDisplay) {
			this.gui.tooltip.setTextForContinuous(worldResourceInfo.description,worldResourceInfo.specialInfo.indexOf("planting") != -1 ? common_Localize.lo("planting_a_forest",[worldResourceInfo.name]) : common_Localize.lo("placing_a_decoration",[worldResourceInfo.name]),cost);
		} else {
			this.gui.tooltip.setText(target,worldResourceInfo.description,worldResourceInfo.name,cost);
		}
	}
	,createCustomBuildingButton: function(atWidth) {
		var _gthis = this;
		this.makeSpaceForBuildingButton();
		var customBuildingButton = new gui_ImageButton(this.gui,this.gui.stage,this.buildingInCategoryButtonsCol,function() {
			if(_gthis.gui.window != null && _gthis.gui.windowRelatedTo == "customHouseCreate") {
				_gthis.gui.closeWindow();
			} else {
				_gthis.gui.clearWindowStack();
				if(_gthis.city.builder != null) {
					_gthis.city.builder.cancel();
				}
				gui_CustomHouseWindow.createWindow(_gthis.city,_gthis.gui,null,_gthis.city.progress.currentHouseProperties);
			}
		},Resources.getTexture("spr_customhouse_menu"),function() {
			if(!(_gthis.gui.window != null && _gthis.gui.windowRelatedTo == "customHouseCreate")) {
				if(_gthis.city.builder != null) {
					return _gthis.city.builder.customHouseProperties != null;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},function() {
			_gthis.gui.tooltip.setText(customBuildingButton,common_Localize.lo("buildinginfo.json/CustomHouse.name"));
		});
		if(this.gui.game.isMobile) {
			this.buildingInCategoryButtonsCol.addChild(customBuildingButton);
		} else {
			this.buildingInCategoryButtonsCol.insertChild(customBuildingButton,0);
		}
	}
	,createSubCategoryMirrorButton: function(atWidth) {
		var _gthis = this;
		this.makeSpaceForBuildingButton();
		var subCategoryMirror = new gui_ImageButton(this.gui,this.gui.stage,this.buildingInCategoryButtonsCol,function() {
			var bld = null;
			var dec = null;
			var col = null;
			if(_gthis.city.builder != null) {
				bld = _gthis.city.builder.get_buildingToBuild();
				dec = _gthis.city.builder.decorationAppearance;
				col = _gthis.city.builder.decorationAppearanceColor;
			}
			_gthis.mirrored = !_gthis.mirrored;
			_gthis.showOrHideBuildingsOfCategory(_gthis.shownCategory,_gthis.shownSubCategory,atWidth,true);
			if(bld != null) {
				_gthis.city.createOrRemoveBuilder(bld,true,dec,_gthis.mirrored,col);
			}
		},Resources.getTexture("spr_mirror"),function() {
			return false;
		},function() {
			_gthis.gui.tooltip.setText(subCategoryMirror,common_Localize.lo("mirror"));
		});
		if(this.gui.game.isMobile) {
			this.buildingInCategoryButtonsCol.addChild(subCategoryMirror);
		} else {
			this.buildingInCategoryButtonsCol.insertChild(subCategoryMirror,0);
		}
	}
	,createSubCategoryBackButton: function(atWidth) {
		var _gthis = this;
		this.makeSpaceForBuildingButton();
		var subCategoryBack = new gui_ImageButton(this.gui,this.gui.stage,this.buildingInCategoryButtonsCol,function() {
			_gthis.showOrHideBuildingsOfCategory(_gthis.shownCategory,null,atWidth);
		},Resources.getTexture("spr_arrow_back"),function() {
			return false;
		},function() {
			_gthis.gui.tooltip.setText(subCategoryBack,common_Localize.lo("back"));
		});
		if(this.gui.game.isMobile) {
			this.buildingInCategoryButtonsCol.addChild(subCategoryBack);
		} else {
			this.buildingInCategoryButtonsCol.insertChild(subCategoryBack,0);
		}
	}
	,addBuildingModeButtons: function() {
		var _gthis = this;
		var buildingModeButton;
		var getBuildingModeTexture = function(buildingMode) {
			switch(buildingMode._hx_index) {
			case 0:
				return "spr_icon_buildingmode_ontop";
			case 1:
				return "spr_icon_buildingmode_insert";
			case 2:
				return "spr_icon_buildingmode_replace";
			case 3:
				return "spr_icon_buildingmode_drag";
			case 4:
				return "spr_icon_buildingmode_dragreplace";
			case 5:
				return "spr_icon_buildingmode_destroy";
			case 6:
				return "spr_icon_buildingmode_destroyleavinghole";
			}
		};
		var showTooltipForBuildingMode = function(target,buildingMode,asContinuous) {
			var doTooltipSet = function(target,text,title) {
				if(asContinuous) {
					_gthis.gui.tooltip.setTextForContinuous(text,title);
				} else {
					_gthis.gui.tooltip.setText(target,text,title);
				}
			};
			if(_gthis.gui.game.isMobile) {
				switch(buildingMode._hx_index) {
				case 0:
					doTooltipSet(target,common_Localize.lo("build_mode_normal_explanation"),common_Localize.lo("build_mode_normal"));
					break;
				case 1:
					doTooltipSet(target,common_Localize.lo("build_anywhere"),common_Localize.lo("build_mode_insert"));
					break;
				case 2:
					doTooltipSet(target,common_Localize.lo("build_mode_replace_explanation"),common_Localize.lo("build_mode_replace"));
					break;
				case 3:
					doTooltipSet(target,common_Localize.lo("build_mode_multi_explanation"),common_Localize.lo("build_mode_multi"));
					break;
				case 4:
					doTooltipSet(target,common_Localize.lo("build_mode_multi_replace_explanation"),common_Localize.lo("build_mode_multi_replace"));
					break;
				case 5:
					doTooltipSet(target,common_Localize.lo("build_mode_destroy_explanation"),common_Localize.lo("build_mode_destroy"));
					break;
				case 6:
					doTooltipSet(target,common_Localize.lo("build_mode_destroyleavinghole_explanation"),common_Localize.lo("build_mode_destroyleavinghole"));
					break;
				}
				return;
			}
			switch(buildingMode._hx_index) {
			case 0:
				doTooltipSet(target,common_Localize.lo("build_mode_normal_explanation_pc") + " " + common_Localize.lo("exception") + " " + (_gthis.city.builder == null ? common_Localize.lo("click_rooftop_selected") : common_Localize.lo("click_rooftop")) + " ",common_Localize.lo("build_mode_normal"));
				break;
			case 1:
				doTooltipSet(target,common_Localize.lo("build_anywhere_pc") + " " + (_gthis.city.builder == null ? common_Localize.lo("build_mode_insert_explanation_pc") : common_Localize.lo("build_mode_insert_explanation_pc_b")),common_Localize.lo("build_mode_insert"));
				break;
			case 2:
				doTooltipSet(target,common_Localize.lo("build_mode_replace_explanation_pc"),common_Localize.lo("build_mode_replace"));
				break;
			case 3:
				doTooltipSet(target,common_Localize.lo("build_mode_multi_explanation_pc"),common_Localize.lo("build_mode_multi"));
				break;
			case 4:
				doTooltipSet(target,common_Localize.lo("build_mode_multi_replace_explanation"),common_Localize.lo("build_mode_multi_replace"));
				break;
			case 5:
				doTooltipSet(target,common_Localize.lo("build_mode_destroy_explanation"),common_Localize.lo("build_mode_destroy"));
				break;
			case 6:
				doTooltipSet(target,common_Localize.lo("build_mode_destroyleavinghole_explanation"),common_Localize.lo("build_mode_destroyleavinghole"));
				break;
			}
		};
		var showExtraBuildingModes = function() {
			var allBuildingModes = [BuildingMode.Normal,BuildingMode.Insert,BuildingMode.Replace,BuildingMode.Drag,BuildingMode.DragReplace,BuildingMode.Destroy,BuildingMode.DestroyLeavingHole];
			var _g = 0;
			while(_g < allBuildingModes.length) {
				var bm = [allBuildingModes[_g]];
				++_g;
				var imgButton = [];
				imgButton[0] = new gui_ImageButton(_gthis.gui,_gthis.gui.stage,_gthis.allBuildingModeButtons,(function(bm) {
					return function() {
						_gthis.city.buildingMode = bm[0];
						if(_gthis.gui.game.isMobile && _gthis.city.builder != null) {
							_gthis.city.builder.invalidateCache();
						}
						if(bm[0] != BuildingMode.Destroy && bm[0] != BuildingMode.DestroyLeavingHole) {
							if(_gthis.city.builder == null && _gthis.city.specialActionOld != null) {
								_gthis.city.specialActionOld.activate();
							}
							if(!_gthis.gui.game.isMobile || _gthis.shownCategory != "") {
								if(_gthis.gui.game.isMobile) {
									var _gthis1 = _gthis.gui;
									var value;
									switch(bm[0]._hx_index) {
									case 0:
										value = common_Localize.lo("build_mode_normal_explanation");
										break;
									case 1:
										value = common_Localize.lo("build_anywhere");
										break;
									case 2:
										value = common_Localize.lo("build_mode_replace_explanation");
										break;
									case 3:
										value = common_Localize.lo("build_mode_multi_explanation");
										break;
									case 5:
										value = common_Localize.lo("build_mode_destroy_explanation");
										break;
									case 6:
										value = common_Localize.lo("build_mode_destroyleavinghole_explanation");
										break;
									default:
										value = "";
									}
									var value1;
									switch(bm[0]._hx_index) {
									case 0:
										value1 = common_Localize.lo("build_mode_normal");
										break;
									case 1:
										value1 = common_Localize.lo("build_mode_insert");
										break;
									case 2:
										value1 = common_Localize.lo("build_mode_replace");
										break;
									case 3:
										value1 = common_Localize.lo("build_mode_multi");
										break;
									case 5:
										value1 = common_Localize.lo("build_mode_destroy");
										break;
									case 6:
										value1 = common_Localize.lo("build_mode_destroyleavinghole");
										break;
									default:
										value1 = "";
									}
									_gthis1.notify(value,value1,120);
								}
								_gthis.closeExtraBuildingModes();
							}
						} else {
							if(_gthis.city.specialAction != null) {
								_gthis.city.specialAction.deactivate();
							}
							if(_gthis.gui.game.isMobile) {
								_gthis.allBuildingModeButtons.padding.bottom = 0;
								_gthis.allBuildingModeButtons.updateSize();
							}
							_gthis.showOrHideBuildingsOfCategory(_gthis.shownCategory,_gthis.shownSubCategory,_gthis.categoryButtonPosition.h[_gthis.shownCategory],false,true,true);
						}
					};
				})(bm),Resources.getTexture(getBuildingModeTexture(bm[0])),(function(bm) {
					return function() {
						return _gthis.city.buildingMode == bm[0];
					};
				})(bm),(function(imgButton,bm) {
					return function() {
						showTooltipForBuildingMode(imgButton[0],bm[0],false);
					};
				})(imgButton,bm));
				if(_gthis.gui.game.isMobile) {
					_gthis.allBuildingModeButtons.addChild(imgButton[0]);
				} else {
					_gthis.allBuildingModeButtons.insertChild(imgButton[0],0);
				}
			}
			if(_gthis.gui.game.isMobile) {
				_gthis.allBuildingModeButtons.padding.bottom = _gthis.shownCategory != "" ? _gthis.buildingInCategoryButtons.baseHeight : 0;
				_gthis.allBuildingModeButtons.updateSize();
			}
			if(_gthis.gui.game.isMobile && _gthis.shownManagementOptions) {
				_gthis.closeManagementOptions();
			}
		};
		var toggleMoreBuildingModesMenu = function() {
			var maxPos = 0;
			var pos = haxe_ds_StringMap.valueIterator(_gthis.categoryButtonPosition.h);
			while(pos.hasNext()) {
				var pos1 = pos.next();
				maxPos = pos1 + 20 + 2;
			}
			if(_gthis.shownBuildingModes) {
				_gthis.closeExtraBuildingModes();
			} else {
				showExtraBuildingModes();
				_gthis.shownBuildingModes = true;
			}
		};
		if(!this.gui.game.isMobile) {
			this.allBuildingModeButtons.padding.left = this.categoryButtons.rect.width;
		}
		buildingModeButton = new gui_ImageButton(this.gui,this.gui.stage,this.categoryButtons,function() {
			if(_gthis.gui.game.isMobile) {
				toggleMoreBuildingModesMenu();
			} else {
				_gthis.city.buildingMode = _gthis.city.buildingMode == BuildingMode.Normal ? BuildingMode.Insert : BuildingMode.Normal;
				_gthis.closeExtraBuildingModes();
			}
		},Resources.getTexture(getBuildingModeTexture(this.city.buildingMode)),function() {
			if(!_gthis.gui.game.isMobile) {
				return false;
			}
			return _gthis.shownBuildingModes;
		},function() {
			showTooltipForBuildingMode(buildingModeButton,_gthis.city.buildingMode,false);
		},null,"spr_transparentbutton");
		var currentlyShownBuildingMode = BuildingMode.Normal;
		buildingModeButton.onUpdate = function() {
			if(currentlyShownBuildingMode != _gthis.city.buildingMode) {
				buildingModeButton.updateTexture(Resources.getTexture(getBuildingModeTexture(_gthis.city.buildingMode)));
				currentlyShownBuildingMode = _gthis.city.buildingMode;
			}
			if(_gthis.gui.game.isMobile && _gthis.shownBuildingModes && _gthis.city.builder == null) {
				showTooltipForBuildingMode(buildingModeButton,_gthis.city.buildingMode,true);
			}
		};
		this.categoryButtons.addChild(buildingModeButton);
		if(!this.gui.game.isMobile) {
			var moreBuildingModesButton = new gui_ImageButton(this.gui,this.gui.stage,this.categoryButtons,toggleMoreBuildingModesMenu,Resources.getTexture("spr_morebuildingmodes_arrowup"),function() {
				return _gthis.shownBuildingModes;
			},function() {
				_gthis.gui.tooltip.setText(moreBuildingModesButton,common_Localize.lo("all_building_modes"));
			},null,"spr_morebuildingmodebuttons");
			this.categoryButtons.addChild(moreBuildingModesButton);
		}
		if(this.shownBuildingModes) {
			showExtraBuildingModes();
		}
	}
	,closeExtraBuildingModes: function() {
		this.allBuildingModeButtons.clear();
		this.shownBuildingModes = false;
		if(this.city.buildingMode == BuildingMode.Destroy || this.city.buildingMode == BuildingMode.DestroyLeavingHole) {
			this.city.buildingMode = BuildingMode.Normal;
			if(this.city.builder == null && this.city.specialActionOld != null) {
				this.city.specialActionOld.activate();
			}
		}
	}
	,showManagementOptions: function(parentElement) {
		var _gthis = this;
		if(parentElement == null) {
			parentElement = this.allManagementOptionsButtons;
		}
		if(this.gui.game.isMobile && this.shownBuildingModes) {
			this.closeExtraBuildingModes();
		}
		if(this.city.progress.story.storyInfo.useInviteCitizens) {
			var imgButton = new gui_ImageButton(this.gui,this.gui.stage,parentElement,function() {
				if(_gthis.gui.windowRelatedTo == "invite_people") {
					_gthis.gui.closeWindow();
				} else {
					gui_infoWindows_InvitePeopleWindow.createWindow(_gthis.city);
				}
			},Resources.getTexture("spr_icon_invitepeople"),function() {
				return _gthis.gui.windowRelatedTo == "invite_people";
			},function() {
				_gthis.gui.tooltip.setText(imgButton,common_Localize.lo("invite_people"));
			});
			if(this.gui.game.isMobile) {
				parentElement.addChild(imgButton);
			} else {
				parentElement.insertChild(imgButton,0);
			}
			this.inviteCitizensButton = imgButton;
		}
		var imgButton1 = new gui_ImageButton(this.gui,this.gui.stage,parentElement,function() {
			if(_gthis.city.viewActions.isFollowOpen()) {
				_gthis.city.specialAction.deactivate(true);
			} else {
				_gthis.city.viewActions.showFollow();
			}
		},Resources.getTexture("spr_icon_followcitizen"),function() {
			return _gthis.city.viewActions.isFollowOpen();
		},function() {
			_gthis.gui.tooltip.setText(imgButton1,common_Localize.lo("follow_citizen"));
		});
		if(this.gui.game.isMobile) {
			parentElement.addChild(imgButton1);
		} else {
			parentElement.insertChild(imgButton1,0);
		}
		var imgButton2 = new gui_ImageButton(this.gui,this.gui.stage,parentElement,function() {
			if(_gthis.city.gui.windowRelatedTo == _gthis.city.simulation.favoriteCitizens) {
				_gthis.city.gui.closeWindow();
			} else {
				_gthis.gui.clearWindowStack();
				gui_MultiFollowWindow.createWindow(_gthis.city,_gthis.city.simulation.favoriteCitizens,common_Localize.lo("favorite_citizens"),null,common_Localize.lo("no_favorite_citizens"),function() {
					_gthis.city.gui.windowInner.addChild(new gui_TextElement(_gthis.city.gui.windowInner,_gthis.city.gui.innerWindowStage,null,function() {
						if(_gthis.city.simulation.recentlyPassedFavoriteCitizens.length == 0) {
							return "";
						}
						return common_Localize.lo("favorite_citizens_passed") + "\n- " + _gthis.city.simulation.recentlyPassedFavoriteCitizens.join("\n- ");
					}));
				});
			}
		},Resources.getTexture("spr_icon_favoritepeople"),function() {
			if(_gthis.city.gui.window != null) {
				return _gthis.city.gui.windowRelatedTo == _gthis.city.simulation.favoriteCitizens;
			} else {
				return false;
			}
		},function() {
			_gthis.gui.tooltip.setText(imgButton2,common_Localize.lo("favorite_citizens"));
		});
		if(this.gui.game.isMobile) {
			parentElement.addChild(imgButton2);
		} else {
			parentElement.insertChild(imgButton2,0);
		}
		var imgButton3 = new gui_ImageButton(this.gui,this.gui.stage,parentElement,function() {
			if(_gthis.gui.windowRelatedTo == "global_upgrades") {
				_gthis.gui.closeWindow();
			} else {
				_gthis.gui.createWindow("global_upgrades");
				gui_GlobalUpgradeWindow.create(_gthis.city,_gthis.gui,_gthis.gui.innerWindowStage,_gthis.gui.windowInner);
			}
		},Resources.getTexture("spr_icon_upgrade"),function() {
			return _gthis.gui.windowRelatedTo == "global_upgrades";
		},function() {
			_gthis.gui.tooltip.setText(imgButton3,common_Localize.lo("upgrades_and_policies"));
		});
		if(this.gui.game.isMobile) {
			parentElement.addChild(imgButton3);
		} else {
			parentElement.insertChild(imgButton3,0);
		}
		var imgButton4 = new gui_ImageButton(this.gui,this.gui.stage,parentElement,function() {
			if(_gthis.gui.windowRelatedTo == "highlight_buildings") {
				_gthis.gui.closeWindow();
			} else {
				gui_infoWindows_FindBuildingsOfType.createWindow(_gthis.city);
			}
		},Resources.getTexture("spr_icon_findbuilding"),function() {
			return _gthis.gui.windowRelatedTo == "highlight_buildings";
		},function() {
			if(_gthis.gui.game.isMobile) {
				_gthis.gui.tooltip.setText(imgButton4,common_Localize.lo("highlight_buildings"));
			} else {
				_gthis.gui.tooltip.setText(imgButton4,common_Localize.lo("ctrl_to_highlight"),common_Localize.lo("highlight_buildings"));
			}
		});
		if(this.gui.game.isMobile) {
			parentElement.addChild(imgButton4);
		} else {
			parentElement.insertChild(imgButton4,0);
		}
		if(Config.hasPremium() || 5 == 8) {
			var imgButton5 = new gui_ImageButton(this.gui,this.gui.stage,parentElement,function() {
				if(_gthis.gui.windowRelatedTo == "travel_time") {
					_gthis.gui.closeWindow();
				} else {
					mobileSpecific_RewardedAdWall.rewardedOrPremiumGate(_gthis.gui,common_Localize.lo("commute_explorer_gate"),"commute_explorer",31,function() {
						gui_infoWindows_TravelTimeWindow.createWindow(_gthis.city);
					});
				}
			},Resources.getTexture("spr_icon_traveltime"),function() {
				return _gthis.gui.windowRelatedTo == "travel_time";
			},function() {
				_gthis.gui.tooltip.setText(imgButton5,common_Localize.lo("commute_explorer"));
			});
			if(this.gui.game.isMobile) {
				parentElement.addChild(imgButton5);
			} else {
				parentElement.insertChild(imgButton5,0);
			}
		}
		if(this.gui.game.isMobile && this.gui.game.isLargeMobile && this.shownCategory != "") {
			this.showOrHideBuildingsOfCategory(this.shownCategory,this.shownSubCategory,this.categoryButtonPosition.h[this.shownCategory],false,true,true);
		}
	}
	,closeManagementOptions: function() {
		this.allManagementOptionsButtons.clear();
		this.shownManagementOptions = false;
		this.inviteCitizensButton = null;
	}
	,addManagementButtons: function() {
		var _gthis = this;
		var managementButton = new gui_ImageButton(this.gui,this.gui.stage,this.categoryButtons,function() {
			_gthis.shownManagementOptions = !_gthis.shownManagementOptions;
			if(!_gthis.shownManagementOptions) {
				_gthis.closeManagementOptions();
			} else {
				_gthis.showManagementOptions();
			}
		},Resources.getTexture("spr_icon_management"),function() {
			return _gthis.shownManagementOptions;
		},function() {
			_gthis.gui.tooltip.setText(managementButton,common_Localize.lo("management"));
		},null,"spr_transparentbutton");
		if(!this.gui.game.isMobile) {
			this.allManagementOptionsButtons.padding.left = this.categoryButtons.rect.width;
		}
		this.categoryButtons.addChild(managementButton);
		this.activateManagementModeButton = managementButton;
		if(this.shownManagementOptions) {
			this.showManagementOptions();
		}
	}
	,updateGoalAttentions: function() {
		var _gthis = this;
		var updateHighlight = function(thingThatNeedsAttention,needsHighlight) {
			var thingClassName = thingThatNeedsAttention.__name__;
			var thingBuildingInfo = _gthis.city.progress.resources.buildingInfo.h[thingClassName];
			if(thingBuildingInfo != null) {
				var cost = Materials.fromBuildingInfo(thingBuildingInfo);
				if(_gthis.city.progress.unlocks.getUnlockState(thingThatNeedsAttention) == progress_UnlockState.Researched) {
					cost.knowledge = 0;
				}
				if(!needsHighlight || _gthis.city.materials.canAfford(cost)) {
					var cat = thingBuildingInfo.category;
					var catButton;
					if(_gthis.activateBuildModeButton != null) {
						_gthis.activateBuildModeButton.setNeedsAttention(needsHighlight);
					}
					var updateHighlight;
					if(cat != null && cat != "") {
						catButton = _gthis.buttonsByCategory.h[cat];
						updateHighlight = catButton != null;
					} else {
						updateHighlight = false;
					}
					if(updateHighlight) {
						catButton.setNeedsAttention(needsHighlight);
						var bldButton = _gthis.buttonsInCategory.h[thingClassName];
						if(bldButton != null) {
							bldButton.setNeedsAttention(needsHighlight);
						}
					}
				}
			}
			var thingBuildingUpgradeInfo = Resources.buildingUpgradesInfo.h[thingClassName];
			if(thingBuildingUpgradeInfo != null && (!needsHighlight || _gthis.city.materials.canAfford(Materials.fromBuildingUpgradesInfo(thingBuildingUpgradeInfo)))) {
				var stillNeedsToOpenRightWindow = true;
				if(_gthis.gui.window != null && ((_gthis.gui.windowRelatedTo) instanceof Building)) {
					var bld = _gthis.gui.windowRelatedTo;
					if(bld.get_possibleUpgrades().indexOf(thingThatNeedsAttention) != -1 && !common_ArrayExtensions.any(bld.upgrades,function(bu) {
						return js_Boot.getClass(bu) == thingThatNeedsAttention;
					})) {
						var upgradeButton = _gthis.gui.currentUpgradeButtons.h[thingClassName];
						if(upgradeButton != null) {
							upgradeButton.setNeedsAttention(needsHighlight);
						}
						stillNeedsToOpenRightWindow = false;
					}
				}
				if(stillNeedsToOpenRightWindow || !needsHighlight) {
					var _g = 0;
					var _g1 = _gthis.city.permanents;
					while(_g < _g1.length) {
						var pm = _g1[_g];
						++_g;
						if(pm.is(Building)) {
							var bld = pm;
							if(bld.get_possibleUpgrades().indexOf(thingThatNeedsAttention) != -1 && !common_ArrayExtensions.any(bld.upgrades,function(bu) {
								return js_Boot.getClass(bu) == thingThatNeedsAttention;
							})) {
								if(needsHighlight) {
									if(bld.highlightSprite == null) {
										bld.highlightSprite = new PIXI.Sprite(Resources.getTexture("spr_whiteoutline"));
										bld.highlightSprite.position.set(bld.position.x - 1,bld.position.y - 1);
										_gthis.city.farForegroundStage.addChild(bld.highlightSprite);
										var this1 = [89,1,0.77];
										var updateHighlight = thx_color_Hsv.toRgb(this1);
										bld.highlightSprite.tint = common_ColorExtensions.toHexInt(updateHighlight);
									}
									bld.highlightSprite.alpha = (Math.sin(_gthis.gui.guiTimer / 10) + 1) / 2;
								} else if(bld.highlightSprite != null) {
									bld.highlightSprite.destroy();
									bld.highlightSprite = null;
								}
							}
						}
					}
				}
			}
			var thingCityUpgradeInfo = Resources.cityUpgradesInfo.h[thingClassName];
			if(thingCityUpgradeInfo != null && (!needsHighlight || _gthis.city.materials.canAfford(_gthis.city.upgrades.getCurrentCost(thingCityUpgradeInfo)))) {
				var stillNeedsToOpenRightWindow = true;
				if(_gthis.gui.window != null && ((_gthis.gui.windowRelatedTo) instanceof Building)) {
					var bld = _gthis.gui.windowRelatedTo;
					if(bld.get_possibleCityUpgrades().indexOf(thingThatNeedsAttention) != -1 && !common_ArrayExtensions.any(_gthis.city.upgrades.upgrades,function(bu) {
						return js_Boot.getClass(bu) == thingThatNeedsAttention;
					})) {
						var upgradeButton = _gthis.gui.currentUpgradeButtons.h[thingClassName];
						if(upgradeButton != null) {
							upgradeButton.setNeedsAttention(needsHighlight);
						}
						stillNeedsToOpenRightWindow = false;
					}
				}
				if(stillNeedsToOpenRightWindow || !needsHighlight) {
					var _g = 0;
					var _g1 = _gthis.city.permanents;
					while(_g < _g1.length) {
						var pm = _g1[_g];
						++_g;
						if(pm.is(Building)) {
							var bld = pm;
							if(bld.get_possibleCityUpgrades().indexOf(thingThatNeedsAttention) != -1 && !common_ArrayExtensions.any(_gthis.city.upgrades.upgrades,function(bu) {
								return js_Boot.getClass(bu) == thingThatNeedsAttention;
							})) {
								if(needsHighlight) {
									if(bld.highlightSprite == null) {
										bld.highlightSprite = new PIXI.Sprite(Resources.getTexture("spr_whiteoutline"));
										bld.highlightSprite.position.set(bld.position.x - 1,bld.position.y - 1);
										_gthis.city.farForegroundStage.addChild(bld.highlightSprite);
										var this1 = [89,1,0.77];
										var updateHighlight = thx_color_Hsv.toRgb(this1);
										bld.highlightSprite.tint = common_ColorExtensions.toHexInt(updateHighlight);
									}
									bld.highlightSprite.alpha = (Math.sin(_gthis.gui.guiTimer / 10) + 1) / 2;
								} else if(bld.highlightSprite != null) {
									bld.highlightSprite.destroy();
									bld.highlightSprite = null;
								}
							}
						}
					}
				}
			}
		};
		var thingsThatNeedAttention = this.city.progress.story.getDesiredGoalHighlights();
		if(this.creatableCityElementsThatNeededAttention != null && this.creatableCityElementsThatNeededAttention.length > 0) {
			var _g = 0;
			var _g1 = this.creatableCityElementsThatNeededAttention;
			while(_g < _g1.length) {
				var thingThatNeededAttention = _g1[_g];
				++_g;
				updateHighlight(thingThatNeededAttention,false);
			}
		}
		var _g = 0;
		while(_g < thingsThatNeedAttention.length) {
			var thingThatNeedsAttention = thingsThatNeedAttention[_g];
			++_g;
			updateHighlight(thingThatNeedsAttention,true);
		}
		this.creatableCityElementsThatNeededAttention = thingsThatNeedAttention;
	}
	,__class__: gui_BuildingButtons
};
