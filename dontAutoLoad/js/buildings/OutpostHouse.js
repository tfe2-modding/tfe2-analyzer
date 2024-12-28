var buildings_OutpostHouse = $hxClasses["buildings.OutpostHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_OutpostHouse.__name__ = "buildings.OutpostHouse";
buildings_OutpostHouse.__super__ = buildings_House;
buildings_OutpostHouse.prototype = $extend(buildings_House.prototype,{
	destroy: function() {
		buildings_House.prototype.destroy.call(this);
	}
	,addWindowInfoLines: function() {
		buildings_House.prototype.addWindowInfoLines.call(this);
	}
	,__class__: buildings_OutpostHouse
});
