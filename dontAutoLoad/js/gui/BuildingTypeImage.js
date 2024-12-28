var gui_BuildingTypeImage = $hxClasses["gui.BuildingTypeImage"] = function() { };
gui_BuildingTypeImage.__name__ = "gui.BuildingTypeImage";
gui_BuildingTypeImage.create = function(stage,city,buildingType,parentContainer,gui) {
	var cont = new PIXI.Container();
	var sprName = Reflect.field(buildingType,"spriteName");
	var this1 = city.progress.resources.buildingInfo;
	var key = buildingType.__name__;
	var buildingInfo = this1.h[key];
	if(buildingInfo.buttonBack != "none") {
		cont.addChild(Resources.makeSprite(buildingInfo.buttonBack == null ? "" + sprName + "@44,0,20,20" : buildingInfo.buttonBack));
	}
	cont.addChild(Resources.makeSprite("" + sprName + "@0,0,20,20"));
	var ch = null;
	ch = new gui_ContainerHolder(parentContainer,stage,cont,null,null,function(mouse) {
		if(ch.rect.contains(mouse.position)) {
			gui.tooltip.setText(ch,buildingInfo.name);
			return true;
		}
		return false;
	});
	return ch;
};
