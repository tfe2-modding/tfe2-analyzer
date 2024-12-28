var gui_ChangeCityNameWindow = $hxClasses["gui.ChangeCityNameWindow"] = function() { };
gui_ChangeCityNameWindow.__name__ = "gui.ChangeCityNameWindow";
gui_ChangeCityNameWindow.createWindow = function(city) {
	city.gui.createWindow("changeCityNameWindow");
	var city1 = city;
	var tmp = function() {
		gui_ChangeCityNameWindow.createWindow(city1);
	};
	city.gui.addWindowToStack(tmp);
	gui_ChangeCityNameWindow.create(city,city.gui,city.gui.innerWindowStage,city.gui.windowInner);
};
gui_ChangeCityNameWindow.create = function(city,gui,stage,thisWindow) {
	gui.windowAddTitleText(common_Localize.lo("change_city_name"));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("give_city_name")));
	thisWindow.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	var handleInput = function(input) {
		if(input == null) {
			return false;
		}
		city.cityName = buildings_CityHall.sanitizeCityName(input);
		return true;
	};
	var textInput = new gui_TextInput(gui.windowInner,gui,city.game,common_Localize.lo("city_name"),city.cityName);
	thisWindow.addChild(textInput);
	textInput.onInput = handleInput;
	thisWindow.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowAddBottomButtons();
};
