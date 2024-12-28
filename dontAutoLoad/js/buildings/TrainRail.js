var buildings_TrainRail = $hxClasses["buildings.TrainRail"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	Building.call(this,game,stage,city.cityBgStageBelow,city,world,position,worldPosition,id);
	this.drawer.changeTextureGroup("spr_trainstation");
};
buildings_TrainRail.__name__ = "buildings.TrainRail";
buildings_TrainRail.__super__ = Building;
buildings_TrainRail.prototype = $extend(Building.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_TrainRail.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_TrainRail
});
