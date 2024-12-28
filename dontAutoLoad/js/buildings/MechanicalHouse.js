var buildings_MechanicalHouse = $hxClasses["buildings.MechanicalHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.hasHeatedBed = false;
	this.movementType = 0;
	this.bgSprite2 = null;
	this.currentAdjBonus = 0;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_MechanicalHouse.__name__ = "buildings.MechanicalHouse";
buildings_MechanicalHouse.__super__ = buildings_House;
buildings_MechanicalHouse.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_HeatedBed];
	}
	,destroy: function() {
		buildings_House.prototype.destroy.call(this);
		if(this.spriteOverMachinePartsFactory != null) {
			this.spriteOverMachinePartsFactory.destroy();
		}
		if(this.bgSprite != null) {
			this.bgSprite.destroy();
		}
		if(this.bgSprite2 != null) {
			this.bgSprite2.destroy();
		}
		this.spriteOverMachinePartsFactory = null;
		this.bgSprite = null;
	}
	,update: function(timeMod) {
		if(this.bgSprite != null) {
			this.bgTexture += timeMod * 0.25;
			if(this.bgTexture >= this.bgTextures.length) {
				this.bgTexture = 0;
			}
			this.bgSprite.texture = this.bgTextures[this.bgTexture | 0];
		}
	}
	,walkAround: function(citizen,stepsInBuilding) {
		if(this.movementType == 0) {
			buildings_House.prototype.walkAround.call(this,citizen,stepsInBuilding);
		} else if(this.movementType == 1) {
			var r = random_Random.getInt(4);
			if(r == 0 && stepsInBuilding > 120 && citizen.relativeX < 11) {
				citizen.changeFloorAndWaitRandom(30,60);
			} else if(r == 1) {
				citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(30,60),null,false,false);
			} else if(r == 2 && citizen.relativeY < 5) {
				citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(30,60),null,false,false);
			} else {
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 8;
				arr[1] = random_Random.getInt(90,120);
				citizen.setPath(arr,0,2,true);
				citizen.pathEndFunction = null;
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
			}
		} else if(this.movementType == 2) {
			var r = random_Random.getInt(4);
			if(r == 0 && stepsInBuilding > 120 && citizen.relativeX > 11) {
				citizen.changeFloorAndWaitRandom(30,60);
			} else if(r <= 2 && citizen.relativeY < 5) {
				citizen.moveAndWait(random_Random.getInt(7,16),random_Random.getInt(30,60),null,false,false);
			} else if(r <= 2) {
				citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(30,60),null,false,false);
			} else {
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 8;
				arr[1] = random_Random.getInt(90,120);
				citizen.setPath(arr,0,2,true);
				citizen.pathEndFunction = null;
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
			}
		} else if(this.movementType == 3) {
			var r = random_Random.getInt(4);
			if(r == 0 && stepsInBuilding > 120 && citizen.relativeX > 11) {
				citizen.changeFloorAndWaitRandom(30,60);
			} else if((r == 1 || r == 2) && citizen.relativeY < 5) {
				citizen.moveAndWait(random_Random.getInt(7,16),random_Random.getInt(30,60),null,false,false);
			} else if(r == 2) {
				citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(30,60),null,false,false);
			} else {
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 8;
				arr[1] = random_Random.getInt(90,120);
				citizen.setPath(arr,0,2,true);
				citizen.pathEndFunction = null;
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
			}
		}
	}
	,onCityChange: function() {
		var _gthis = this;
		var newAdjBonus = 0;
		this.movementType = 0;
		if(this.rightBuilding != null && this.rightBuilding.is(buildings_MachinePartsFactory)) {
			if(this.leftBuilding != null && this.leftBuilding.is(buildings_MachinePartsFactory)) {
				newAdjBonus = 50;
				this.drawer.changeMainTexture("spr_mechanicalhouse_leftright");
				if(_gthis.spriteOverMachinePartsFactory == null) {
					_gthis.spriteOverMachinePartsFactory = new PIXI.Sprite();
					_gthis.city.justAboveCityStage.addChild(_gthis.spriteOverMachinePartsFactory);
				}
				if(_gthis.bgSprite == null) {
					_gthis.bgSprite = new PIXI.Sprite();
					_gthis.bgStage.addChild(_gthis.bgSprite);
				}
				if(_gthis.bgSprite2 != null) {
					_gthis.bgSprite2.destroy();
				}
				if(_gthis.hasHeatedBed) {
					_gthis.bgSprite2 = new PIXI.Sprite(Resources.getTexture("spr_mechanicalhouse_heatedbed"));
					_gthis.bgStage.addChild(_gthis.bgSprite2);
				}
				_gthis.bgSprite.position.set(_gthis.position.x,_gthis.position.y);
				this.bgTextures = Resources.getTexturesByWidth("spr_mechanicalhouse_leftright_bganim",20);
				this.spriteOverMachinePartsFactory.texture = Resources.getTexture(this.leftBuilding.bottomBuilding == null ? "spr_mechanicalhouse_pipe_h3_bf" : "spr_mechanicalhouse_pipe_h3");
				this.spriteOverMachinePartsFactory.position.set(this.position.x - 3,this.position.y);
				this.bgTexture = this.rightBuilding.bgTexture % this.bgTextures.length;
			} else {
				newAdjBonus = 50;
				this.drawer.changeMainTexture("spr_mechanicalhouse_left");
				if(_gthis.spriteOverMachinePartsFactory == null) {
					_gthis.spriteOverMachinePartsFactory = new PIXI.Sprite();
					_gthis.city.justAboveCityStage.addChild(_gthis.spriteOverMachinePartsFactory);
				}
				if(_gthis.bgSprite == null) {
					_gthis.bgSprite = new PIXI.Sprite();
					_gthis.bgStage.addChild(_gthis.bgSprite);
				}
				if(_gthis.bgSprite2 != null) {
					_gthis.bgSprite2.destroy();
				}
				if(_gthis.hasHeatedBed) {
					_gthis.bgSprite2 = new PIXI.Sprite(Resources.getTexture("spr_mechanicalhouse_heatedbed"));
					_gthis.bgStage.addChild(_gthis.bgSprite2);
				}
				_gthis.bgSprite.position.set(_gthis.position.x,_gthis.position.y);
				this.bgTextures = Resources.getTexturesByWidth("spr_mechanicalhouse_left_bganim",20);
				this.spriteOverMachinePartsFactory.texture = Resources.getTexture("spr_mechanicalhouse_pipe_h");
				this.spriteOverMachinePartsFactory.position.set(this.position.x + 20,this.position.y + 4);
				this.bgTexture = this.rightBuilding.bgTexture % this.bgTextures.length;
			}
			this.movementType = 1;
		} else if(this.bottomBuilding != null && this.bottomBuilding.is(buildings_MachinePartsFactory)) {
			newAdjBonus = 50;
			this.drawer.changeMainTexture("spr_mechanicalhouse_top");
			if(_gthis.spriteOverMachinePartsFactory == null) {
				_gthis.spriteOverMachinePartsFactory = new PIXI.Sprite();
				_gthis.city.justAboveCityStage.addChild(_gthis.spriteOverMachinePartsFactory);
			}
			if(_gthis.bgSprite == null) {
				_gthis.bgSprite = new PIXI.Sprite();
				_gthis.bgStage.addChild(_gthis.bgSprite);
			}
			if(_gthis.bgSprite2 != null) {
				_gthis.bgSprite2.destroy();
			}
			if(_gthis.hasHeatedBed) {
				_gthis.bgSprite2 = new PIXI.Sprite(Resources.getTexture("spr_mechanicalhouse_heatedbed"));
				_gthis.bgStage.addChild(_gthis.bgSprite2);
			}
			_gthis.bgSprite.position.set(_gthis.position.x,_gthis.position.y);
			this.bgTextures = Resources.getTexturesByWidth("spr_mechanicalhouse_top_bganim",20);
			if(this.topBuilding != null && this.topBuilding.is(buildings_MachinePartsFactory)) {
				this.spriteOverMachinePartsFactory.texture = Resources.getTexture("spr_mechanicalhouse_pipe_v3");
				this.spriteOverMachinePartsFactory.position.set(this.position.x + 1,this.position.y - 3);
			} else {
				this.spriteOverMachinePartsFactory.texture = Resources.getTexture("spr_mechanicalhouse_pipe_v1");
				this.spriteOverMachinePartsFactory.position.set(this.position.x + 1,this.position.y + 20);
			}
			this.bgTexture = this.bottomBuilding.bgTexture % this.bgTextures.length;
			this.movementType = 2;
		} else if(this.leftBuilding != null && this.leftBuilding.is(buildings_MachinePartsFactory)) {
			newAdjBonus = 50;
			this.drawer.changeMainTexture("spr_mechanicalhouse_right");
			if(_gthis.spriteOverMachinePartsFactory == null) {
				_gthis.spriteOverMachinePartsFactory = new PIXI.Sprite();
				_gthis.city.justAboveCityStage.addChild(_gthis.spriteOverMachinePartsFactory);
			}
			if(_gthis.bgSprite == null) {
				_gthis.bgSprite = new PIXI.Sprite();
				_gthis.bgStage.addChild(_gthis.bgSprite);
			}
			if(_gthis.bgSprite2 != null) {
				_gthis.bgSprite2.destroy();
			}
			if(_gthis.hasHeatedBed) {
				_gthis.bgSprite2 = new PIXI.Sprite(Resources.getTexture("spr_mechanicalhouse_heatedbed"));
				_gthis.bgStage.addChild(_gthis.bgSprite2);
			}
			_gthis.bgSprite.position.set(_gthis.position.x,_gthis.position.y);
			this.bgTextures = Resources.getTexturesByWidth("spr_mechanicalhouse_right_bganim",20);
			this.spriteOverMachinePartsFactory.texture = Resources.getTexture(this.leftBuilding.bottomBuilding == null ? "spr_mechanicalhouse_pipe_h2_bf" : "spr_mechanicalhouse_pipe_h2");
			this.spriteOverMachinePartsFactory.position.set(this.position.x - 3,this.position.y + 11 - (this.leftBuilding.bottomBuilding == null ? 6 : 0));
			this.bgTexture = this.leftBuilding.bgTexture % this.bgTextures.length;
		} else if(this.topBuilding != null && this.topBuilding.is(buildings_MachinePartsFactory)) {
			newAdjBonus = 50;
			this.drawer.changeMainTexture("spr_mechanicalhouse_bottom");
			if(_gthis.spriteOverMachinePartsFactory == null) {
				_gthis.spriteOverMachinePartsFactory = new PIXI.Sprite();
				_gthis.city.justAboveCityStage.addChild(_gthis.spriteOverMachinePartsFactory);
			}
			if(_gthis.bgSprite == null) {
				_gthis.bgSprite = new PIXI.Sprite();
				_gthis.bgStage.addChild(_gthis.bgSprite);
			}
			if(_gthis.bgSprite2 != null) {
				_gthis.bgSprite2.destroy();
			}
			if(_gthis.hasHeatedBed) {
				_gthis.bgSprite2 = new PIXI.Sprite(Resources.getTexture("spr_mechanicalhouse_heatedbed"));
				_gthis.bgStage.addChild(_gthis.bgSprite2);
			}
			_gthis.bgSprite.position.set(_gthis.position.x,_gthis.position.y);
			this.bgTextures = Resources.getTexturesByWidth("spr_mechanicalhouse_bottom_bganim",20);
			this.spriteOverMachinePartsFactory.texture = Resources.getTexture("spr_mechanicalhouse_pipe_v2");
			this.spriteOverMachinePartsFactory.position.set(this.position.x + 3,this.position.y - 3);
			this.bgTexture = this.topBuilding.bgTexture % this.bgTextures.length;
			this.movementType = 3;
		} else {
			this.drawer.changeMainTexture("spr_mechanicalhouse");
			if(this.spriteOverMachinePartsFactory != null) {
				this.spriteOverMachinePartsFactory.destroy();
				this.spriteOverMachinePartsFactory = null;
			}
			if(this.bgSprite != null) {
				this.bgSprite.destroy();
				this.bgSprite = null;
			}
			if(this.hasHeatedBed) {
				if(this.bgSprite2 == null) {
					this.bgSprite2 = new PIXI.Sprite(Resources.getTexture("spr_mechanicalhouse_heatedbed"));
					this.bgStage.addChild(this.bgSprite2);
				}
			}
		}
		if(this.bgSprite2 != null) {
			this.bgSprite2.position.set(this.position.x,this.position.y);
		}
		if(this.bgSprite != null) {
			this.bgSprite.texture = this.bgTextures[this.bgTexture | 0];
		}
		this.bonusAttractiveness += newAdjBonus - this.currentAdjBonus;
		if(newAdjBonus != (this.currentAdjBonus | 0)) {
			this.city.simulation.houseAssigner.shouldUpdateHouses = true;
		}
		this.currentAdjBonus = newAdjBonus | 0;
	}
	,__class__: buildings_MechanicalHouse
});
