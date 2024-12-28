var buildings_ScrapyardNightClub = $hxClasses["buildings.ScrapyardNightClub"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.isCurrentlyActive = false;
	this.mainTextureOther = 0;
	this.mainTextureLeft = 0;
	this.lightsAreOn = -1;
	this.knownEntertainedCitizenSet = 0;
	this.knownEntertainedCitizen = null;
	this.hadLeftNightClub = false;
	this.nightClubEntertainmentQuantity = 0;
	this.mainTexturesLeft = Resources.getTexturesByWidth("spr_synightclub_lefttextures",20);
	this.mainTextures = Resources.getTexturesByWidth("spr_synightclub_maintextures",20);
	this.secondaryBackgroundSprites = [];
	this.mainTextureLeft = random_Random.getInt(this.mainTexturesLeft.length);
	this.mainTextureOther = random_Random.getInt(this.mainTextures.length);
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.mainSprite = new PIXI.Sprite(this.mainTextures[this.mainTextureOther]);
	this.mainSprite.position.set(position.x,position.y);
	bgStage.addChild(this.mainSprite);
	this.positionSprites();
	this.startTime = Config.limitedVersionForSmoothFilming ? 16 : 20;
	this.endTime = 5.5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_ScrapyardNightClub.__name__ = "buildings.ScrapyardNightClub";
buildings_ScrapyardNightClub.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_ScrapyardNightClub.__super__ = buildings_Work;
buildings_ScrapyardNightClub.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 120 + this.city.upgrades.vars.nightClubEntertainmentQualityBonus;
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
	,get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,get_hasLeftNightClub: function() {
		if(this.leftBuilding != null) {
			return this.leftBuilding.is(buildings_ScrapyardNightClub);
		} else {
			return false;
		}
	}
	,get_hasRightNightClub: function() {
		if(this.rightBuilding != null) {
			return this.rightBuilding.is(buildings_ScrapyardNightClub);
		} else {
			return false;
		}
	}
	,reRegisterSecondaryImages: function() {
		var _g = 0;
		var _g1 = this.secondaryBackgroundSprites;
		while(_g < _g1.length) {
			var spr = _g1[_g];
			++_g;
			spr.destroy();
		}
		this.secondaryBackgroundSprites.splice(0,this.secondaryBackgroundSprites.length);
		if(!this.get_hasLeftNightClub()) {
			switch(this.mainTextureLeft) {
			case 0:
				var sprite0 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
				sprite0.scale.y = 0.8;
				this.secondaryBackgroundSprites.push(sprite0);
				this.bgStage.addChild(sprite0);
				var sprite1 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
				sprite1.scale.y = 0.4;
				this.secondaryBackgroundSprites.push(sprite1);
				this.bgStage.addChild(sprite1);
				var sprite2 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
				sprite2.scale.y = 0.8;
				this.secondaryBackgroundSprites.push(sprite2);
				this.bgStage.addChild(sprite2);
				var sprite3 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
				sprite3.scale.y = 0.5;
				this.secondaryBackgroundSprites.push(sprite3);
				this.bgStage.addChild(sprite3);
				var _g = [];
				_g.push({ sprite : this.secondaryBackgroundSprites[0], blend : 0});
				_g.push({ sprite : this.secondaryBackgroundSprites[1], blend : 72});
				_g.push({ sprite : this.secondaryBackgroundSprites[2], blend : 144});
				_g.push({ sprite : this.secondaryBackgroundSprites[3], blend : 216});
				this.lightColumnData = _g;
				break;
			case 1:
				this.waterfallBaseHue = (this.position.x * 60 + this.position.y * 75) % 360;
				var spr = new PIXI.Sprite(Resources.getTexture("spr_synightclub_waterfalllight"));
				this.secondaryBackgroundSprites.push(spr);
				this.bgStage.addChild(spr);
				var spr = new PIXI.Sprite(Resources.getTexture("spr_synightclub_waterfalllight"));
				this.secondaryBackgroundSprites.push(spr);
				this.bgStage.addChild(spr);
				var spr = new PIXI.Sprite(Resources.getTexture("spr_synightclub_waterfalllight"));
				this.secondaryBackgroundSprites.push(spr);
				this.bgStage.addChild(spr);
				var spr2 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_waterfalllight_last"));
				this.secondaryBackgroundSprites.push(spr2);
				this.bgStage.addChild(spr2);
				break;
			case 2:
				this.lightColumnDataH = [];
				var spr = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights_h"));
				spr.alpha = 0;
				this.bgStage.addChild(spr);
				this.secondaryBackgroundSprites.push(spr);
				this.lightColumnDataH.push({ sprite : spr, blend : 0, targetBlend : random_Random.getFloat(360)});
				var spr = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights_h"));
				spr.alpha = 0;
				this.bgStage.addChild(spr);
				this.secondaryBackgroundSprites.push(spr);
				this.lightColumnDataH.push({ sprite : spr, blend : 120, targetBlend : random_Random.getFloat(360)});
				var spr = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights_h"));
				spr.alpha = 0;
				this.bgStage.addChild(spr);
				this.secondaryBackgroundSprites.push(spr);
				this.lightColumnDataH.push({ sprite : spr, blend : 240, targetBlend : random_Random.getFloat(360)});
				this.secondaryBackgroundSprites[0].scale.x = 1.4;
				this.secondaryBackgroundSprites[1].scale.x = 1.5;
				this.secondaryBackgroundSprites[2].scale.x = 1.2;
				break;
			}
		} else {
			switch(this.mainTextureOther) {
			case 0:
				var sprite0 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
				sprite0.scale.y = 1.1;
				this.secondaryBackgroundSprites.push(sprite0);
				this.bgStage.addChild(sprite0);
				var sprite1 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
				sprite1.scale.y = 1;
				this.secondaryBackgroundSprites.push(sprite1);
				this.bgStage.addChild(sprite1);
				var sprite2 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
				sprite2.scale.y = 1.1;
				this.secondaryBackgroundSprites.push(sprite2);
				this.bgStage.addChild(sprite2);
				var sprite3 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
				sprite3.scale.y = 1.3;
				this.secondaryBackgroundSprites.push(sprite3);
				this.bgStage.addChild(sprite3);
				var sprite4 = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
				sprite4.scale.y = 1;
				this.secondaryBackgroundSprites.push(sprite4);
				this.bgStage.addChild(sprite4);
				var _g = [];
				_g.push({ sprite : this.secondaryBackgroundSprites[0], blend : 0});
				_g.push({ sprite : this.secondaryBackgroundSprites[1], blend : 60});
				_g.push({ sprite : this.secondaryBackgroundSprites[2], blend : 120});
				_g.push({ sprite : this.secondaryBackgroundSprites[3], blend : 180});
				_g.push({ sprite : this.secondaryBackgroundSprites[4], blend : 240});
				this.lightColumnData = _g;
				break;
			case 1:
				this.miniLightData = [];
				var _g = 0;
				while(_g < 9) {
					var i = _g++;
					var spr = new PIXI.Sprite(Resources.getTexture("spr_synightclub_minilight"));
					spr.alpha = 0;
					this.bgStage.addChild(spr);
					this.secondaryBackgroundSprites.push(spr);
					this.miniLightData.push({ waitTime : random_Random.getInt(50), stage : 0, sprite : spr, alpha : 0});
				}
				break;
			case 2:
				this.lightColumnData = [];
				var _g = 0;
				while(_g < 6) {
					var i = _g++;
					var spr = new PIXI.Sprite(Resources.getTexture("spr_synightclub_lights"));
					if(i < 2) {
						spr.scale.y = 1.2;
					} else if(i < 4) {
						spr.scale.y = 0.7;
					}
					spr.alpha = 0;
					this.bgStage.addChild(spr);
					this.secondaryBackgroundSprites.push(spr);
					this.lightColumnData.push({ sprite : spr, blend : i * 120});
				}
				break;
			}
		}
		this.positionSprites();
		this.activateOrDeactivateSprites(this.lightsAreOn >= 0);
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.mainSprite != null) {
			this.mainSprite.position.set(this.position.x,this.position.y);
		}
		if(!this.get_hasLeftNightClub()) {
			switch(this.mainTextureLeft) {
			case 0:
				if(this.secondaryBackgroundSprites != null && this.secondaryBackgroundSprites.length >= 4) {
					this.secondaryBackgroundSprites[0].position.set(this.position.x + 3,this.position.y + 2);
					this.secondaryBackgroundSprites[1].position.set(this.position.x + 7,this.position.y + 4);
					this.secondaryBackgroundSprites[2].position.set(this.position.x + 12,this.position.y + 3);
					this.secondaryBackgroundSprites[3].position.set(this.position.x + 16,this.position.y + 4);
				}
				break;
			case 1:
				if(this.secondaryBackgroundSprites != null && this.secondaryBackgroundSprites.length >= 4) {
					this.secondaryBackgroundSprites[0].position.set(this.position.x + 2,this.position.y + 1);
					this.secondaryBackgroundSprites[1].position.set(this.position.x + 6,this.position.y + 5);
					this.secondaryBackgroundSprites[2].position.set(this.position.x + 10,this.position.y + 9);
					this.secondaryBackgroundSprites[3].position.set(this.position.x + 15,this.position.y + 13);
				}
				break;
			case 2:
				if(this.secondaryBackgroundSprites != null && this.secondaryBackgroundSprites.length >= 3) {
					this.secondaryBackgroundSprites[0].position.set(this.position.x + 4,this.position.y + 3);
					this.secondaryBackgroundSprites[1].position.set(this.position.x + 3,this.position.y + 7);
					this.secondaryBackgroundSprites[2].position.set(this.position.x + 6,this.position.y + 11);
				}
				break;
			}
		} else {
			switch(this.mainTextureOther) {
			case 0:
				if(this.secondaryBackgroundSprites != null && this.secondaryBackgroundSprites.length >= 5) {
					this.secondaryBackgroundSprites[0].position.set(this.position.x + 2,this.position.y + 3);
					this.secondaryBackgroundSprites[1].position.set(this.position.x + 6,this.position.y + 2);
					this.secondaryBackgroundSprites[2].position.set(this.position.x + 10,this.position.y + 3);
					this.secondaryBackgroundSprites[3].position.set(this.position.x + 14,this.position.y + 4);
					this.secondaryBackgroundSprites[4].position.set(this.position.x + 17,this.position.y + 2);
				}
				break;
			case 1:
				if(this.secondaryBackgroundSprites != null && this.secondaryBackgroundSprites.length >= 9) {
					this.secondaryBackgroundSprites[0].position.set(this.position.x - 1 + 3,this.position.y - 1 + 3);
					this.secondaryBackgroundSprites[1].position.set(this.position.x - 1 + 2,this.position.y - 1 + 8);
					this.secondaryBackgroundSprites[2].position.set(this.position.x - 1 + 3,this.position.y - 1 + 14);
					this.secondaryBackgroundSprites[3].position.set(this.position.x - 1 + 9,this.position.y - 1 + 4);
					this.secondaryBackgroundSprites[4].position.set(this.position.x - 1 + 7,this.position.y - 1 + 9);
					this.secondaryBackgroundSprites[5].position.set(this.position.x - 1 + 9,this.position.y - 1 + 14);
					this.secondaryBackgroundSprites[6].position.set(this.position.x - 1 + 14,this.position.y - 1 + 4);
					this.secondaryBackgroundSprites[7].position.set(this.position.x - 1 + 14,this.position.y - 1 + 9);
					this.secondaryBackgroundSprites[8].position.set(this.position.x - 1 + 13,this.position.y - 1 + 14);
				}
				break;
			case 2:
				if(this.secondaryBackgroundSprites != null && this.secondaryBackgroundSprites.length >= 6) {
					this.secondaryBackgroundSprites[0].position.set(this.position.x + 3,this.position.y + 3);
					this.secondaryBackgroundSprites[1].position.set(this.position.x + 4,this.position.y + 3);
					this.secondaryBackgroundSprites[2].position.set(this.position.x + 9,this.position.y + 8);
					this.secondaryBackgroundSprites[3].position.set(this.position.x + 10,this.position.y + 8);
					this.secondaryBackgroundSprites[4].position.set(this.position.x + 15,this.position.y + 5);
					this.secondaryBackgroundSprites[5].position.set(this.position.x + 16,this.position.y + 5);
				}
				break;
			}
		}
	}
	,updateSecondaryImages: function(timeMod) {
		if(!this.get_hasLeftNightClub()) {
			switch(this.mainTextureLeft) {
			case 0:
				var _g = 0;
				var _g1 = this.lightColumnData;
				while(_g < _g1.length) {
					var lc = _g1[_g];
					++_g;
					var this1 = [lc.blend,0.65,1];
					var tmp = thx_color_Hsv.toRgb(this1);
					lc.sprite.tint = common_ColorExtensions.toHexInt(tmp);
					lc.blend = (lc.blend + timeMod) % 360.0;
				}
				break;
			case 1:
				this.waterfallBaseHue += 0.5 * timeMod;
				var offset = 0;
				var _g = 0;
				var _g1 = this.secondaryBackgroundSprites;
				while(_g < _g1.length) {
					var spr = _g1[_g];
					++_g;
					var this1 = [(this.waterfallBaseHue + offset) % 360,0.7,1];
					spr.tint = common_ColorExtensions.toHexInt(thx_color_Hsv.toRgb(this1));
					offset += 25;
				}
				break;
			case 2:
				var _g = 0;
				var _g1 = this.lightColumnDataH;
				while(_g < _g1.length) {
					var lc = _g1[_g];
					++_g;
					var this1 = [lc.blend,0.65,1];
					var tmp = thx_color_Hsv.toRgb(this1);
					lc.sprite.tint = common_ColorExtensions.toHexInt(tmp);
					var diff = lc.targetBlend - lc.blend;
					var sgn = diff > 0 ? 1 : diff < 0 ? -1 : 0;
					lc.blend = (lc.blend + (Math.abs(diff) > 180.0 ? -sgn : sgn) * timeMod + 360.0) % 360.0;
					if(Math.abs(diff) < 2) {
						lc.targetBlend = random_Random.getFloat(360);
					}
				}
				break;
			}
		} else {
			switch(this.mainTextureOther) {
			case 0:
				var _g = 0;
				var _g1 = this.lightColumnData;
				while(_g < _g1.length) {
					var lc = _g1[_g];
					++_g;
					var this1 = [lc.blend,0.65,1];
					var tmp = thx_color_Hsv.toRgb(this1);
					lc.sprite.tint = common_ColorExtensions.toHexInt(tmp);
					lc.blend = (lc.blend + timeMod) % 360.0;
				}
				break;
			case 1:
				var _g = 0;
				var _g1 = this.miniLightData;
				while(_g < _g1.length) {
					var ml = _g1[_g];
					++_g;
					switch(ml.stage) {
					case 0:
						ml.waitTime -= timeMod;
						if(ml.waitTime <= 0) {
							ml.waitTime = 0;
							var this1 = [random_Random.getInt(360),random_Random.getFloat(0.6,0.9),1];
							var tmp = thx_color_Hsv.toRgb(this1);
							ml.sprite.tint = common_ColorExtensions.toHexInt(tmp);
							ml.stage = 1;
						}
						break;
					case 1:
						ml.alpha += 0.1 * timeMod;
						if(ml.alpha >= 1.0) {
							ml.alpha = 1.0;
							ml.stage = 2;
							ml.waitTime = random_Random.getFloat(20,90);
						}
						ml.sprite.alpha = ml.alpha;
						break;
					case 2:
						ml.waitTime -= timeMod;
						if(ml.waitTime <= 0) {
							ml.waitTime = 0;
							ml.stage = 3;
						}
						break;
					case 3:
						ml.alpha -= 0.1 * timeMod;
						if(ml.alpha <= 0.0) {
							ml.alpha = 0.0;
							ml.stage = 0;
							ml.waitTime = random_Random.getFloat(5);
						}
						ml.sprite.alpha = ml.alpha;
						break;
					}
				}
				break;
			case 2:
				var _g = 0;
				while(_g < 6) {
					var i = _g++;
					var lc = this.lightColumnData[i];
					var this1 = [lc.blend,0.75 - i * 0.01,1];
					var tmp = thx_color_Hsv.toRgb(this1);
					lc.sprite.tint = common_ColorExtensions.toHexInt(tmp);
					lc.blend = (lc.blend + timeMod * (i % 2 == 0 ? 1.5 : -1.5) + 360.0) % 360.0;
				}
				break;
			}
		}
	}
	,activateOrDeactivateSprites: function(activate) {
		if(!this.get_hasLeftNightClub() && this.mainTextureLeft == 0 || !this.get_hasLeftNightClub() && this.mainTextureLeft == 1 || !this.get_hasLeftNightClub() && this.mainTextureLeft == 2 || this.get_hasLeftNightClub() && this.mainTextureOther == 0 || this.get_hasLeftNightClub() && this.mainTextureOther == 2) {
			var _g = 0;
			var _g1 = this.secondaryBackgroundSprites;
			while(_g < _g1.length) {
				var spr = _g1[_g];
				++_g;
				spr.alpha = activate ? 1 : 0;
			}
		} else if(this.get_hasLeftNightClub() && this.mainTextureOther == 1) {
			var _g = 0;
			var _g1 = this.miniLightData;
			while(_g < _g1.length) {
				var miniImg = _g1[_g];
				++_g;
				miniImg.sprite.alpha = activate ? 1 : 0;
				if(!activate) {
					miniImg.alpha = 0;
					miniImg.stage = 0;
				}
			}
		}
	}
	,onCityChange: function() {
		if(this.hadLeftNightClub != this.get_hasLeftNightClub()) {
			var tmp = this.get_hasLeftNightClub() ? this.mainTextures[this.mainTextureOther] : this.mainTexturesLeft[this.mainTextureLeft];
			this.mainSprite.texture = tmp;
			this.hadLeftNightClub = this.get_hasLeftNightClub();
			this.reRegisterSecondaryImages();
		}
	}
	,postCreate: function() {
		buildings_Work.prototype.postCreate.call(this);
		var tmp = this.get_hasLeftNightClub() ? this.mainTextures[this.mainTextureOther] : this.mainTexturesLeft[this.mainTextureLeft];
		this.mainSprite.texture = tmp;
		this.hadLeftNightClub = this.get_hasLeftNightClub();
		this.reRegisterSecondaryImages();
		this.positionSprites();
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		this.mainSprite.destroy();
		if(this.secondaryBackgroundSprites != null) {
			var _g = 0;
			var _g1 = this.secondaryBackgroundSprites;
			while(_g < _g1.length) {
				var extraSprite = _g1[_g];
				++_g;
				extraSprite.destroy();
			}
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
	,beEntertained: function(citizen,timeMod) {
		if(this.knownEntertainedCitizen == null) {
			this.knownEntertainedCitizen = citizen;
			this.knownEntertainedCitizenSet = 60;
		} else if(this.knownEntertainedCitizen == citizen) {
			this.knownEntertainedCitizenSet = 60;
		}
		var waitTimeMod = 3;
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
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(xMin,xMax),random_Random.getInt(5 + waitTimeMod,6 + waitTimeMod),null,modifyWithHappiness,false);
		}
		if(!citizen.hasBuildingInited) {
			citizen.wantsNightEntertainmentIn = random_Random.getInt(1,5);
			citizen.hasBuildingInited = true;
		}
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			if(!_gthis.get_hasLeftNightClub()) {
				return _gthis.mainTextureLeft;
			} else {
				return _gthis.mainTextureOther;
			}
		},function(t) {
			var tmp;
			if(_gthis.get_hasLeftNightClub()) {
				_gthis.mainTextureOther = t;
				tmp = _gthis.mainTextures[_gthis.mainTextureOther];
			} else {
				_gthis.mainTextureLeft = t;
				tmp = _gthis.mainTexturesLeft[_gthis.mainTextureLeft];
			}
			_gthis.mainSprite.texture = tmp;
			_gthis.reRegisterSecondaryImages();
		},function() {
			if(!_gthis.get_hasLeftNightClub()) {
				return _gthis.mainTexturesLeft.length;
			} else {
				return _gthis.mainTextures.length;
			}
		},common_Localize.lo("change_machines"));
		buildings_Work.prototype.createWindowAddBottomButtons.call(this);
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
		this.lightsAreOn -= Math.min(1,timeMod);
		var shouldBeActive = this.lightsAreOn > 0 || this.workers.length >= 1 && this.workers[0].inPermanent == this && this.workers[0].currentAction == 0;
		if(shouldBeActive != this.isCurrentlyActive) {
			this.isCurrentlyActive = shouldBeActive;
			this.activateOrDeactivateSprites(this.isCurrentlyActive);
		}
		if(this.isCurrentlyActive) {
			this.updateSecondaryImages(timeMod);
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ScrapyardNightClub.saveDefinition);
		}
		var value = this.mainTextureLeft;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.mainTextureOther;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mainTextureLeft")) {
			this.mainTextureLeft = loadMap.h["mainTextureLeft"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mainTextureOther")) {
			this.mainTextureOther = loadMap.h["mainTextureOther"];
		}
	}
	,__class__: buildings_ScrapyardNightClub
});
