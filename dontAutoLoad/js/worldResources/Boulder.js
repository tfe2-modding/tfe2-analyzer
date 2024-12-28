var worldResources_Boulder = $hxClasses["worldResources.Boulder"] = function(game,id,city,world,position,worldPosition,stage) {
	worldResources_Rock.call(this,game,id,city,world,position,worldPosition,stage,"spr_boulder",400);
};
worldResources_Boulder.__name__ = "worldResources.Boulder";
worldResources_Boulder.__super__ = worldResources_Rock;
worldResources_Boulder.prototype = $extend(worldResources_Rock.prototype,{
	get_name: function() {
		return "Boulder";
	}
	,createMainWindowPart: function() {
		this.city.gui.windowAddInfoText("Texture by DT from the Discord, who won the first art contest!");
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
		worldResources_Rock.prototype.createMainWindowPart.call(this);
	}
	,postCreate: function() {
		if(this.city.lastLoadedVersion > 0 && this.city.lastLoadedVersion < 63 && this.materialsLeft >= 199) {
			this.materialsLeft = this.initialMaterials;
		}
	}
	,__class__: worldResources_Boulder
});
