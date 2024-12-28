var buildings_TheContraption = $hxClasses["buildings.TheContraption"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_TheContraption.__name__ = "buildings.TheContraption";
buildings_TheContraption.__super__ = Building;
buildings_TheContraption.prototype = $extend(Building.prototype,{
	__class__: buildings_TheContraption
});
