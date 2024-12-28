var buildings_PartyHouse = $hxClasses["buildings.PartyHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.sprite2 = null;
	this.sprite1 = null;
	this.nightClubEntertainmentQuantity = 0;
	this.lightsAreOn = 0;
	buildings_WorkWithHome.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.sprite1 = Resources.makeSprite("spr_partyhouse_light");
	this.sprite2 = Resources.makeSprite("spr_partyhouse_light");
	this.lights = [];
	this.sprite1.position.set(position.x + 4,position.y + 12);
	this.lights.push({ sprite : this.sprite1, waiting : 1, alphaDir : 1});
	bgStage.addChild(this.sprite1);
	this.sprite2.position.set(position.x + 9,position.y + 12);
	this.lights.push({ sprite : this.sprite2, waiting : 1, alphaDir : 1});
	bgStage.addChild(this.sprite2);
	this.sprite1.alpha = 0;
	this.sprite2.alpha = 0;
	this.startTime = 20;
	this.endTime = 5.5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
	this.laserImages = Resources.getTexturesByWidth("spr_partyhouse_laser",18);
	this.laserStage = new PIXI.Container();
	bgStage.addChild(this.laserStage);
	this.laserStage.position.set(position.x,position.y);
	this.lasers = [];
	this.lasers.push({ start : new common_FPoint(1,12), end : new common_FPoint(6,19), hue : 180, speed : 2, targetLaserHue : -1, laserSprite : null});
	this.lasers.push({ start : new common_FPoint(18,12), end : new common_FPoint(6,19), hue : 0, speed : -2, targetLaserHue : -1, laserSprite : null});
};
buildings_PartyHouse.__name__ = "buildings.PartyHouse";
buildings_PartyHouse.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_PartyHouse.__super__ = buildings_WorkWithHome;
buildings_PartyHouse.prototype = $extend(buildings_WorkWithHome.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,get_hasLeftNightClub: function() {
		if(this.leftBuilding != null) {
			return this.leftBuilding.is(buildings_PartyHouse);
		} else {
			return false;
		}
	}
	,get_hasRightNightClub: function() {
		if(this.rightBuilding != null) {
			return this.rightBuilding.is(buildings_PartyHouse);
		} else {
			return false;
		}
	}
	,get_baseEntertainmentCapacity: function() {
		return this.workers.length * (60 + this.nightClubEntertainmentQuantity) + this.city.upgrades.vars.nightClubEntertainmentQualityBonus;
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
		return [buildingUpgrades_BetterCouches,buildingUpgrades_EnhancedAudio];
	}
	,positionSprites: function() {
		buildings_WorkWithHome.prototype.positionSprites.call(this);
		if(this.lights.length >= 2) {
			this.lights[0].sprite.position.set(this.position.x + 4,this.position.y + 12);
			this.lights[1].sprite.position.set(this.position.x + 9,this.position.y + 12);
		}
		this.laserStage.position.set(this.position.x,this.position.y);
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
		buildings_WorkWithHome.prototype.destroy.call(this);
	}
	,update: function(timeMod) {
		buildings_WorkWithHome.prototype.update.call(this,timeMod);
		this.lightsAreOn -= Math.min(1,timeMod);
		if(this.lightsAreOn <= 0 && !(this.workers.length >= 1 && this.workers[0].inPermanent == this && this.workers[0].currentAction == 0)) {
			this.sprite1.alpha = Math.max(0,this.sprite1.alpha - 0.1 * timeMod);
			this.sprite2.alpha = Math.max(0,this.sprite2.alpha - 0.1 * timeMod);
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
			laser.end.x += timeMod * laser.speed * random_Random.getFloat(1,1.02);
			if(laser.speed > 0) {
				if(laser.end.x > 17) {
					laser.end.x = 17;
					laser.speed = -laser.speed;
				}
			} else if(laser.end.x < (this.get_hasLeftNightClub() ? 1 : 6)) {
				var tmp = this.get_hasLeftNightClub() ? 1 : 6;
				laser.end.x = tmp;
				laser.speed = -laser.speed;
			}
			laser.hue += timeMod;
			if(laser.hue > 360) {
				laser.hue -= 360;
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
		var _g1 = this.lights;
		while(_g < _g1.length) {
			var light = _g1[_g];
			++_g;
			if(light.sprite.alpha > 0) {
				light.sprite.alpha += light.alphaDir * 0.05;
				if(light.sprite.alpha > 1) {
					light.sprite.alpha = 1;
					light.alphaDir = -1;
				} else if(light.sprite.alpha <= 0) {
					light.sprite.alpha = 0;
					light.waiting = random_Random.getInt(25);
				}
			} else if(light.waiting > 0) {
				light.waiting -= timeMod;
			} else {
				light.waiting = 0;
				light.sprite.alpha = 0.01;
				light.alphaDir = 1;
				var this1 = [random_Random.getInt(360),0.8,0.5];
				var tmp = thx_color_Hsl.toRgb(this1);
				light.sprite.tint = thx_color_Rgb.toInt(tmp);
			}
		}
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(4);
		if(r == 0 && stepsInBuilding > 120) {
			citizen.changeFloorAndWaitRandom(20,40);
		} else if(citizen.relativeY < 2) {
			var xMin = this.get_hasLeftNightClub() ? 0 : 5;
			var xMax = this.get_hasRightNightClub() ? 19 : 17;
			var timeMin = this.lightsAreOn > 0 ? 5 : 20;
			var timeMax = this.lightsAreOn > 0 ? 6 : 30;
			var modifyWithHappiness = false;
			var slowMove = false;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(xMin,xMax),random_Random.getInt(timeMin,timeMax),null,modifyWithHappiness,slowMove);
		} else {
			var r2 = random_Random.getInt(3);
			if(r2 == 0) {
				citizen.moveAndWait(5,random_Random.getInt(30,60));
			} else if(r2 == 1) {
				citizen.moveAndWait(10,random_Random.getInt(30,60));
			} else {
				citizen.moveAndWait(14,random_Random.getInt(30,60));
			}
		}
	}
	,beEntertained: function(citizen,timeMod) {
		var goTo = random_Random.getInt(2 + (this.get_hasLeftNightClub() ? 1 : 0) + (this.get_hasRightNightClub() ? 1 : 0));
		if(this.get_hasLeftNightClub() && goTo == 0 && this.leftBuilding.get_isOpen()) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[6].length > 0 ? pool[6].splice(pool[6].length - 1,1)[0] : new Int32Array(6);
			arr[0] = 2;
			arr[1] = 0;
			arr[2] = 4;
			arr[3] = random_Random.getInt(5,19);
			arr[4] = 8;
			arr[5] = random_Random.getInt(5,6);
			citizen.setPath(arr,0,6,true);
		} else if(this.get_hasRightNightClub() && goTo == 1 && this.rightBuilding.get_isOpen()) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[6].length > 0 ? pool[6].splice(pool[6].length - 1,1)[0] : new Int32Array(6);
			arr[0] = 3;
			arr[1] = 0;
			arr[2] = 4;
			arr[3] = random_Random.getInt(0,17);
			arr[4] = 8;
			arr[5] = random_Random.getInt(5,6);
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
			citizen.moveAndWait(random_Random.getInt(xMin,xMax),random_Random.getInt(5,6),null,modifyWithHappiness,slowMove);
		}
		if(!citizen.hasBuildingInited) {
			citizen.wantsNightEntertainmentIn = random_Random.getInt(1,5);
			citizen.hasBuildingInited = true;
		}
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
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_WorkWithHome.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_PartyHouse.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_WorkWithHome.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_PartyHouse
});
