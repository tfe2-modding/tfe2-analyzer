var gui_SwitchCityWindow = $hxClasses["gui.SwitchCityWindow"] = function() { };
gui_SwitchCityWindow.__name__ = "gui.SwitchCityWindow";
gui_SwitchCityWindow.create = function(city,game,gui) {
	city.gui.clearTutorial();
	gui.createWindow();
	gui.windowRelatedTo = "switchCity";
	city.gui.clearWindowStack();
	var city1 = city;
	var game1 = game;
	var gui1 = gui;
	gui.addWindowToStack(function() {
		gui_SwitchCityWindow.create(city1,game1,gui1);
	});
	gui.windowAddTitleText(common_Localize.lo("switch_city"));
	var otherCities = city.subCities;
	if(city.cityMainFile != city.cityFile) {
		gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
			game.loadSubCity(city,city.cityMainFile,"");
		},city.progress.allCitiesInfo.subCityNames[0],"",gui.windowInner,"spr_9p_button_disabled");
	}
	var i = 1;
	var _g = 0;
	while(_g < otherCities.length) {
		var otherCity = [otherCities[_g]];
		++_g;
		if(city.cityMainFile + "-" + otherCity[0] != city.cityFile) {
			gui_UpgradeWindowParts.createActivatableButton(gui,false,(function(otherCity) {
				return function() {
					game.loadSubCity(city,city.cityMainFile,otherCity[0]);
				};
			})(otherCity),city.progress.allCitiesInfo.subCityNames[i],"",gui.windowInner,"spr_9p_button_disabled");
		}
		++i;
	}
	var _g = 0;
	var _g1 = city.possibleSubCities;
	while(_g < _g1.length) {
		var otherCity1 = [_g1[_g]];
		++_g;
		var subCityName = common_Localize.lo("stories.json/" + otherCity1[0] + ".name");
		gui_UpgradeWindowParts.createActivatableButton(gui,false,(function(otherCity) {
			return function() {
				HxOverrides.remove(city.possibleSubCities,otherCity[0]);
				game.createSubCity(city,otherCity[0]);
			};
		})(otherCity1),subCityName,"",gui.windowInner,"spr_9p_button_disabled");
	}
	gui.windowAddBottomButtons();
};
