var gui_infoWindows_InvitePeopleWindow = $hxClasses["gui.infoWindows.InvitePeopleWindow"] = function() { };
gui_infoWindows_InvitePeopleWindow.__name__ = "gui.infoWindows.InvitePeopleWindow";
gui_infoWindows_InvitePeopleWindow.createWindow = function(city,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	var numberOfCitizensEachTime = 10;
	var citizenLimit = 1900;
	if(city.progress.story.storyInfo.isFreePlay) {
		citizenLimit = city.simulation.babyMaker.softPopLimit;
	}
	var numberOfNewCitizens = function() {
		return common_ArrayExtensions.isum(city.simulation.citizenSpawners,function(cs) {
			return cs.spawn.amount;
		});
	};
	var calcCost = function() {
		if(city.simulation.citizens.length + numberOfNewCitizens() > 5000) {
			return new Materials(0,0,numberOfCitizensEachTime * (((city.simulation.citizens.length + numberOfNewCitizens()) / 10 | 0) + 1),0,0,numberOfCitizensEachTime * (((city.simulation.citizens.length + numberOfNewCitizens()) / 50 | 0) - 8),50);
		}
		if(city.simulation.citizens.length + numberOfNewCitizens() > 500) {
			return new Materials(0,0,numberOfCitizensEachTime * (((city.simulation.citizens.length + numberOfNewCitizens()) / 10 | 0) + 1),0,0,numberOfCitizensEachTime * (((city.simulation.citizens.length + numberOfNewCitizens()) / 50 | 0) - 8));
		}
		return new Materials(0,0,numberOfCitizensEachTime * Math.max(1,((city.simulation.citizens.length + numberOfNewCitizens()) / 10 | 0) - 5));
	};
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	city.gui.createWindow("invite_people");
	var city1 = city;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_infoWindows_InvitePeopleWindow.createWindow(city1,clearWindowStack1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var clearWindowStack2 = clearWindowStack;
	var tmp = function() {
		gui_infoWindows_InvitePeopleWindow.createWindow(city2,clearWindowStack2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("invite_people");
	city.gui.windowAddTitleText(windowTitle);
	var lastInviteResult = " ";
	var hasFullWindow = city.simulation.citizens.length + numberOfNewCitizens() + numberOfCitizensEachTime < citizenLimit;
	city.gui.windowAddInfoText(null,function() {
		if(hasFullWindow && city.simulation.citizens.length + numberOfNewCitizens() + numberOfCitizensEachTime >= citizenLimit) {
			city.gui.reloadWindow();
			return "";
		} else if(hasFullWindow) {
			return common_Localize.lo("invite_people_description",[numberOfCitizensEachTime]);
		} else {
			return common_Localize.lo("invite_people_done");
		}
	});
	if(hasFullWindow) {
		var mcd = new gui_MaterialsCostDisplay(city,new Materials(0,0,10),"");
		mcd.displayCityAmounts = true;
		if(city.game.isMobile) {
			mcd.maxDisplayWidth = city.game.rect.width - 10;
		}
		city.gui.windowInner.addChild(new gui_ContainerHolder(city.gui.windowInner,city.gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : 2},function() {
			mcd.setCost(calcCost());
		}));
		gui_windowParts_FullSizeTextButton.create(city.gui,function() {
			var cost = calcCost();
			if(city.materials.canAfford(cost)) {
				if(city.simulation.stats.houseCapacity >= city.simulation.citizens.length + numberOfNewCitizens() + numberOfCitizensEachTime) {
					lastInviteResult = common_Localize.lo("invite_people_success",[numberOfCitizensEachTime]);
					city.materials.remove(cost);
					city.progress.story.justInvitedPeople = true;
					var toWorld = common_ArrayExtensions.min(city.worlds,function(w) {
						return w.rect.y + 0.00001 * w.rect.x;
					});
					if(city.progress.story.storyInfo.isFreePlay || city.progress.story.storyName != "cityofthekey") {
						var worldsWithCitizens = new haxe_ds_ObjectMap();
						var _g = 0;
						var _g1 = city.simulation.citizens;
						while(_g < _g1.length) {
							var c = _g1[_g];
							++_g;
							worldsWithCitizens.set(c.onWorld,true);
						}
						toWorld = common_ArrayExtensions.whereMin(city.worlds,function(w) {
							return worldsWithCitizens.h.__keys__[w.__id__] != null;
						},function(w) {
							return w.rect.y + 0.00001 * w.rect.x;
						});
						if(toWorld == null) {
							toWorld = common_ArrayExtensions.min(city.worlds,function(w) {
								return w.rect.y + 0.00001 * w.rect.x;
							});
						}
					}
					city.simulation.citizenSpawners.push(new simulation_SpawnFlyingSaucer(city.simulation,city.farForegroundStage,toWorld,{ time : 0, type : "SpawnCitizensFlyingSaucer", amount : numberOfCitizensEachTime, ageRangeMin : 18, ageRangeMax : 22, world : city.worlds.indexOf(toWorld)}));
				} else {
					lastInviteResult = common_Localize.lo("invite_not_enough_houses");
				}
			} else {
				lastInviteResult = common_Localize.lo("cant_afford");
			}
		},city.gui.windowInner,function() {
			return common_Localize.lo("invite_people");
		},city.gui.innerWindowStage);
		var extraSpacing = new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4));
		city.gui.windowInner.addChild(extraSpacing);
		city.gui.windowAddInfoText(null,function() {
			return lastInviteResult;
		});
		var extraSpacing = new gui_GUISpacing(city.gui.windowInner,new common_Point(2,6));
		city.gui.windowInner.addChild(extraSpacing);
	}
	city.gui.windowAddBottomButtons();
};
