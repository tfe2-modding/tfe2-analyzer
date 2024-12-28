var buildings_NightClub = $hxClasses["buildings.NightClub"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.knownEntertainedCitizenSet = 0;
	this.knownEntertainedCitizen = null;
	this.nightClubColor = 0;
	this.nightClubEntertainmentQuantity = 0;
	this.laserImages = Resources.getTexturesByWidth("spr_nightclub_laser",18);
	this.lights = [];
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	var light = new PIXI.Sprite(Resources.getTexture("spr_nightclub_light"));
	bgStage.addChild(light);
	this.lights.push({ sprite : light, color : 0, alpha : 0, waiting : 1, alphaDir : 1});
	light.alpha = 0.8;
	var this1 = [150,1,0.5];
	light.tint = thx_color_Rgb.toInt(thx_color_Hsl.toRgb(this1));
	var light = new PIXI.Sprite(Resources.getTexture("spr_nightclub_light"));
	bgStage.addChild(light);
	this.lights.push({ sprite : light, color : 0, alpha : 0, waiting : 1, alphaDir : 1});
	light.alpha = 0.8;
	var this1 = [150,1,0.5];
	light.tint = thx_color_Rgb.toInt(thx_color_Hsl.toRgb(this1));
	this.laserStage = new PIXI.Container();
	bgStage.addChild(this.laserStage);
	this.laserStage.position.set(position.x,position.y);
	this.lasers = [];
	this.lasers.push({ start : new common_FPoint(2,3), end : new common_FPoint(6,18), hue : 180, speed : 1, targetLaserHue : -1, laserSprite : null});
	this.lasers.push({ start : new common_FPoint(17,3), end : new common_FPoint(6,18), hue : 0, speed : -1, targetLaserHue : -1, laserSprite : null});
	this.positionSprites();
	this.startTime = Config.limitedVersionForSmoothFilming ? 16 : 20;
	this.endTime = 5.5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
	this.lightsAreOn = -1;
};
buildings_NightClub.__name__ = "buildings.NightClub";
buildings_NightClub.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_NightClub.__super__ = buildings_Work;
buildings_NightClub.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * (40 + this.nightClubEntertainmentQuantity) + this.city.upgrades.vars.nightClubEntertainmentQualityBonus;
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
		return [buildingUpgrades_BetterLightShow];
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,get_hasLeftNightClub: function() {
		if(this.leftBuilding != null) {
			return this.leftBuilding.is(buildings_NightClub);
		} else {
			return false;
		}
	}
	,get_hasRightNightClub: function() {
		if(this.rightBuilding != null) {
			return this.rightBuilding.is(buildings_NightClub);
		} else {
			return false;
		}
	}
	,postLoad: function() {
		var _g = 0;
		var _g1 = this.lights;
		while(_g < _g1.length) {
			var light = _g1[_g];
			++_g;
			if(this.nightClubColor == 3) {
				light.sprite.texture = Resources.getTexture("spr_nightclub_light_rainbow");
			}
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
		if(this.knownEntertainedCitizen == null) {
			this.knownEntertainedCitizen = citizen;
			this.knownEntertainedCitizenSet = 60;
		} else if(this.knownEntertainedCitizen == citizen) {
			this.knownEntertainedCitizenSet = 60;
		}
		var waitTimeMod;
		switch(this.nightClubColor) {
		case 1:
			waitTimeMod = -3;
			break;
		case 2:
			waitTimeMod = 3;
			break;
		case 4:
			waitTimeMod = 3;
			break;
		default:
			waitTimeMod = 0;
		}
		var goTo = random_Random.getInt(2 + (this.get_hasLeftNightClub() ? 1 : 0) + (this.get_hasRightNightClub() ? 1 : 0));
		var canGoLR = this.nightClubColor != 4 || this.knownEntertainedCitizen != citizen;
		if(this.get_hasLeftNightClub() && canGoLR && goTo == 0 && this.leftBuilding.get_isOpen()) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[6].length > 0 ? pool[6].splice(pool[6].length - 1,1)[0] : new Int32Array(6);
			arr[0] = 2;
			arr[1] = 0;
			arr[2] = 4;
			arr[3] = random_Random.getInt(5,19);
			arr[4] = 8;
			arr[5] = random_Random.getInt(5,6);
			citizen.setPath(arr,0,6,true);
		} else if(this.get_hasRightNightClub() && canGoLR && goTo == 1 && this.rightBuilding.get_isOpen()) {
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
			var slowMove = this.nightClubColor == 2 || this.nightClubColor == 4;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(xMin,xMax),random_Random.getInt(5 + waitTimeMod,6 + waitTimeMod),null,modifyWithHappiness,slowMove);
		}
		if(!citizen.hasBuildingInited) {
			citizen.wantsNightEntertainmentIn = random_Random.getInt(1,5);
			citizen.hasBuildingInited = true;
		}
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.lights.length >= 2) {
			this.lights[0].sprite.position.set(this.position.x + 5,this.position.y + 4);
			this.lights[1].sprite.position.set(this.position.x + 10,this.position.y + 4);
		}
		this.laserStage.position.set(this.position.x,this.position.y);
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		if(Settings.hasSecretCode("nightClubColors")) {
			var cycleButton = gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.nightClubColor;
			},function(t) {
				_gthis.nightClubColor = t;
				if(_gthis.nightClubColor == 0) {
					_gthis.lasers[0].hue = 0;
					_gthis.lasers[1].hue = 180;
					if(_gthis.lasers.length >= 4) {
						_gthis.lasers[2].hue = 90;
						_gthis.lasers[3].hue = 270;
					}
				}
				var _g = 0;
				var _g1 = _gthis.lasers;
				while(_g < _g1.length) {
					var laser = _g1[_g];
					++_g;
					laser.targetLaserHue = -1;
				}
				var _g = 0;
				var _g1 = _gthis.lights;
				while(_g < _g1.length) {
					var light = _g1[_g];
					++_g;
					if(_gthis.nightClubColor == 3) {
						light.sprite.texture = Resources.getTexture("spr_nightclub_light_rainbow");
					} else {
						light.sprite.texture = Resources.getTexture("spr_nightclub_light");
					}
				}
			},function() {
				return 5;
			},null,function() {
				var cycleButton = common_Localize.lo("change_light_show") + " (";
				var cycleButton1;
				switch(_gthis.nightClubColor) {
				case 0:
					cycleButton1 = common_Localize.lo("colorful");
					break;
				case 1:
					cycleButton1 = common_Localize.lo("fast_red");
					break;
				case 2:
					cycleButton1 = common_Localize.lo("slow_blue");
					break;
				case 3:
					cycleButton1 = common_Localize.lo("rainbow_light");
					break;
				case 4:
					cycleButton1 = common_Localize.lo("romantic_pink");
					break;
				default:
					cycleButton1 = "";
				}
				return cycleButton + cycleButton1 + ")";
			});
		}
		buildings_Work.prototype.createWindowAddBottomButtons.call(this);
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
			if(this.nightClubColor == 4 && this.workers.length > 0 && this.workers[0].inPermanent == this && this.get_hasLeftNightClub()) {
				if(this.knownEntertainedCitizenSet >= 0) {
					if(this.knownEntertainedCitizen != null && this.knownEntertainedCitizen.inPermanent == this && !this.knownEntertainedCitizen.hasDied) {
						laser.end.x = this.knownEntertainedCitizen.relativeX;
					}
				} else {
					laser.end.x = this.workers[0].relativeX;
				}
			} else {
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
			}
			switch(this.nightClubColor) {
			case 0:
				laser.hue += timeMod;
				if(laser.hue > 360) {
					laser.hue -= 360;
				}
				break;
			case 1:
				laser.hue = 0;
				break;
			case 2:
				if(laser.targetLaserHue == -1 || Math.abs(laser.hue - laser.targetLaserHue) < timeMod / 2) {
					laser.targetLaserHue = random_Random.getInt(170,245);
				}
				var spd = 1;
				if(laser.hue > 245 || laser.hue < 170) {
					spd = 12;
				}
				var num = laser.targetLaserHue - laser.hue;
				laser.hue += (num > 0 ? 1 : num < 0 ? -1 : 0) * 0.5 * timeMod * spd;
				break;
			case 3:
				if(laser.targetLaserHue == -1 || Math.abs(laser.hue - laser.targetLaserHue) < timeMod) {
					laser.targetLaserHue = random_Random.getInt(360);
				}
				var num1 = laser.targetLaserHue - laser.hue;
				laser.hue += (num1 > 0 ? 1 : num1 < 0 ? -1 : 0) * timeMod;
				break;
			case 4:
				if(laser.targetLaserHue == -1 || Math.abs(laser.hue - laser.targetLaserHue) < timeMod / 2) {
					laser.targetLaserHue = random_Random.getInt(270,330);
				}
				var spd1 = 1;
				if(laser.hue > 330 || laser.hue < 270) {
					spd1 = 12;
				}
				var num2 = laser.targetLaserHue - laser.hue;
				laser.hue += (num2 > 0 ? 1 : num2 < 0 ? -1 : 0) * 0.5 * timeMod * spd1;
				break;
			}
			if(random_Random.getInt(20) == 0) {
				switch(this.nightClubColor) {
				case 1:
					var num3 = laser.speed;
					laser.speed = (num3 > 0 ? 1 : num3 < 0 ? -1 : 0) * random_Random.getFloat(1,2);
					break;
				case 2:
					var num4 = laser.speed;
					laser.speed = (num4 > 0 ? 1 : num4 < 0 ? -1 : 0) * random_Random.getFloat(0.5,0.8);
					break;
				case 4:
					var num5 = laser.speed;
					laser.speed = (num5 > 0 ? 1 : num5 < 0 ? -1 : 0) * random_Random.getFloat(0.5,0.8);
					break;
				default:
					var num6 = laser.speed;
					laser.speed = (num6 > 0 ? 1 : num6 < 0 ? -1 : 0) * random_Random.getFloat(0.5,1.5);
				}
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
			if(light.alpha > 0) {
				light.alpha += light.alphaDir * 0.1 * (this.nightClubColor == 4 ? 0.25 : 1);
				if(light.alpha > 1) {
					light.alpha = 1;
					light.alphaDir = -1;
				} else if(light.alpha <= 0) {
					light.alpha = 0;
					if(this.nightClubColor == 1 || this.nightClubColor == 3) {
						light.waiting = random_Random.getInt(30);
					} else {
						light.waiting = random_Random.getInt(60);
					}
				}
				light.sprite.alpha = light.alpha;
			} else if(light.waiting > 0) {
				light.waiting -= timeMod;
			} else {
				light.waiting = 0;
				light.alpha = 0.01;
				light.alphaDir = 1;
				switch(this.nightClubColor) {
				case 0:
					var this1 = [random_Random.getInt(360),0.8,0.5];
					var tmp = thx_color_Hsl.toRgb(this1);
					light.sprite.tint = thx_color_Rgb.toInt(tmp);
					break;
				case 1:
					var this11 = [random_Random.getInt(60),0.8,0.6];
					var tmp1 = thx_color_Hsl.toRgb(this11);
					light.sprite.tint = thx_color_Rgb.toInt(tmp1);
					break;
				case 2:
					var this12 = [random_Random.getInt(170,245),0.8,0.7];
					var tmp2 = thx_color_Hsl.toRgb(this12);
					light.sprite.tint = thx_color_Rgb.toInt(tmp2);
					break;
				case 3:
					light.sprite.tint = 16777215;
					break;
				case 4:
					var this13 = [random_Random.getInt(270,330),0.8,0.7];
					var tmp3 = thx_color_Hsl.toRgb(this13);
					light.sprite.tint = thx_color_Rgb.toInt(tmp3);
					break;
				}
			}
		}
		if(this.knownEntertainedCitizenSet >= 0) {
			this.knownEntertainedCitizenSet -= timeMod;
			if(this.knownEntertainedCitizenSet < 0) {
				this.knownEntertainedCitizen = null;
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_NightClub.saveDefinition);
		}
		var value = this.nightClubColor;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(queue.version < 15) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"nightClubColor")) {
			this.nightClubColor = loadMap.h["nightClubColor"];
		}
		this.postLoad();
	}
	,__class__: buildings_NightClub
});
