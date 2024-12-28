var gui_FollowingCitizen = $hxClasses["gui.FollowingCitizen"] = function() { };
gui_FollowingCitizen.__name__ = "gui.FollowingCitizen";
gui_FollowingCitizen.createWindow = function(city,citizen,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	window.globalFollowingCitizen = citizen;
	city.gui.createWindow(citizen);
	city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
	var city1 = city;
	var citizen1 = citizen;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_FollowingCitizen.createWindow(city1,citizen1,clearWindowStack1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var citizen2 = citizen;
	var clearWindowStack2 = clearWindowStack;
	var tmp = function() {
		gui_FollowingCitizen.createWindow(city2,citizen2,clearWindowStack2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("following",[citizen.nameIndex < Resources.citizenNames.length ? Resources.citizenNames[citizen.nameIndex] : common_StringExtensions.firstToUpper(common_Localize.lo("citizen"))]);
	var nameIdentifier = citizen.nameIndex < Resources.citizenNames.length ? Resources.citizenNames[citizen.nameIndex] : common_Localize.lo("this_citizen");
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowInner.addChild(new gui_TextElement(city.gui.windowInner,city.gui.innerWindowStage,null,function() {
		var educationLevelDescription = citizen.educationLevel < 0.01 ? common_Localize.lo("education_level_0") : citizen.educationLevel < 0.1 ? common_Localize.lo("education_level_1") : citizen.educationLevel < 0.2 ? common_Localize.lo("education_level_2") : citizen.educationLevel < 0.4 ? common_Localize.lo("education_level_3") : citizen.educationLevel < 0.6 ? common_Localize.lo("education_level_4") : citizen.educationLevel < 0.7 ? common_Localize.lo("education_level_5") : citizen.educationLevel < 0.8 ? common_Localize.lo("education_level_6") : citizen.educationLevel < 1 ? common_Localize.lo("education_level_7") : citizen.educationLevel <= 1.005 ? common_Localize.lo("education_level_8") : citizen.educationLevel <= 1.2 ? common_Localize.lo("education_level_9") : citizen.educationLevel < 1.4 ? common_Localize.lo("education_level_10") : citizen.educationLevel < 1.6 ? common_Localize.lo("education_level_11") : citizen.educationLevel < 1.8 ? common_Localize.lo("education_level_12") : citizen.educationLevel < 2 ? common_Localize.lo("education_level_13") : citizen.educationLevel < 2.2 ? common_Localize.lo("education_level_14") : common_Localize.lo("education_level_15");
		if(city.simulation.hackerSchoolBonuses.citizens.indexOf(citizen) != -1 && citizen.educationLevel > 0.2) {
			educationLevelDescription += " " + common_Localize.lo("hacker");
		}
		return common_Localize.lo("age_and_education",[Math.floor(citizen.get_age()),educationLevelDescription]);
	}));
	var citizenCanWork = citizen.get_age() >= 16 && citizen.school == null;
	var addedButtons = [];
	var isFav = city.simulation.favoriteCitizens.indexOf(citizen) != -1;
	if(city.progress.story.storyName != "cityofthekey" || citizen.job == null || !citizen.job.is(buildings_SecretSocietyHouse)) {
		addedButtons = [{ spr : citizenCanWork ? "spr_housingandwork" : "spr_housingandschool", text : citizenCanWork ? common_Localize.lo("change_home_job") : common_Localize.lo("change_home_school"), action : function() {
			gui_FollowingCitizen.createChangeHomeAndWorkOfCitizenWindow(city,citizen);
		}}];
	}
	var tmp = isFav ? common_Localize.lo("unfavorite_citizen") : common_Localize.lo("favorite_citizen");
	addedButtons.push({ spr : isFav ? "spr_favoritecitizen_selected" : "spr_favoritecitizen", text : tmp, action : function() {
		if(city.simulation.favoriteCitizens.indexOf(citizen) == -1) {
			if(city.simulation.favoriteCitizens.length >= 50) {
				var createWarningWindow = function() {
					city.gui.showSimpleWindow(common_Localize.lo("favorite_citizen_limit_50"),null,true);
				};
				createWarningWindow();
				city.gui.addWindowToStack(createWarningWindow);
			} else {
				city.simulation.favoriteCitizens.push(citizen);
			}
		} else {
			HxOverrides.remove(city.simulation.favoriteCitizens,citizen);
		}
		city.gui.reloadWindow();
	}});
	city.gui.windowAddBottomButtons(addedButtons);
	city.viewIsControlled = true;
	var selectedSprite = Resources.makeSprite("spr_selectedhuman");
	city.furtherForegroundStage.addChild(selectedSprite);
	city.gui.windowOnLateUpdate = function() {
		window.__temp1 = citizen;
		if(citizen.currentAction == 0 && citizen.job != null && city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("shadowDay") != -1 && city.simulation.bonuses.followedJobs.indexOf(citizen.job.className) == -1) {
			city.simulation.bonuses.followedJobs.push(citizen.job.className);
			var newKnowledge = Math.round(3 + random_Random.getInt(3) + random_Random.getFloat(0.005,0.02) * city.simulation.citizens.length);
			city.materials.knowledge += newKnowledge;
			city.simulation.stats.materialProduction[10][0] += newKnowledge;
			var createCitizenJobWindow = function() {
				city.gui.showSimpleWindow(common_Localize.lo("pioneers_bonus_citizenfollow",[newKnowledge]),null,true);
				city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
				var selectedSprite = Resources.makeSprite("spr_selectedhuman");
				city.furtherForegroundStage.addChild(selectedSprite);
				city.gui.windowOnLateUpdate = function() {
					if(citizen.hasDied) {
						gui_FollowingCitizen.onCitizenDie(city,citizen,nameIdentifier,windowTitle,citizen.dynamicUnsavedVars.flyAwayInRocket != null);
						return;
					}
					city.viewIsControlled = true;
					var citizenPos = citizen.getCityPosition();
					city.viewPos = new common_FPoint(citizenPos.x,citizenPos.y);
					selectedSprite.position.set(citizenPos.x - 1,citizenPos.y - 6);
					city.cityView.updateMovingView();
				};
				city.gui.windowOnDestroy = function() {
					city.viewIsControlled = false;
					city.cityView.isDraggingView = false;
					selectedSprite.destroy();
				};
			};
			createCitizenJobWindow();
			city.gui.addWindowToStack(createCitizenJobWindow);
			return;
		}
		if(citizen.hasDied) {
			gui_FollowingCitizen.onCitizenDie(city,citizen,nameIdentifier,windowTitle,citizen.dynamicUnsavedVars.flyAwayInRocket != null);
			return;
		}
		if(!citizenCanWork && (citizen.get_age() >= 16 && citizen.school == null)) {
			city.gui.reloadWindow();
			citizenCanWork = true;
			return;
		}
		var citizenPos = citizen.getCityPosition();
		city.viewPos = new common_FPoint(citizenPos.x,citizenPos.y);
		selectedSprite.position.set(citizenPos.x - 1,citizenPos.y - 6);
		city.cityView.updateMovingView();
		if(citizen.hobby != null && ((citizen.hobby) instanceof simulation_citizenSpecialActions_DanceOnBall)) {
			var walkingOnBall = citizen.hobby;
			if(walkingOnBall.isWalkingOnBall()) {
				common_Achievements.achieve("HOBBY_BALL");
			}
		}
		if(citizen.get_age() >= 100 && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null) != null && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).is(buildings_NightClub) && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).get_isOpen() && (citizen.path == null || citizen.pathOnlyRelatedTo == citizen.inPermanent)) {
			common_Achievements.achieve("OLD_PARTIER");
		}
	};
	city.gui.windowOnDestroy = function() {
		city.viewIsControlled = false;
		city.cityView.isDraggingView = false;
		selectedSprite.destroy();
	};
	var point = citizen.getCityPosition();
	var tmp = new common_FPoint(point.x,point.y);
	city.viewPos = tmp;
	city.cityView.updateMovingView();
};
gui_FollowingCitizen.onCitizenDie = function(city,citizen,nameIdentifier,windowTitle,justLeft) {
	city.gui.clearWindowStack();
	city.gui.closeWindow();
	city.gui.createWindow();
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowInner.addChild(new gui_TextElement(city.gui.windowInner,city.gui.innerWindowStage,common_Localize.lo(justLeft ? "citizen_left" : "citizen_passed_away",[nameIdentifier])));
	city.gui.windowAddBottomButtons();
};
gui_FollowingCitizen.createChangeHomeAndWorkOfCitizenWindow = function(city,citizen) {
	var nameIdentifier = citizen.nameIndex < Resources.citizenNames.length ? Resources.citizenNames[citizen.nameIndex] : common_Localize.lo("this_citizen");
	var selectedSprite = Resources.makeSprite("spr_selectedhuman");
	city.furtherForegroundStage.addChild(selectedSprite);
	city.activateSpecialCityAction(new cityActions_ChangeCitizenVitalBuildings(city,citizen));
	city.gui.createWindow(citizen);
	city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
	var city1 = city;
	var citizen1 = citizen;
	var tmp = function() {
		gui_FollowingCitizen.createChangeHomeAndWorkOfCitizenWindow(city1,citizen1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var citizen2 = citizen;
	var tmp = function() {
		gui_FollowingCitizen.createChangeHomeAndWorkOfCitizenWindow(city2,citizen2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = function() {
		var citizenCanWork = citizen.get_age() >= 16 && citizen.school == null;
		var text = citizenCanWork ? common_Localize.lo("change_home_job") : common_Localize.lo("change_home_school");
		return text + " " + common_Localize.lo("for_citizen",[citizen.nameIndex < Resources.citizenNames.length ? Resources.citizenNames[citizen.nameIndex] : common_StringExtensions.firstToUpper(common_Localize.lo("citizen"))]);
	};
	city.gui.windowAddTitleText(null,windowTitle);
	city.gui.windowAddBottomButtons();
	var bottomRow = city.gui.windowInner.children[city.gui.windowInner.children.length - 1];
	var homeButton = null;
	homeButton = new gui_ImageButton(city.gui,city.gui.innerWindowStage,bottomRow,function() {
		if(citizen.home != null) {
			var _this = citizen.home.position;
			var otherPoint_x = 10. | 0;
			var otherPoint_y = 10. | 0;
			var point = new common_Point(_this.x + otherPoint_x,_this.y + otherPoint_y);
			var value = new common_FPoint(point.x,point.y);
			city.viewPos = value;
			city.cityView.updateMovingView();
		}
	},Resources.getTexture("spr_housing"),null,function() {
		city.gui.tooltip.setText(homeButton,common_Localize.lo("center_on_house"));
	},null,city.game.isMobile ? "spr_button_smaller_mobile" : "spr_button_smaller",city.game.isMobile ? 4 : 2);
	bottomRow.insertChild(homeButton,0);
	bottomRow.insertChild(new gui_GUISpacing(bottomRow,new common_Point(4,2)),1);
	var workButton = null;
	var hasSchoolTexture = citizen.school != null || citizen.get_age() < 16;
	workButton = new gui_ImageButton(city.gui,city.gui.innerWindowStage,bottomRow,function() {
		if(citizen.job != null) {
			var _this = citizen.job.position;
			var otherPoint_x = 10. | 0;
			var otherPoint_y = 10. | 0;
			var point = new common_Point(_this.x + otherPoint_x,_this.y + otherPoint_y);
			var workButton = new common_FPoint(point.x,point.y);
			city.viewPos = workButton;
			city.cityView.updateMovingView();
		} else if(citizen.school != null) {
			var _this = citizen.school.position;
			var otherPoint_x = 10. | 0;
			var otherPoint_y = 10. | 0;
			var point = new common_Point(_this.x + otherPoint_x,_this.y + otherPoint_y);
			var workButton = new common_FPoint(point.x,point.y);
			city.viewPos = workButton;
			city.cityView.updateMovingView();
		}
	},Resources.getTexture(hasSchoolTexture ? "spr_icon_school" : "spr_work"),function() {
		if(hasSchoolTexture && (citizen.school == null && citizen.get_age() >= 16)) {
			workButton.updateTexture(Resources.getTexture("spr_work"));
		}
		return false;
	},function() {
		city.gui.tooltip.setText(workButton,citizen.school != null || citizen.get_age() < 16 ? common_Localize.lo("center_on_school") : common_Localize.lo("center_on_work"));
	},null,city.game.isMobile ? "spr_button_smaller_mobile" : "spr_button_smaller",city.game.isMobile ? 4 : 2);
	bottomRow.insertChild(workButton,2);
	city.gui.windowOnLateUpdate = function() {
		if(citizen.hasDied) {
			gui_FollowingCitizen.onCitizenDie(city,citizen,nameIdentifier,windowTitle(),citizen.dynamicUnsavedVars.flyAwayInRocket != null);
			return;
		}
		var citizenPos = citizen.getCityPosition();
		selectedSprite.position.set(citizenPos.x - 1,citizenPos.y - 6);
		var hhTextures = Resources.getTextures("spr_hoverhints_citizen",4);
		city.setHoverHightlight(function(pm) {
			if(citizen.job == pm && citizen.home == pm) {
				return hhTextures[3];
			} else if(citizen.job == pm) {
				return hhTextures[0];
			} else if(citizen.home == pm) {
				return hhTextures[1];
			} else if(citizen.school == pm) {
				return hhTextures[2];
			} else {
				return null;
			}
		},6735360);
	};
	city.gui.windowOnDestroy = function() {
		selectedSprite.destroy();
		if(city.specialAction != null) {
			city.specialAction.deactivate(true);
		}
	};
};
