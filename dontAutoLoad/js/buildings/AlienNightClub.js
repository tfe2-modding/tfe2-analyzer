var buildings_AlienNightClub = $hxClasses["buildings.AlienNightClub"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.laserImages = Resources.getTexturesByWidth("spr_nightclub_laser",18);
	this.lights = [];
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	var light = new PIXI.Sprite(Resources.getTexture("spr_lightbeam_aliennightclub"));
	bgStage.addChild(light);
	this.lights.push({ sprite : light, color : 0, alpha : 0, waiting : 1, alphaDir : 1});
	light.alpha = 0.8;
	var this1 = [150,1,0.5];
	light.tint = thx_color_Rgb.toInt(thx_color_Hsl.toRgb(this1));
	var light = new PIXI.Sprite(Resources.getTexture("spr_lightbeam_aliennightclub"));
	bgStage.addChild(light);
	this.lights.push({ sprite : light, color : 0, alpha : 0, waiting : 1, alphaDir : 1});
	light.alpha = 0.8;
	var this1 = [150,1,0.5];
	light.tint = thx_color_Rgb.toInt(thx_color_Hsl.toRgb(this1));
	var light = new PIXI.Sprite(Resources.getTexture("spr_aliennightclub_alienthing"));
	light.anchor.set(0.5,1);
	bgStage.addChild(light);
	this.lights.push({ sprite : light, color : 0, alpha : 0, waiting : 1, alphaDir : 1});
	light.alpha = 0.8;
	var this1 = [150,1,0.5];
	light.tint = thx_color_Rgb.toInt(thx_color_Hsl.toRgb(this1));
	var light = new PIXI.Sprite(Resources.getTexture("spr_aliennightclub_alienthing"));
	light.anchor.set(0.5,1);
	bgStage.addChild(light);
	this.lights.push({ sprite : light, color : 0, alpha : 0, waiting : 1, alphaDir : 1});
	light.alpha = 0.8;
	var this1 = [150,1,0.5];
	light.tint = thx_color_Rgb.toInt(thx_color_Hsl.toRgb(this1));
	this.laserStage = new PIXI.Container();
	bgStage.addChild(this.laserStage);
	this.laserStage.position.set(position.x,position.y);
	this.lasers = [];
	this.lasers.push({ start : new common_FPoint(2,3), end : new common_FPoint(6,18), hue : 120, speed : 1, targetLaserHue : -1, laserSprite : null, goBack : false});
	this.lasers.push({ start : new common_FPoint(17,3), end : new common_FPoint(6,18), hue : 200, speed : -1, targetLaserHue : -1, laserSprite : null, goBack : true});
	this.positionSprites();
	this.startTime = 20;
	this.endTime = 5.5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
	this.lightsAreOn = -1;
};
buildings_AlienNightClub.__name__ = "buildings.AlienNightClub";
buildings_AlienNightClub.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_AlienNightClub.__super__ = buildings_Work;
buildings_AlienNightClub.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 80 + this.city.upgrades.vars.nightClubEntertainmentQualityBonus;
	}
	,get_isOpen: function() {
		if(this.workers.length == 1 && this.workers[0].currentAction == 0) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = this.startTime - this.workTimePreferenceMod;
			if(start < 6) {
				if(this1 >= start) {
					return this1 < 6;
				} else {
					return false;
				}
			} else if(!(this1 >= start)) {
				return this1 < 6;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 2;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 5;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 7;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 3;
	}
	,get_entertainmentQuality: function() {
		return 100;
	}
	,get_isOpenForExistingVisitors: function() {
		return this.get_isOpen();
	}
	,finishEntertainment: function(citizen,timeMod) {
		return true;
	}
	,get_possibleUpgrades: function() {
		return [];
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,get_hasLeftNightClub: function() {
		if(this.leftBuilding != null) {
			return this.leftBuilding.is(buildings_AlienNightClub);
		} else {
			return false;
		}
	}
	,get_hasRightNightClub: function() {
		if(this.rightBuilding != null) {
			return this.rightBuilding.is(buildings_AlienNightClub);
		} else {
			return false;
		}
	}
	,postCreate: function() {
		buildings_Work.prototype.postCreate.call(this);
		this.positionSprites();
	}
	,destroy: function() {
		var _g = 0;
		var _g1 = this.lights;
		while(_g < _g1.length) {
			var light = _g1[_g];
			++_g;
			light.sprite.destroy();
		}
		this.laserStage.destroy({ children : true});
		buildings_Work.prototype.destroy.call(this);
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && this.city.simulation.time.timeSinceStart / 60 % 24 > 6) {
			citizen.currentAction = 2;
		} else if(this.get_hasLeftNightClub()) {
			citizen.moveAndWait(random_Random.getInt(0,this.get_hasRightNightClub() ? 19 : 17),random_Random.getInt(20,50),null,false,false);
			this.lightsAreOn = 60;
		} else {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(1 - citizen.relativeX) < spd) {
				citizen.relativeX = 1;
			} else {
				var num = 1 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
			this.lightsAreOn = 3;
		}
	}
	,beEntertained: function(citizen,timeMod) {
		var goTo = random_Random.getInt(2 + (this.get_hasLeftNightClub() ? 1 : 0) + (this.get_hasRightNightClub() ? 1 : 0));
		var canGoLR = true;
		if(this.get_hasLeftNightClub() && canGoLR && goTo == 0 && this.leftBuilding.get_isOpen()) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[6].length > 0 ? pool[6].splice(pool[6].length - 1,1)[0] : new Int32Array(6);
			arr[0] = 2;
			arr[1] = 0;
			arr[2] = 4;
			arr[3] = random_Random.getInt(5,19);
			arr[4] = 8;
			arr[5] = random_Random.getInt(3,6);
			citizen.setPath(arr,0,6,true);
		} else if(this.get_hasRightNightClub() && canGoLR && goTo == 1 && this.rightBuilding.get_isOpen()) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[6].length > 0 ? pool[6].splice(pool[6].length - 1,1)[0] : new Int32Array(6);
			arr[0] = 3;
			arr[1] = 0;
			arr[2] = 4;
			arr[3] = random_Random.getInt(0,17);
			arr[4] = 8;
			arr[5] = random_Random.getInt(3,6);
			citizen.setPath(arr,0,6,true);
		} else {
			var xMin = this.get_hasLeftNightClub() ? 0 : 5;
			var xMax = this.get_hasRightNightClub() ? 19 : 17;
			var modifyWithHappiness = false;
			var slowMove = false;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(xMin,xMax),random_Random.getInt(3,6),null,modifyWithHappiness,slowMove);
		}
		if(!citizen.hasBuildingInited) {
			citizen.wantsNightEntertainmentIn = random_Random.getInt(1,5);
			citizen.hasBuildingInited = true;
		}
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.lights.length >= 2) {
			this.lights[0].sprite.position.set(this.position.x + 4,this.position.y + 4);
			this.lights[1].sprite.position.set(this.position.x + 9,this.position.y + 4);
		}
		if(this.lights.length >= 4) {
			this.lights[2].sprite.position.set(this.position.x + random_Random.getInt(2,10),this.position.y + 20 - 1);
			this.lights[3].sprite.position.set(this.position.x + random_Random.getInt(10,19),this.position.y + 20 - 1);
		}
		this.laserStage.position.set(this.position.x,this.position.y);
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
		this.lightsAreOn -= Math.min(1,timeMod);
		if(this.lightsAreOn <= 0 && !(this.workers.length >= 1 && this.workers[0].inPermanent == this && this.workers[0].currentAction == 0)) {
			var _g = 0;
			var _g1 = this.lights;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l.sprite.alpha = 0;
			}
			var _g = 0;
			var _g1 = this.lasers;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				if(l.laserSprite != null) {
					l.laserSprite.destroy();
					l.laserSprite = null;
				}
			}
			return;
		}
		var _g = 0;
		var _g1 = this.lasers;
		while(_g < _g1.length) {
			var laser = _g1[_g];
			++_g;
			laser.end.x += timeMod * laser.speed;
			if(laser.speed > 0) {
				if(laser.end.x > 18) {
					laser.end.x = 18;
					laser.speed = -laser.speed;
				}
			} else if(laser.end.x < (this.get_hasLeftNightClub() ? 1 : 6)) {
				var tmp = this.get_hasLeftNightClub() ? 1 : 6;
				laser.end.x = tmp;
				laser.speed = -laser.speed;
			}
			laser.hue += timeMod * 0.2 * (laser.goBack ? -1 : 1);
			if(laser.hue > 240) {
				laser.goBack = true;
			} else if(laser.hue < 120) {
				laser.goBack = false;
			}
			if(laser.laserSprite == null) {
				laser.laserSprite = new PIXI.Sprite();
				this.laserStage.addChild(laser.laserSprite);
			}
			var val = Math.floor(Math.abs(laser.end.x - laser.start.x));
			var maxVal = this.laserImages.length - 1;
			laser.laserSprite.texture = this.laserImages[val < 0 ? 0 : val > maxVal ? maxVal : val];
			laser.laserSprite.position.y = laser.start.y;
			var this1 = [laser.hue,0.7,1];
			var tmp1 = thx_color_Hsv.toRgb(this1);
			laser.laserSprite.tint = common_ColorExtensions.toHexInt(tmp1);
			if(laser.end.x < laser.start.x) {
				laser.laserSprite.position.set(laser.start.x + 1,laser.start.y);
				laser.laserSprite.scale.x = -1;
			} else {
				laser.laserSprite.position.set(laser.start.x,laser.start.y);
				laser.laserSprite.scale.x = 1;
			}
		}
		var _g = 0;
		var _g1 = this.lights.length;
		while(_g < _g1) {
			var i = _g++;
			var light = this.lights[i];
			if(light.alpha > 0) {
				light.alpha += light.alphaDir * 0.05;
				if(light.alpha > 1.4) {
					light.alpha = 1.4;
					light.alphaDir = -1;
				} else if(light.alpha <= 0) {
					light.alpha = 0;
					light.waiting = random_Random.getInt(i > 1 ? 60 : 20);
					if(i == 2) {
						var tmp = this.position.x;
						var tmp1 = random_Random.getInt(2,10);
						light.sprite.position.x = tmp + tmp1;
					} else if(i == 3) {
						var tmp2 = this.position.x;
						var tmp3 = random_Random.getInt(10,19);
						light.sprite.position.x = tmp2 + tmp3;
					}
				}
				light.sprite.alpha = Math.min(light.alpha,1);
			} else if(light.waiting > 0) {
				light.waiting -= timeMod;
			} else {
				light.waiting = 0;
				light.alpha = 0.01;
				light.alphaDir = 1;
				if(i == 2 || i == 3) {
					var this1 = [random_Random.getInt(180,240),0.9,0.5];
					var tmp4 = thx_color_Hsl.toRgb(this1);
					light.sprite.tint = thx_color_Rgb.toInt(tmp4);
				} else {
					var this11 = [random_Random.getInt(200,300),0.8,0.5];
					var tmp5 = thx_color_Hsl.toRgb(this11);
					light.sprite.tint = thx_color_Rgb.toInt(tmp5);
				}
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_AlienNightClub.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_AlienNightClub
});
