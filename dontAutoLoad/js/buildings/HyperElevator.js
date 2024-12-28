var buildings_HyperElevator = $hxClasses["buildings.HyperElevator"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.timesUsedTo = 0;
	this.timesUsed = 0;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.doorX = 8;
	this.doorTextures = Resources.getTexturesByWidth("spr_hyperelevator_door",10);
	this.doorSprite = new PIXI.Sprite(this.doorTextures[0]);
	bgStage.addChild(this.doorSprite);
	this.doorSprite.position.set(position.x + 5,position.y + 10);
	this.doorFullyOpenFor = 0;
	this.currentDoorTexture = 0;
	this.relocateSprite();
};
buildings_HyperElevator.__name__ = "buildings.HyperElevator";
buildings_HyperElevator.__super__ = Building;
buildings_HyperElevator.prototype = $extend(Building.prototype,{
	get_typeID: function() {
		return 4;
	}
	,positionSprites: function() {
		Building.prototype.positionSprites.call(this);
		this.relocateSprite();
	}
	,relocateSprite: function() {
		this.doorSprite.parent.removeChild(this.doorSprite);
		if(this.worldPosition.y == 0) {
			this.stage.addChild(this.doorSprite);
		} else {
			this.bgStage.addChild(this.doorSprite);
		}
		this.doorSprite.position.set(this.position.x + 5,this.position.y + 10);
	}
	,update: function(timeMod) {
		Building.prototype.update.call(this,timeMod);
		if(this.doorFullyOpenFor > 0) {
			this.doorFullyOpenFor -= timeMod;
			var val = this.currentDoorTexture + 0.5 * timeMod;
			var maxVal = this.doorTextures.length - 1;
			this.currentDoorTexture = val < 0 ? 0 : val > maxVal ? maxVal : val;
			this.updateCurrentDoorTexture();
		} else {
			var val = this.currentDoorTexture - 0.5 * timeMod;
			var maxVal = this.doorTextures.length - 1;
			this.currentDoorTexture = val < 0 ? 0 : val > maxVal ? maxVal : val;
			this.updateCurrentDoorTexture();
		}
	}
	,openDoor: function() {
		this.doorFullyOpenFor = 45;
		return this.currentDoorTexture >= this.doorTextures.length - 1.01;
	}
	,updateCurrentDoorTexture: function() {
		this.doorSprite.texture = this.doorTextures[Math.floor(this.currentDoorTexture)];
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		this.doorSprite.destroy();
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		Building.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("elevator_entered",[_gthis.timesUsed]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("elevator_left",[_gthis.timesUsedTo]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_HyperElevator.saveDefinition);
		}
		var value = this.timesUsed;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.timesUsedTo;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsed")) {
			this.timesUsed = loadMap.h["timesUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsedTo")) {
			this.timesUsedTo = loadMap.h["timesUsedTo"];
		}
	}
	,__class__: buildings_HyperElevator
});
