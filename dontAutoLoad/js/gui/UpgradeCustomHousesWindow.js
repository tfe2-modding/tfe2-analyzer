var gui_UpgradeCustomHousesWindow = $hxClasses["gui.UpgradeCustomHousesWindow"] = function() { };
gui_UpgradeCustomHousesWindow.__name__ = "gui.UpgradeCustomHousesWindow";
gui_UpgradeCustomHousesWindow.create = function(city,gui,stage,$window) {
	gui_UpgradeCustomHousesWindow.createWindow(city,gui,stage,$window);
};
gui_UpgradeCustomHousesWindow.createWindow = function(city,gui,stage,$window) {
	$window.clear();
	gui.windowAddTitleText(common_Localize.lo("upgrade_custom_houses"));
	gui.windowAddInfoText(common_Localize.lo("upgrade_custom_houses_to_100"));
	var costElement = new gui_MaterialsCostDisplay(city,new Materials(2,2));
	var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	var ch = mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,costElement,{ left : 0, right : 0, top : 0, bottom : 2}));
	var totalCost = null;
	var houses = null;
	var confirmButton = null;
	gui.windowAddInfoText(null,function() {
		var _g = [];
		var _g1 = 0;
		var _g2 = city.permanents;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(js_Boot.getClass(v) == buildings_CustomHouse && v.properties.customAttractiveness < 100 && v.properties.customCapacity <= 7) {
				_g.push(v);
			}
		}
		houses = _g;
		if(houses.length == 0) {
			costElement.setCost(new Materials());
			confirmButton.setText("-");
			return common_Localize.lo("upgrade_custom_houses_already_100");
		}
		confirmButton.setText(common_Localize.lo("confirm"));
		totalCost = new Materials();
		var _g = 0;
		while(_g < houses.length) {
			var ch1 = houses[_g];
			++_g;
			var newProps = ch1.properties.copy();
			newProps.customAttractiveness = 100;
			var thisCost = newProps.getCost(city);
			thisCost.remove(ch1.properties.getCost(city));
			thisCost.keepAboveZeroAll();
			totalCost.add(thisCost);
		}
		var displayCost = totalCost.copy();
		displayCost.keepAboveZeroAll();
		costElement.setCost(displayCost);
		ch.updateSize();
		return common_Localize.lo("no_undo") + "\n\n" + common_Localize.lo("upgrade_confirm_text",[houses.length]);
	});
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowInner.addChild(mcdContainer);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	confirmButton = new gui_TextButton(gui,stage,gui.windowInner,function() {
		if(totalCost != null && houses != null && houses.length > 0 && city.materials.canAfford(totalCost)) {
			var _g = 0;
			var _g1 = houses.length;
			while(_g < _g1) {
				var i = _g++;
				var house = houses[i];
				house.properties.customAttractiveness = 100;
				house.setProperties();
			}
			city.materials.remove(totalCost);
			gui.showSimpleWindow(common_Localize.lo("upgraded_houses",[houses.length]),null,true);
		}
	},common_Localize.lo("confirm"));
	gui.windowInner.addChild(confirmButton);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	gui.windowAddBottomButtons();
};
