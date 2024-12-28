var simulation_Fish = $hxClasses["simulation.Fish"] = function(city,stage,inPermanent,relativeX,relativeY) {
	this.destroyed = false;
	this.verticalHeightToUse = 0;
	this.verticalWidthToUse = 0;
	this.startSlowingProb = 0.05;
	this.stopMoveProb = 0.2;
	this.normalSlowdown = 0.1;
	this.normalAcceleration = 0.05;
	this.maxSpeed = 0.6;
	this.stopSpeedSpeed = 0.4;
	this.slowing = false;
	this.speeding = false;
	this.moveSpeed = 0;
	this.relativeY = 2;
	this.relativeX = 2;
	this.inPermanent = null;
	this.spriteCanBeRotated = false;
	this.height = 1;
	this.width = 2;
	this.type = 0;
	this.city = city;
	this.stage = stage;
	this.type = random_Random.getInt(11);
	this.sprite = new PIXI.Sprite();
	stage.addChild(this.sprite);
	this.setTypeSprite();
	this.sprite.anchor.set(0.5,0.5);
	this.inPermanent = inPermanent;
	this.relativeX = relativeX;
	this.relativeY = relativeY;
	this.moveDirection = 0;
	this.moveSpeed = 0;
	if(!Game.isLoading) {
		this.updateDisplay();
	}
};
simulation_Fish.__name__ = "simulation.Fish";
simulation_Fish.prototype = {
	destroy: function() {
		this.sprite.destroy();
		HxOverrides.remove(this.city.simulation.fishes.fishes,this);
		this.destroyed = true;
	}
	,getCityPosition: function() {
		return new common_FPoint(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + this.relativeY);
	}
	,onClick: function() {
		gui_FollowingFish.createWindow(this.city,this);
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
		if(this.moveSpeed > 0 || this.speeding) {
			var movePot = 0.0;
			switch(this.moveDirection) {
			case 0:
				movePot = this.leftMovePotential();
				if(movePot <= 0) {
					this.moveSpeed = 0;
					this.speeding = false;
					this.slowing = false;
				} else {
					this.relativeX -= Math.min(movePot,timeMod * this.moveSpeed);
				}
				break;
			case 1:
				movePot = this.topMovePotential();
				if(movePot <= 0) {
					this.moveSpeed = 0;
					this.speeding = false;
					this.slowing = false;
				} else {
					this.relativeY -= Math.min(movePot,timeMod * this.moveSpeed);
				}
				break;
			case 2:
				movePot = this.rightMovePotential();
				if(movePot <= 0) {
					this.moveSpeed = 0;
					this.speeding = false;
					this.slowing = false;
				} else {
					this.relativeX += Math.min(movePot,timeMod * this.moveSpeed);
				}
				break;
			case 3:
				movePot = this.bottomMovePotential();
				if(movePot <= 0) {
					this.moveSpeed = 0;
					this.speeding = false;
					this.slowing = false;
				} else {
					this.relativeY += Math.min(movePot,timeMod * this.moveSpeed);
				}
				break;
			default:
			}
			var bld = this.inPermanent;
			if(this.relativeX < 0 && bld.leftIsWaterFilled) {
				this.relativeX += 20;
				this.inPermanent = bld.leftAsWaterFilled;
			}
			if(this.relativeY < 0 && bld.topIsWaterFilled) {
				this.relativeY += 20;
				this.inPermanent = bld.topAsWaterFilled;
			}
			if(this.relativeX >= 20 && bld.rightIsWaterFilled) {
				this.relativeX -= 20;
				this.inPermanent = bld.rightAsWaterFilled;
			}
			if(this.relativeY >= 20 && bld.bottomIsWaterFilled) {
				this.relativeY -= 20;
				this.inPermanent = bld.bottomAsWaterFilled;
			}
			if(this.speeding) {
				this.moveSpeed = Math.min(this.maxSpeed,this.moveSpeed + this.normalAcceleration * timeMod);
				if(this.moveSpeed > this.stopSpeedSpeed && random_Random.getFloat(1) < this.stopMoveProb * timeMod || movePot < 2) {
					this.speeding = false;
				}
			} else if(this.slowing) {
				this.moveSpeed = Math.max(0,this.moveSpeed - this.normalSlowdown * timeMod);
			} else if(random_Random.getFloat(1) < this.startSlowingProb * (5 / (movePot < 1 ? 1 : movePot > 15 ? 15 : movePot)) * timeMod || movePot < 3) {
				this.slowing = true;
			}
		}
		if(this.moveSpeed == 0) {
			var dir = random_Random.getInt(12);
			if(dir == 0 || dir == 4 || this.moveDirection == 0 && dir == 11) {
				if(this.leftMovePotential() > 3) {
					this.moveDirection = 0;
					this.speeding = true;
					this.slowing = false;
				}
			} else if(dir == 1 || dir == 5 || this.moveDirection == 2 && dir == 11) {
				if(this.rightMovePotential() > 3) {
					this.moveDirection = 2;
					this.speeding = true;
					this.slowing = false;
				}
			} else if(dir == 2 || this.moveDirection == 1 && dir >= 10) {
				if(this.topMovePotential() > 3) {
					this.moveDirection = 1;
					this.speeding = true;
					this.slowing = false;
				}
			} else if(dir == 3 || this.moveDirection == 3 && dir >= 10) {
				if(this.bottomMovePotential() > 3) {
					this.moveDirection = 3;
					this.speeding = true;
					this.slowing = false;
				}
			} else {
				this.speeding = false;
				this.slowing = false;
			}
		}
		this.updateDisplay();
	}
	,leftMovePotential: function() {
		var lmp = 0.0;
		var bld = this.inPermanent;
		lmp += this.relativeX - this.width / 2 - 3;
		if(bld != null) {
			bld = bld.leftAsWaterFilled;
			if(bld != null && (this.relativeY > 3 + this.height / 2 || bld.topIsWaterFilled) && (this.relativeY < 17 - this.height / 2 || bld.bottomIsWaterFilled)) {
				lmp += 20;
			}
		}
		return lmp;
	}
	,rightMovePotential: function() {
		var mp = 0.0;
		var bld = this.inPermanent;
		mp += 17 - this.width / 2 - this.relativeX;
		if(bld != null) {
			bld = bld.rightAsWaterFilled;
			if(bld != null && (this.relativeY > 3 + this.height / 2 || bld.topIsWaterFilled) && (this.relativeY < 17 - this.height / 2 || bld.bottomIsWaterFilled)) {
				mp += 20;
			}
		}
		return mp;
	}
	,topMovePotential: function() {
		var lmp = 0.0;
		var bld = this.inPermanent;
		lmp += this.relativeY - this.verticalWidthToUse / 2 - 3;
		if(bld != null) {
			bld = bld.topAsWaterFilled;
			if(bld != null && (this.relativeX > 3 + this.verticalHeightToUse / 2 || bld.leftIsWaterFilled) && (this.relativeX < 17 - this.verticalHeightToUse / 2 || bld.rightIsWaterFilled)) {
				lmp += 20;
			}
		}
		return lmp;
	}
	,bottomMovePotential: function() {
		var mp = 0.0;
		var bld = this.inPermanent;
		mp += 17 - this.verticalWidthToUse / 2 - this.relativeY;
		if(bld != null) {
			bld = bld.bottomAsWaterFilled;
			if(bld != null && (this.relativeX > 3 + this.verticalHeightToUse / 2 || bld.leftIsWaterFilled) && (this.relativeX < 17 - this.verticalHeightToUse / 2 || bld.rightIsWaterFilled)) {
				mp += 20;
			}
		}
		return mp;
	}
	,updateDisplay: function() {
		this.sprite.position.set(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + this.relativeY);
		if(this.spriteCanBeRotated) {
			if(this.moveDirection == 1) {
				this.sprite.rotation = 1.5 * Math.PI;
			} else if(this.moveDirection == 3) {
				this.sprite.rotation = 0.5 * Math.PI;
			} else if(this.moveDirection == 2) {
				this.sprite.rotation = 0;
			} else {
				this.sprite.rotation = Math.PI;
			}
		}
	}
	,postLoad: function() {
		this.setTypeSprite();
	}
	,setTypeSprite: function() {
		var smallFishTextures = Resources.getTexturesByWidth("spr_fish",2);
		var jellyTextures = Resources.getTexturesByWidth("spr_fish_jelly",5);
		var bigFishTextures = Resources.getTexturesByWidth("spr_fish_big",4);
		var snakeTextures = Resources.getTexturesByWidth("spr_fish_snake",8);
		var bigFishTextures2 = Resources.getTexturesByWidth("spr_fish_big2",5);
		this.spriteCanBeRotated = false;
		switch(this.type) {
		case 0:
			this.sprite.texture = smallFishTextures[0];
			this.spriteCanBeRotated = true;
			break;
		case 1:
			this.sprite.texture = smallFishTextures[1];
			this.spriteCanBeRotated = true;
			break;
		case 2:
			this.sprite.texture = jellyTextures[0];
			this.maxSpeed = 0.4;
			this.stopSpeedSpeed = 0.2;
			this.normalAcceleration = 0.025;
			this.normalSlowdown = 0.025;
			this.spriteCanBeRotated = false;
			this.stopMoveProb = 0.03;
			this.startSlowingProb = 0.1;
			break;
		case 3:
			this.sprite.texture = bigFishTextures[0];
			this.spriteCanBeRotated = true;
			break;
		case 4:
			this.sprite.texture = snakeTextures[0];
			this.spriteCanBeRotated = true;
			this.maxSpeed = 0.3;
			this.stopSpeedSpeed = 0.2;
			this.normalAcceleration = 0.02;
			this.normalSlowdown = 0.02;
			this.stopMoveProb = 0.02;
			this.startSlowingProb = 0.1;
			break;
		case 5:
			this.sprite.texture = smallFishTextures[2];
			this.spriteCanBeRotated = true;
			break;
		case 6:
			this.sprite.texture = bigFishTextures[1];
			this.spriteCanBeRotated = true;
			break;
		case 7:
			this.sprite.texture = bigFishTextures2[0];
			this.spriteCanBeRotated = true;
			break;
		case 8:
			this.sprite.texture = smallFishTextures[3];
			this.spriteCanBeRotated = true;
			break;
		case 9:
			this.sprite.texture = smallFishTextures[4];
			this.spriteCanBeRotated = true;
			break;
		case 10:
			this.sprite.texture = bigFishTextures[2];
			this.spriteCanBeRotated = true;
			break;
		}
		this.width = Math.round(this.sprite.texture.width);
		this.height = Math.round(this.sprite.texture.height);
		if(this.spriteCanBeRotated) {
			this.verticalWidthToUse = this.width;
			this.verticalHeightToUse = this.height;
		} else {
			this.verticalWidthToUse = this.height;
			this.verticalHeightToUse = this.width;
		}
	}
	,pushBackIntoPermanent: function() {
		var bld = this.inPermanent;
		var widthToUse = this.moveDirection == 1 || this.moveDirection == 3 ? this.verticalHeightToUse : this.width;
		var heightToUse = this.moveDirection == 1 || this.moveDirection == 3 ? this.verticalWidthToUse : this.height;
		if(!bld.leftIsWaterFilled && this.relativeX < 3 + widthToUse / 2) {
			this.relativeX = 3 + widthToUse / 2;
		}
		if(!bld.topIsWaterFilled && this.relativeY < 3 + heightToUse / 2) {
			this.relativeY = 3 + heightToUse / 2;
		}
		if(!bld.rightIsWaterFilled && this.relativeX > 17 - widthToUse / 2) {
			this.relativeX = 17 - widthToUse / 2;
		}
		if(!bld.bottomIsWaterFilled && this.relativeY > 17 - heightToUse / 2) {
			this.relativeY = 17 - heightToUse / 2;
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_Fish.saveDefinition);
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
	,__class__: simulation_Fish
};
