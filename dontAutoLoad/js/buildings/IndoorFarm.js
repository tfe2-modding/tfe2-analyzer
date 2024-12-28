var buildings_IndoorFarm = $hxClasses["buildings.IndoorFarm"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.percentCleaned = 0;
	this.foodLeft = 0;
	this.percentGrown = 20;
	this.farmStage = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.textures = Resources.getTexturesByWidth("spr_indoorfarm_crops",20);
	this.growthSprite = new PIXI.Sprite();
	bgStage.addChild(this.growthSprite);
	this.updateTexture();
	this.positionSprites();
	this.doorX = 12;
	this.adjecentBuildingEffects.push({ name : "farm", intensity : 1});
};
buildings_IndoorFarm.__name__ = "buildings.IndoorFarm";
buildings_IndoorFarm.__super__ = buildings_Work;
buildings_IndoorFarm.prototype = $extend(buildings_Work.prototype,{
	postLoad: function() {
		this.updateTexture();
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		var _gthis = this;
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			var timeMin = (this.farmStage == 1 ? 15 : 30) / this.city.simulation.happiness.actionSpeedModifierWithoutPenalties | 0;
			var timeMax = (this.farmStage == 1 ? 30 : 60) / this.city.simulation.happiness.actionSpeedModifierWithoutPenalties | 0;
			var modifyWithHappiness = false;
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(3,15),random_Random.getInt(timeMin,timeMax),function() {
				switch(_gthis.farmStage) {
				case 0:
					_gthis.percentGrown += 1.35 * _gthis.city.simulation.bonuses.indoorFarmSpeed;
					if(_gthis.percentGrown >= 100) {
						_gthis.farmStage = 1;
						var tmp = 25 + _gthis.city.simulation.bonuses.extraFoodFromFarms;
						var tmp1 = _gthis.getEffectsOfAdjecentBuildings("increaseCropNumber");
						_gthis.foodLeft = tmp + tmp1;
					}
					_gthis.updateTexture();
					break;
				case 1:
					var currentHarvestAmount = 0.25 * _gthis.city.simulation.boostManager.currentGlobalBoostAmount;
					_gthis.foodLeft -= currentHarvestAmount;
					var _g = _gthis.city.materials;
					_g.set_food(_g.food + currentHarvestAmount);
					_gthis.city.simulation.stats.materialProduction[0][0] += currentHarvestAmount;
					if(_gthis.foodLeft <= 0) {
						_gthis.percentCleaned = 0;
						_gthis.farmStage = 2;
					}
					_gthis.updateTexture();
					break;
				case 2:
					_gthis.percentCleaned += 5;
					if(_gthis.percentCleaned >= 100) {
						_gthis.farmStage = 0;
						_gthis.percentGrown = 0;
					}
					_gthis.updateTexture();
					break;
				}
			},modifyWithHappiness,false);
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		this.growthSprite.destroy();
	}
	,update: function(timeMod) {
		if(this.farmStage == 0) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = 7;
			var end = 20;
			if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
				this.percentGrown += timeMod * 0.03 * this.city.simulation.bonuses.indoorFarmSpeed;
				if(this.percentGrown >= 100) {
					this.farmStage = 1;
					this.foodLeft = 25 + this.city.simulation.bonuses.extraFoodFromFarms + this.getEffectsOfAdjecentBuildings("increaseCropNumber");
				}
				this.updateTexture();
			} else {
				var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
				var start = 7 - 1;
				var end = 20 + 1;
				if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
					this.percentGrown += timeMod * 0.015 * this.city.simulation.bonuses.indoorFarmSpeed;
					if(this.percentGrown >= 100) {
						this.farmStage = 1;
						this.foodLeft = 25 + this.city.simulation.bonuses.extraFoodFromFarms + this.getEffectsOfAdjecentBuildings("increaseCropNumber");
					}
					this.updateTexture();
				}
			}
		}
	}
	,grow: function(percent) {
		this.percentGrown += percent;
		if(this.percentGrown >= 100) {
			this.farmStage = 1;
			this.foodLeft = 25 + this.city.simulation.bonuses.extraFoodFromFarms + this.getEffectsOfAdjecentBuildings("increaseCropNumber");
		}
		this.updateTexture();
	}
	,updateTexture: function() {
		var tmp;
		switch(this.farmStage) {
		case 0:
			tmp = this.textures[Math.floor(this.percentGrown / 100 * (this.textures.length - 2))];
			break;
		case 1:
			tmp = this.textures[this.textures.length - 2];
			break;
		case 2:
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
			switch(_gthis.farmStage) {
			case 0:
				return common_Localize.lo("crops_grown",[Math.floor(_gthis.percentGrown)]);
			case 1:
				return common_Localize.lo("food_left",[Math.floor(_gthis.foodLeft)]);
			case 2:
				return common_Localize.lo("percent_cleaned",[Math.floor(_gthis.percentCleaned)]);
			}
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_IndoorFarm.saveDefinition);
		}
		var value = this.farmStage;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
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
	,__class__: buildings_IndoorFarm
});
