var gui_windowParts_CreateBuildingTransformButton = $hxClasses["gui.windowParts.CreateBuildingTransformButton"] = function() { };
gui_windowParts_CreateBuildingTransformButton.__name__ = "gui.windowParts.CreateBuildingTransformButton";
gui_windowParts_CreateBuildingTransformButton.create = function(city,bld,buildingType,title,description,andOnSuccesfulBuildPleaseDoThisThanks) {
	var gui = city.gui;
	var this1 = Resources.buildingInfo;
	var key = buildingType.__name__;
	var info = this1.h[key];
	var materialsToPay = Materials.fromBuildingInfo(info);
	var buildButton = gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
		if(city.materials.canAfford(materialsToPay)) {
			city.materials.remove(materialsToPay);
			bld.destroyForReplacement();
			var newBuilding = bld.world.build(buildingType,bld.worldPosition.x,bld.worldPosition.y);
			city.onBuildBuilding(false,true,newBuilding,buildingType,bld.worldPosition.y,bld.world.permanents[bld.worldPosition.x]);
			gui.closeWindow();
			newBuilding.showWindow();
			if(andOnSuccesfulBuildPleaseDoThisThanks != null) {
				andOnSuccesfulBuildPleaseDoThisThanks();
			}
		}
	},title,description,city.gui.windowInner);
	var infoContainer = buildButton.container;
	var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
	var mcd = new gui_MaterialsCostDisplay(city,materialsToPay,"");
	mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : 2},$bind(mcd,mcd.updateCostDisplay)));
	mcd.setCost(materialsToPay);
	infoContainer.addChild(mcdContainer);
};
