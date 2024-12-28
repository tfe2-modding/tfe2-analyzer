var buildings_MaterialConvertingFactory = $hxClasses["buildings.MaterialConvertingFactory"] = function(game,stage,bgStage,city,world,position,worldPosition,id,animation,idleAnimation) {
	this.materialMade = 0;
	this.totalMaterialUsed = 0;
	this.efficiency = this.get_normalEfficiency();
	buildings_Factory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,animation,idleAnimation);
};
buildings_MaterialConvertingFactory.__name__ = "buildings.MaterialConvertingFactory";
buildings_MaterialConvertingFactory.__super__ = buildings_Factory;
buildings_MaterialConvertingFactory.prototype = $extend(buildings_Factory.prototype,{
	get_normalEfficiency: function() {
		return 3;
	}
	,get_materialFrom: function() {
		return 0.0;
	}
	,set_materialFrom: function(value) {
		return value;
	}
	,get_materialTo: function() {
		return 0.0;
	}
	,set_materialTo: function(value) {
		return value;
	}
	,get_bonusSpeed: function() {
		return 1.0;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,possiblyBeActive: function(timeMod) {
		if(this.get_materialFrom() >= 1) {
			var convertedInto = timeMod * this.materialsMadePerStepPerWorker * this.activeWorkers * this.city.simulation.happiness.actionSpeedModifier * this.get_bonusSpeed() * this.city.simulation.boostManager.currentGlobalBoostAmount;
			var _g = this;
			_g.set_materialTo(_g.get_materialTo() + convertedInto);
			this.materialMade += convertedInto;
			var materialsUsed = convertedInto * this.efficiency;
			var _g = this;
			_g.set_materialFrom(_g.get_materialFrom() - materialsUsed);
			this.totalMaterialUsed += materialsUsed;
			return true;
		}
		return false;
	}
	,canShowActiveTextures: function() {
		return this.get_materialFrom() >= 3;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Factory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_MaterialConvertingFactory.saveDefinition);
		}
		var value = this.totalMaterialUsed;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.materialMade;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Factory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalMaterialUsed")) {
			this.totalMaterialUsed = loadMap.h["totalMaterialUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"materialMade")) {
			this.materialMade = loadMap.h["materialMade"];
		}
	}
	,__class__: buildings_MaterialConvertingFactory
});
