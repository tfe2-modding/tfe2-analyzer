var gui_ReplaceAllHousesWindowStep2 = $hxClasses["gui.ReplaceAllHousesWindowStep2"] = function() { };
gui_ReplaceAllHousesWindowStep2.__name__ = "gui.ReplaceAllHousesWindowStep2";
gui_ReplaceAllHousesWindowStep2.create = function(city,gui,stage,$window,newType) {
	gui_ReplaceAllHousesWindowStep2.createWindow(city,gui,stage,$window,newType);
};
gui_ReplaceAllHousesWindowStep2.createWindow = function(city,gui,stage,$window,newType) {
	$window.clear();
	gui.windowAddTitleText(common_Localize.lo("upgrade_to_x",[newType.name]));
	var costElement = new gui_MaterialsCostDisplay(city,new Materials(2,2));
	var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	var ch = mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,costElement,{ left : 0, right : 0, top : 0, bottom : 2}));
	var newTypeCost = Materials.fromBuildingInfo(newType);
	var totalCost = null;
	var houses = null;
	var canAffordNumber = 0;
	var confirmButton = null;
	gui.windowAddInfoText(null,function() {
		var _g = [];
		var _g1 = 0;
		var _g2 = city.permanents;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(js_Boot.getClass(v) == buildings_NormalHouse) {
				_g.push(v);
			}
		}
		houses = _g;
		if(houses.length == 0) {
			costElement.setCost(new Materials());
			canAffordNumber = 0;
			confirmButton.setText("-");
			return common_Localize.lo("no_basic_houses");
		}
		confirmButton.setText(common_Localize.lo("confirm"));
		var newTypeCostCurrent = newTypeCost.copy();
		var name = "buildings." + newType.className;
		if(city.progress.unlocks.getUnlockState($hxClasses[name]) == progress_UnlockState.Researched) {
			newTypeCostCurrent.knowledge = 0;
		}
		var houseRefund = Materials.fromBuildingInfo(city.progress.resources.buildingInfo.h["buildings.NormalHouse"]);
		houseRefund.multiply(city.upgrades.vars.recyclingAmount);
		newTypeCostCurrent.remove(houseRefund);
		newTypeCostCurrent.roundAll();
		totalCost = newTypeCostCurrent.copy();
		var noKnowledgeCost = newTypeCostCurrent.copy();
		noKnowledgeCost.knowledge = 0;
		var val = city.materials.canAffordNumber(noKnowledgeCost);
		var maxVal = houses.length;
		canAffordNumber = val < 1 ? 1 : val > maxVal ? maxVal : val;
		totalCost.multiply(canAffordNumber);
		totalCost.knowledge = newTypeCostCurrent.knowledge;
		var displayCost = totalCost.copy();
		if(displayCost.wood < 0) {
			displayCost.wood = 0;
		}
		if(displayCost.stone < 0) {
			displayCost.stone = 0;
		}
		costElement.setCost(displayCost);
		ch.updateSize();
		return common_Localize.lo("no_undo") + "\n\n" + common_Localize.lo("upgrade_basic_for",[canAffordNumber,houses.length]);
	});
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowInner.addChild(mcdContainer);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	confirmButton = new gui_TextButton(gui,stage,gui.windowInner,function() {
		if(totalCost != null && houses != null && houses.length > 0 && canAffordNumber > 0 && city.materials.canAfford(totalCost)) {
			var newHouses = [];
			var name = "buildings." + newType.className;
			var bldClass = $hxClasses[name];
			city.progress.unlocks.research(bldClass);
			var _g = 0;
			var _g1 = canAffordNumber;
			while(_g < _g1) {
				var i = _g++;
				var house = houses[i];
				house.destroyForReplacement();
				house.world.build(bldClass,house.worldPosition.x,house.worldPosition.y);
				newHouses.push(house);
			}
			city.connections.updateCityConnections();
			city.simulation.updatePathfinder(true);
			var _g = 0;
			while(_g < newHouses.length) {
				var newHouse = newHouses[_g];
				++_g;
				newHouse.postCreate();
			}
			city.progress.unlocks.checkBuildRelatedUnlocks();
			city.materials.remove(totalCost);
			gui.showSimpleWindow(common_Localize.lo("upgraded_houses",[canAffordNumber]),null,true);
		}
	},common_Localize.lo("confirm"));
	gui.windowInner.addChild(confirmButton);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	gui.windowAddBottomButtons();
};
