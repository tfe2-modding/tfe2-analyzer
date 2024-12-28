var buildings_CacaoFarm = $hxClasses["buildings.CacaoFarm"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.percentCleaned = 0;
	this.foodLeft = 0;
	this.percentGrown = 0;
	this.farmStage = buildings_CacaoFarmStage.Growing;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.textures = Resources.getTexturesByWidth("spr_cacaofarm_trees",20);
	this.growthSprite = new PIXI.Sprite();
	bgStage.addChild(this.growthSprite);
	this.updateTexture();
	this.positionSprites();
	this.doorX = 12;
	this.adjecentBuildingEffects.push({ name : "farm", intensity : 1});
};
buildings_CacaoFarm.__name__ = "buildings.CacaoFarm";
buildings_CacaoFarm.__super__ = buildings_Work;
buildings_CacaoFarm.prototype = $extend(buildings_Work.prototype,{
	postLoad: function() {
		this.updateTexture();
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		var _gthis = this;
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else if(this.farmStage == buildings_CacaoFarmStage.Growing) {
			citizen.setRelativeY(0);
			var modifyWithHappiness = this.city.materials.food > 1 || this.city.simulation.happiness.actionSpeedModifier > 1;
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(5,13),random_Random.getInt(50,100),function() {
				_gthis.percentGrown += 0.75;
				if(_gthis.percentGrown >= 100) {
					_gthis.farmStage = buildings_CacaoFarmStage.Harvesting;
					var tmp = 35 + _gthis.city.simulation.bonuses.extraFoodFromFarms;
					var tmp1 = _gthis.getEffectsOfAdjecentBuildings("increaseCropNumber");
					_gthis.foodLeft = tmp + tmp1;
				}
				_gthis.updateTexture();
			},modifyWithHappiness,false);
		} else {
			var firstTreeX = 6;
			var secondTreeX = 12;
			var firstTreeY = 7;
			var secondTreeY = 5;
			if(citizen.relativeY <= 1) {
				if(this.workers.indexOf(citizen) == 0) {
					citizen.setPath(new Int32Array([4,firstTreeX,9,firstTreeY]),0,4,true);
				} else {
					citizen.setPath(new Int32Array([4,secondTreeX,9,secondTreeY]),0,4,true);
				}
			} else {
				var thisHarvestAmount = this.city.simulation.boostManager.currentGlobalBoostAmount * 0.025 / this.city.simulation.happiness.actionSpeedModifier;
				this.foodLeft -= thisHarvestAmount;
				var _g = this.city.materials;
				_g.set_food(_g.food + thisHarvestAmount);
				this.city.simulation.stats.materialProduction[0][0] += thisHarvestAmount;
				this.city.materials.cacao += thisHarvestAmount;
				this.city.simulation.stats.materialProduction[6][0] += thisHarvestAmount;
				if(this.foodLeft <= 0) {
					this.farmStage = buildings_CacaoFarmStage.Growing;
					this.percentGrown = 0;
				}
				this.updateTexture();
			}
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		this.growthSprite.destroy();
	}
	,update: function(timeMod) {
		if(this.farmStage == buildings_CacaoFarmStage.Growing) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = 7;
			var end = 20;
			if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
				this.percentGrown += timeMod * 0.012;
				if(this.percentGrown >= 100) {
					this.farmStage = buildings_CacaoFarmStage.Harvesting;
					this.foodLeft = 35 + this.city.simulation.bonuses.extraFoodFromFarms + this.getEffectsOfAdjecentBuildings("increaseCropNumber");
				}
				this.updateTexture();
			} else {
				var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
				var start = 7 - 1;
				var end = 20 + 1;
				if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
					this.percentGrown += timeMod * 0.006;
					if(this.percentGrown >= 100) {
						this.farmStage = buildings_CacaoFarmStage.Harvesting;
						this.foodLeft = 35 + this.city.simulation.bonuses.extraFoodFromFarms + this.getEffectsOfAdjecentBuildings("increaseCropNumber");
					}
					this.updateTexture();
				}
			}
		}
	}
	,grow: function(percent) {
		this.percentGrown += percent;
		if(this.percentGrown >= 100) {
			this.farmStage = buildings_CacaoFarmStage.Harvesting;
			this.foodLeft = 35 + this.city.simulation.bonuses.extraFoodFromFarms + this.getEffectsOfAdjecentBuildings("increaseCropNumber");
		}
		this.updateTexture();
	}
	,updateTexture: function() {
		var tmp;
		switch(this.farmStage._hx_index) {
		case 0:
			tmp = this.textures[Math.floor(this.percentGrown / 100 * (this.textures.length - 1))];
			break;
		case 1:
			tmp = this.textures[this.textures.length - 1];
			break;
		}
		this.growthSprite.texture = tmp;
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.growthSprite != null) {
			this.growthSprite.position.set(this.position.x,this.position.y);
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			switch(_gthis.farmStage._hx_index) {
			case 0:
				return common_Localize.lo("beans_grown",[Math.floor(_gthis.percentGrown)]);
			case 1:
				return common_Localize.lo("cacao_left",[Math.floor(_gthis.foodLeft)]);
			}
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_CacaoFarm.saveDefinition);
		}
		var e = this.farmStage;
		queue.addString($hxEnums[e.__enum__].__constructs__[e._hx_index]);
		var value = this.percentGrown;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.foodLeft;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.percentCleaned;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"farmStage")) {
			this.farmStage = loadMap.h["farmStage"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"percentGrown")) {
			this.percentGrown = loadMap.h["percentGrown"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"foodLeft")) {
			this.foodLeft = loadMap.h["foodLeft"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"percentCleaned")) {
			this.percentCleaned = loadMap.h["percentCleaned"];
		}
		this.postLoad();
	}
	,__class__: buildings_CacaoFarm
});
