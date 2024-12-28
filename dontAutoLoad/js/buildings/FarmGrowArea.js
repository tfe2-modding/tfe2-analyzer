var buildings_FarmGrowArea = $hxClasses["buildings.FarmGrowArea"] = function(stage,partOf,relativePosition,city,textureName,textureWidth,foodPerHarvest,growSpeedMultiplier,cleanSpeed,harvestSpritePart) {
	if(harvestSpritePart == null) {
		harvestSpritePart = 1;
	}
	this.percentCleaned = 0;
	this.originalFoodLeft = 1;
	this.foodLeft = 0;
	this.percentGrown = 0;
	this.farmStage = 0;
	this.harvestSpritePart = 1;
	this.passiveGrowSpeedBadLight = 0.006;
	this.passiveGrowSpeed = 0.012;
	this.cleanSpeed = 5;
	this.harvestAmount = 0.25;
	this.growSpeed = 0.85;
	this.foodPerHarvest = 25;
	this.partOf = partOf;
	this.city = city;
	this.relativePosition = relativePosition;
	this.stage = stage;
	this.foodPerHarvest = foodPerHarvest;
	this.growSpeed *= growSpeedMultiplier;
	this.passiveGrowSpeed *= growSpeedMultiplier;
	this.passiveGrowSpeedBadLight *= growSpeedMultiplier;
	this.cleanSpeed = cleanSpeed;
	this.harvestSpritePart = harvestSpritePart;
	this.textures = Resources.getTexturesByWidth(textureName,textureWidth);
	this.growthSprite = new PIXI.Sprite();
	stage.addChild(this.growthSprite);
	this.positionSprites();
	this.updateTexture();
};
buildings_FarmGrowArea.__name__ = "buildings.FarmGrowArea";
buildings_FarmGrowArea.prototype = {
	destroy: function() {
		this.growthSprite.destroy();
	}
	,update: function(timeMod) {
		if(this.farmStage == 0) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = 7;
			var end = 20;
			if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
				this.percentGrown += timeMod * this.passiveGrowSpeed;
				if(this.percentGrown >= 100) {
					this.farmStage = 1;
					this.foodLeft = this.foodPerHarvest + this.city.simulation.bonuses.extraFoodFromFarms + this.partOf.getEffectsOfAdjecentBuildings("increaseCropNumber");
					this.originalFoodLeft = this.foodLeft;
				}
				this.updateTexture();
			} else {
				var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
				var start = 7 - 1;
				var end = 20 + 1;
				if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
					this.percentGrown += timeMod * this.passiveGrowSpeedBadLight;
					if(this.percentGrown >= 100) {
						this.farmStage = 1;
						this.foodLeft = this.foodPerHarvest + this.city.simulation.bonuses.extraFoodFromFarms + this.partOf.getEffectsOfAdjecentBuildings("increaseCropNumber");
						this.originalFoodLeft = this.foodLeft;
					}
					this.updateTexture();
				}
			}
		}
	}
	,doCitizenWork: function(citizen) {
		var _gthis = this;
		var timeMin = (this.farmStage == 1 ? 15 : 30) / this.city.simulation.happiness.actionSpeedModifierWithoutPenalties | 0;
		var timeMax = (this.farmStage == 1 ? 30 : 60) / this.city.simulation.happiness.actionSpeedModifierWithoutPenalties | 0;
		var modifyWithHappiness = false;
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(this.relativePosition.x,this.relativePosition.x + (this.growthSprite.texture.width | 0) - 2 + 1),random_Random.getInt(timeMin,timeMax),function() {
			_gthis.onCitizenWork(citizen);
		},modifyWithHappiness,false);
	}
	,doCitizenWorkNoMove: function(citizen) {
		var _gthis = this;
		var timeMin = this.farmStage == 1 ? 15 : 30;
		var timeMax = this.farmStage == 1 ? 30 : 60;
		var citizen1 = citizen;
		var pool = pooling_Int32ArrayPool.pool;
		var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
		arr[0] = 8;
		arr[1] = random_Random.getInt(timeMin,timeMax);
		citizen1.setPath(arr,0,2,true);
		citizen.pathEndFunction = function() {
			_gthis.onCitizenWork(citizen);
		};
		citizen.pathOnlyRelatedTo = citizen.inPermanent;
	}
	,onCitizenWork: function(citizen) {
		switch(this.farmStage) {
		case 0:
			this.percentGrown += this.growSpeed;
			if(this.percentGrown >= 100) {
				this.farmStage = 1;
				this.foodLeft = this.foodPerHarvest + this.city.simulation.bonuses.extraFoodFromFarms + this.partOf.getEffectsOfAdjecentBuildings("increaseCropNumber");
				this.originalFoodLeft = this.foodLeft;
			}
			this.updateTexture();
			break;
		case 1:
			var currentHarvestAmount = this.harvestAmount * this.city.simulation.boostManager.currentGlobalBoostAmount;
			this.foodLeft -= currentHarvestAmount;
			var _g = this.city.materials;
			_g.set_food(_g.food + currentHarvestAmount);
			this.city.simulation.stats.materialProduction[0][0] += currentHarvestAmount;
			if(this.foodLeft <= 0) {
				if(this.cleanSpeed <= 0) {
					this.farmStage = 0;
					this.percentGrown = 0;
				} else {
					this.percentCleaned = 0;
					this.farmStage = 2;
				}
			}
			this.updateTexture();
			break;
		case 2:
			this.percentCleaned += this.cleanSpeed;
			if(this.percentCleaned >= 100) {
				this.farmStage = 0;
				this.percentGrown = 0;
			}
			this.updateTexture();
			break;
		}
	}
	,setTexture: function(textureName,textureWidth) {
		this.textures = Resources.getTexturesByWidth(textureName,textureWidth);
	}
	,updateTexture: function() {
		var tmp;
		switch(this.farmStage) {
		case 0:
			tmp = this.textures[Math.floor(this.percentGrown / 100 * (this.textures.length - 1 - this.harvestSpritePart))];
			break;
		case 1:
			var val = this.textures.length - 1 - Math.ceil(this.foodLeft / this.originalFoodLeft * 0.9999 * this.harvestSpritePart);
			var maxVal = this.textures.length - 2;
			tmp = this.textures[val < 1 ? 1 : val > maxVal ? maxVal : val];
			break;
		case 2:
			tmp = this.textures[this.textures.length - 1];
			break;
		}
		this.growthSprite.texture = tmp;
	}
	,positionSprites: function() {
		if(this.growthSprite != null) {
			this.growthSprite.position.set(this.partOf.position.x + this.relativePosition.x,this.partOf.position.y + this.relativePosition.y);
		}
	}
	,showInfoText: function(extraText) {
		var _gthis = this;
		this.city.gui.windowAddInfoText(null,function() {
			var extraText1 = extraText;
			var tmp;
			switch(_gthis.farmStage) {
			case 0:
				tmp = common_Localize.lo("crops_grow_pct",[Math.floor(_gthis.percentGrown)]);
				break;
			case 1:
				tmp = common_Localize.lo("food_left_to_harvest",[Math.floor(_gthis.foodLeft)]);
				break;
			case 2:
				tmp = common_Localize.lo("old_crops_cleaned",[Math.floor(_gthis.percentCleaned)]);
				break;
			}
			return extraText1 + tmp;
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(buildings_FarmGrowArea.saveDefinition);
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
		var value = this.originalFoodLeft;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"originalFoodLeft")) {
			this.originalFoodLeft = loadMap.h["originalFoodLeft"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"percentCleaned")) {
			this.percentCleaned = loadMap.h["percentCleaned"];
		}
	}
	,__class__: buildings_FarmGrowArea
};
