var simulation_Animal = $hxClasses["simulation.Animal"] = function(city,stage,inPermanent,relativeX,maxType) {
	if(maxType == null) {
		maxType = 8;
	}
	this.destroyed = false;
	this.actionTime = 0;
	this.moveSpeed = 0.5;
	this.currentAction = 2;
	this.relativeY = 3;
	this.relativeX = 2;
	this.inPermanent = null;
	this.type = 0;
	this.city = city;
	this.stage = stage;
	this.type = random_Random.getInt(maxType);
	this.sprite = new PIXI.Sprite();
	stage.addChild(this.sprite);
	this.setTypeSprite();
	this.sprite.anchor.set(0.5,1);
	this.inPermanent = inPermanent;
	this.relativeX = relativeX;
	if(!Game.isLoading) {
		this.updateDisplay();
	}
};
simulation_Animal.__name__ = "simulation.Animal";
simulation_Animal.prototype = {
	destroy: function() {
		this.sprite.destroy();
		HxOverrides.remove(this.city.simulation.animals.animals,this);
		this.destroyed = true;
	}
	,getCityPosition: function() {
		return new common_FPoint(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + 20 - 1 + 3 - this.relativeY);
	}
	,onClick: function() {
		gui_FollowingAnimal.createWindow(this.city,this);
	}
	,save: function(queue) {
		this.saveBasics(queue);
		var value = this.inPermanent.id;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue) {
		this.loadBasics(queue);
		var this1 = this.city.permanentsByID;
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		this.inPermanent = this1.h[intToRead];
		this.updateDisplay();
	}
	,update: function(timeMod) {
		var inBuilding = this.inPermanent;
		if(inBuilding == null) {
			return;
		}
		var canGoLeft = inBuilding.leftBuilding != null && inBuilding.leftBuilding.drawer.currentTextureGroupName == inBuilding.drawer.currentTextureGroupName;
		var canGoRight = inBuilding.rightBuilding != null && inBuilding.rightBuilding.drawer.currentTextureGroupName == inBuilding.drawer.currentTextureGroupName;
		if(canGoLeft) {
			var leftGardens = inBuilding.leftBuilding != null && inBuilding.leftBuilding.is(buildings_BotanicalGardens);
			if(leftGardens) {
				var leftGardensCanWalk = leftGardens && !inBuilding.leftBuilding.hasBottomConnectedBuilding;
				if(!leftGardensCanWalk) {
					canGoLeft = false;
				}
			}
		}
		if(canGoRight) {
			var rightGardens = inBuilding.rightBuilding != null && inBuilding.rightBuilding.is(buildings_BotanicalGardens);
			if(rightGardens) {
				var rightGardensCanWalk = rightGardens && !inBuilding.rightBuilding.hasBottomConnectedBuilding;
				if(!rightGardensCanWalk) {
					canGoRight = false;
				}
			}
		}
		var halfWidth = this.sprite.width * 0.5;
		if(this.actionTime < 0) {
			this.currentAction = random_Random.getInt(3);
			this.actionTime = random_Random.getFloat(10,80);
			if(this.currentAction == 0) {
				this.sprite.scale.x = 1;
			} else if(this.currentAction == 1) {
				this.sprite.scale.x = -1;
			} else {
				this.sprite.texture = this.textures[0];
			}
		} else {
			this.actionTime -= timeMod;
		}
		switch(this.currentAction) {
		case 0:
			this.sprite.texture = this.textures[(this.relativeX + 100) * 0.4 % this.textures.length | 0];
			if(this.relativeX - this.moveSpeed * timeMod < halfWidth + 3) {
				if(canGoLeft) {
					this.relativeX += 20;
					this.inPermanent = inBuilding.leftBuilding;
				} else {
					this.currentAction = 2;
					this.relativeX = halfWidth + 3;
					this.sprite.texture = this.textures[0];
				}
			} else {
				this.relativeX -= this.moveSpeed * timeMod;
			}
			break;
		case 1:
			this.sprite.texture = this.textures[(this.relativeX + 100) * 0.4 % this.textures.length | 0];
			if(this.relativeX + this.moveSpeed * timeMod > 20 - halfWidth - 3) {
				if(canGoRight) {
					this.relativeX -= 20;
					this.inPermanent = inBuilding.rightBuilding;
				} else {
					this.currentAction = 2;
					this.relativeX = 20 - halfWidth - 3;
					this.sprite.texture = this.textures[0];
				}
			} else {
				this.relativeX += this.moveSpeed * timeMod;
			}
			break;
		case 2:
			break;
		}
		this.updateDisplay();
	}
	,updateDisplay: function() {
		this.sprite.position.set(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + 20 - this.relativeY);
	}
	,postLoad: function() {
		this.setTypeSprite();
	}
	,setTypeSprite: function() {
		switch(this.type) {
		case 0:
			this.textures = Resources.getTexturesByWidth("spr_otherworldcreature_1",7);
			break;
		case 1:
			this.textures = Resources.getTexturesByWidth("spr_otherworldcreature_2",7);
			break;
		case 2:
			this.textures = Resources.getTexturesByWidth("spr_otherworldcreature_3",7);
			break;
		case 3:
			this.textures = Resources.getTexturesByWidth("spr_otherworldcreature_4",8);
			break;
		case 4:
			this.textures = Resources.getTexturesByWidth("spr_otherworldcreature_5",8);
			break;
		case 5:
			this.textures = Resources.getTexturesByWidth("spr_otherworldcreature_6",7);
			break;
		case 6:
			this.textures = Resources.getTexturesByWidth("spr_otherworldcreature_7",7);
			break;
		case 7:
			this.textures = Resources.getTexturesByWidth("spr_otherworldcreature_8",7);
			break;
		default:
			this.textures = Resources.getTexturesByWidth("spr_otherworldcreature_1",7);
		}
		this.sprite.texture = this.textures[0];
	}
	,pushBackIntoPermanentOrDestroy: function() {
		if(!this.inPermanent.destroyed) {
			var val = this.relativeX;
			this.relativeX = val < 0 ? 0 : val > 20 ? 20 : val;
			if(this.inPermanent.is(buildings_BotanicalGardens)) {
				var bg = this.inPermanent;
				if(bg.get_mergingDrawer().isConnectedBuilding(bg.bottomBuilding)) {
					if(this.inPermanent.is(buildings_OtherworldlyGardens)) {
						this.inPermanent.hiddenAnimalHere = true;
					}
					this.destroy();
				}
			}
		} else {
			this.destroy();
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_Animal.saveDefinition);
		}
		var value = this.type;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.relativeX;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.relativeY;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"type")) {
			this.type = loadMap.h["type"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"relativeX")) {
			this.relativeX = loadMap.h["relativeX"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"relativeY")) {
			this.relativeY = loadMap.h["relativeY"];
		}
		this.postLoad();
	}
	,__class__: simulation_Animal
};
