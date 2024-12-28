var gui_FreePlayConfigureWindow = $hxClasses["gui.FreePlayConfigureWindow"] = function() { };
gui_FreePlayConfigureWindow.__name__ = "gui.FreePlayConfigureWindow";
gui_FreePlayConfigureWindow.createWindow = function(city,gui,onContinue,onCancel) {
	gui.createWindow();
	var city1 = city;
	var gui1 = gui;
	var onContinue1 = onContinue;
	var onCancel1 = onCancel;
	var tmp = function() {
		gui_FreePlayConfigureWindow.createWindow(city1,gui1,onContinue1,onCancel1);
	};
	gui.addWindowToStack(tmp);
	gui.windowAddTitleText(common_Localize.lo("customize_free_play"));
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
	gui.windowAddInfoText(common_Localize.lo("starting_resources"),null,"Arial15");
	var normalResources = Materials.fromStoryMaterials(city.progress.story.storyInfo.initialMaterials);
	var standardNumber = common_ArrayExtensions.isum(city.progress.story.storyInfo.worlds,function(w) {
		return common_ArrayExtensions.isum(w.citizens,function(wc) {
			return wc.amount;
		});
	});
	var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
		city.progress.sandbox.disableUnlimitedResources();
		city.progress.sandbox.everPlayedWithUnlimitedResources = false;
		city.materials.remove(city.materials);
		city.materials.add(normalResources);
		var _g = city.materials;
		_g.set_food(_g.food + (city.simulation.citizens.length - standardNumber) * 3);
	},function() {
		if(!city.progress.sandbox.unlimitedResources) {
			return city.materials.wood < 1000;
		} else {
			return false;
		}
	},common_Localize.lo("normal_resources"));
	gui.windowInner.addChild(ab);
	if(city.progress.story.canHaveExtraResources()) {
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
		var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
			city.progress.sandbox.disableUnlimitedResources();
			city.progress.sandbox.everPlayedWithUnlimitedResources = false;
			var oldMaterials = city.materials.copy();
			city.materials.remove(city.materials);
			city.materials.add(new Materials(1000,1000,1000,100,500));
			var _g = city.materials;
			_g.set_food(_g.food + (city.simulation.citizens.length - standardNumber) * 3);
		},function() {
			if(!city.progress.sandbox.unlimitedResources) {
				return city.materials.wood >= 1000;
			} else {
				return false;
			}
		},common_Localize.lo("extra_resources"));
		gui.windowInner.addChild(ab);
	}
	if(Config.get_allowUnlimitedResources()) {
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
		var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
			city.progress.sandbox.enableUnlimitedResources();
		},function() {
			return city.progress.sandbox.unlimitedResources;
		},common_Localize.lo("unlimited_resources"));
		gui.windowInner.addChild(ab);
	} else if(Config.canHavePremium()) {
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
		var ab = gui_windowParts_FullSizeTextButton.create(gui,function() {
			gui.windowOnDestroy = null;
			gui_infoWindows_StoreInfo.createWindow(gui);
		},gui.windowInner,function() {
			return common_Localize.lo("get_premium_for_unlimited");
		},gui.innerWindowStage,true);
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
	var enableResourcesWarning = common_Localize.lo("unlimited_resources_disables_achievements");
	gui.windowAddInfoText(null,function() {
		if(city.progress.sandbox.unlimitedResources) {
			return enableResourcesWarning;
		} else {
			return "";
		}
	});
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowAddInfoText(common_Localize.lo("starting_citizens"),null,"Arial15");
	var startingCitizensChooser = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	startingCitizensChooser.direction = gui_GUIContainerDirection.Horizontal;
	var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
		gui_FreePlayConfigureWindow.setCityCitizens(city,standardNumber);
	},function() {
		return city.simulation.citizens.length == standardNumber;
	},standardNumber + "");
	startingCitizensChooser.addChild(ab);
	startingCitizensChooser.addChild(new gui_GUISpacing(startingCitizensChooser,new common_Point(2,2)));
	var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
		gui_FreePlayConfigureWindow.setCityCitizens(city,10);
	},function() {
		return city.simulation.citizens.length == 10;
	},"10");
	startingCitizensChooser.addChild(ab);
	startingCitizensChooser.addChild(new gui_GUISpacing(startingCitizensChooser,new common_Point(2,2)));
	var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
		gui_FreePlayConfigureWindow.setCityCitizens(city,25);
	},function() {
		return city.simulation.citizens.length == 25;
	},"25");
	startingCitizensChooser.addChild(ab);
	startingCitizensChooser.addChild(new gui_GUISpacing(startingCitizensChooser,new common_Point(2,2)));
	var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
		gui_FreePlayConfigureWindow.setCityCitizens(city,100);
	},function() {
		return city.simulation.citizens.length == 100;
	},"100");
	startingCitizensChooser.addChild(ab);
	if(Config.get_allowUnlimitedResources()) {
		startingCitizensChooser.addChild(new gui_GUISpacing(startingCitizensChooser,new common_Point(2,2)));
		var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
			gui_FreePlayConfigureWindow.setCityCitizens(city,200);
		},function() {
			return city.simulation.citizens.length == 200;
		},"200");
		startingCitizensChooser.addChild(ab);
		startingCitizensChooser.addChild(new gui_GUISpacing(startingCitizensChooser,new common_Point(2,2)));
		var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
			gui_FreePlayConfigureWindow.setCityCitizens(city,500);
		},function() {
			return city.simulation.citizens.length == 500;
		},"500");
		startingCitizensChooser.addChild(ab);
	}
	gui.windowInner.addChild(startingCitizensChooser);
	if(Config.get_allowUnlimitedResources()) {
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
		gui.windowAddInfoText(common_Localize.lo("buildings_research"),null,"Arial15");
		var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
			city.progress.unlocks.unlockMost = false;
		},function() {
			return !city.progress.unlocks.unlockMost;
		},common_Localize.lo("standard_unlocks"));
		gui.windowInner.addChild(ab);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
		var ab = gui_ActivableButton.create(gui,gui.innerWindowStage,gui.windowInner,function() {
			city.progress.unlocks.unlockMost = true;
		},function() {
			return city.progress.unlocks.unlockMost;
		},common_Localize.lo("most_unlocks"));
		gui.windowInner.addChild(ab);
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	gui.windowAddBottomButtons([{ text : common_Localize.lo("back"), action : function() {
		onCancel();
	}}],common_Localize.lo("continue"),function() {
		onContinue();
	});
	gui.windowOnDestroy = onCancel;
};
gui_FreePlayConfigureWindow.setCityCitizens = function(city,number) {
	if(city.simulation.citizens.length > number) {
		while(city.simulation.citizens.length > number) {
			city.simulation.citizens[city.simulation.citizens.length - 1].tryRemove();
			var _g = city.materials;
			_g.set_food(_g.food - 3);
		}
	} else {
		while(city.simulation.citizens.length < number) {
			var city1 = city.simulation;
			var _g = [];
			var _g1 = 0;
			var _g2 = city.worlds;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(common_ArrayExtensions.any(city.simulation.citizens,(function(w) {
					return function(ct) {
						return ct.onWorld == w[0];
					};
				})([v]))) {
					_g.push(v);
				}
			}
			city1.createCitizen(_g[0],random_Random.getFloat(18,40));
			var _g3 = city.materials;
			_g3.set_food(_g3.food + 3);
		}
	}
};
