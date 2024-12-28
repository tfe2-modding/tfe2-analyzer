var buildings_HoloGameHall = $hxClasses["buildings.HoloGameHall"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.boostTeam2 = 0;
	this.boostTeam1 = 0;
	this.progressTeam2 = 0;
	this.progressTeam1 = 0;
	this.hasAtLeastOneVisitor = false;
	this.totalWidth = 18;
	this.coordinatorBuilding = null;
	this.gameInited = false;
	this.boosters = [];
	this.monsterSpriteTeam2 = null;
	this.monsterSpriteTeam1 = null;
	this.currentGameType = null;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.isEntertainment = true;
	this.currentGameType = 0;
	if(buildings_HoloGameHall.citizenClothesTexture == null) {
		buildings_HoloGameHall.citizenClothesTexture = Resources.getTexture("spr_hgh_citizenclothes_1");
	}
	var _g = [];
	_g.push([]);
	_g.push([]);
	_g.push([]);
	_g.push([]);
	_g.push([]);
	this.blocks = _g;
};
buildings_HoloGameHall.__name__ = "buildings.HoloGameHall";
buildings_HoloGameHall.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_HoloGameHall.__super__ = Building;
buildings_HoloGameHall.prototype = $extend(Building.prototype,{
	get_baseEntertainmentCapacity: function() {
		return 75;
	}
	,get_isOpen: function() {
		var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
		if(!(this1 >= 12)) {
			return this1 < 2;
		} else {
			return true;
		}
	}
	,get_entertainmentType: function() {
		return 4;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 4;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 5;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 2;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 5;
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
	,get_hasLeftHoloGameHall: function() {
		if(this.leftBuilding != null) {
			return this.leftBuilding.is(buildings_HoloGameHall);
		} else {
			return false;
		}
	}
	,get_hasRightHoloGameHall: function() {
		if(this.rightBuilding != null) {
			return this.rightBuilding.is(buildings_HoloGameHall);
		} else {
			return false;
		}
	}
	,postCreate: function() {
		Building.prototype.postCreate.call(this);
		this.positionSprites();
		this.calculateCoordinatorBuilding();
		this.setGameType();
	}
	,onCityChange: function() {
		this.calculateCoordinatorBuilding();
		if(!this.get_hasRightHoloGameHall()) {
			var _g = 0;
			var _g1 = this.blocks[4];
			while(_g < _g1.length) {
				var block = _g1[_g];
				++_g;
				block.sprite.destroy();
			}
			this.blocks[4] = [];
		}
	}
	,calculateCoordinatorBuilding: function() {
		var prevCoordinatorBuilding = this.coordinatorBuilding;
		this.coordinatorBuilding = this;
		while(this.coordinatorBuilding.get_hasLeftHoloGameHall()) this.coordinatorBuilding = this.coordinatorBuilding.leftBuilding;
		if(this.coordinatorBuilding == this) {
			this.totalWidth = 18;
			var currentlyHandling = this;
			while(currentlyHandling.get_hasRightHoloGameHall()) {
				this.totalWidth += 20;
				currentlyHandling = currentlyHandling.rightBuilding;
			}
			if(prevCoordinatorBuilding != this) {
				this.resetSpaceShipGame();
			}
		}
		if(!this.get_hasLeftHoloGameHall() && !this.get_hasRightHoloGameHall() && this.currentGameType == 0) {
			this.currentGameType = 1;
			this.destroyHGHSprites();
			this.boosters = [];
		}
		if(this.currentGameType != this.coordinatorBuilding.currentGameType) {
			this.destroyHGHSprites();
			this.currentGameType = this.coordinatorBuilding.currentGameType;
		} else if(prevCoordinatorBuilding != this.coordinatorBuilding && this.coordinatorBuilding != this && this.currentGameType == 0) {
			this.destroyHGHSprites();
		}
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		this.destroyHGHSprites();
	}
	,destroyHGHSprites: function() {
		if(this.monsterSpriteTeam1 != null) {
			this.monsterSpriteTeam1.destroy();
			this.monsterSpriteTeam1 = null;
		}
		if(this.monsterSpriteTeam2 != null) {
			this.monsterSpriteTeam2.destroy();
			this.monsterSpriteTeam2 = null;
		}
		var _g = 0;
		var _g1 = this.boosters;
		while(_g < _g1.length) {
			var booster = _g1[_g];
			++_g;
			if(booster.sprite != null) {
				booster.sprite.destroy();
			}
		}
		this.boosters = [];
		var _g = 0;
		var _g1 = this.blocks;
		while(_g < _g1.length) {
			var theseBlocks = _g1[_g];
			++_g;
			var _g2 = 0;
			while(_g2 < theseBlocks.length) {
				var block = theseBlocks[_g2];
				++_g2;
				block.sprite.destroy();
			}
		}
		var _g = [];
		_g.push([]);
		_g.push([]);
		_g.push([]);
		_g.push([]);
		_g.push([]);
		this.blocks = _g;
	}
	,beEntertained: function(citizen,timeMod) {
		switch(this.coordinatorBuilding.currentGameType) {
		case 0:
			this.beEntertainedSpaceShipBattle(citizen,timeMod);
			break;
		case 1:
			this.beEntertainedBlockGame(citizen,timeMod);
			break;
		}
		this.currentGameType = this.coordinatorBuilding.currentGameType;
	}
	,beEntertainedBlockGame: function(citizen,timeMod) {
		var _gthis = this;
		var xToGo = random_Random.getInt(4 + (this.get_hasRightHoloGameHall() ? 1 : 0));
		var r = random_Random.getInt(6);
		if(this.get_hasLeftHoloGameHall() && r == 0) {
			var citizen1 = citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
			arr[0] = 2;
			arr[1] = 0;
			arr[2] = 4;
			arr[3] = 19;
			citizen1.setPathWithEnd(arr,0,4,function() {
				citizen.hasBuildingInited = true;
			},true);
		} else if(this.get_hasRightHoloGameHall() && r == 1) {
			var citizen1 = citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
			arr[0] = 3;
			arr[1] = 0;
			arr[2] = 4;
			arr[3] = 0;
			citizen1.setPathWithEnd(arr,0,4,function() {
				citizen.hasBuildingInited = true;
			},true);
		} else {
			citizen.moveAndWait(3 + xToGo * 4,random_Random.getInt(45,90),function() {
				if(_gthis.coordinatorBuilding.currentGameType != 1 || xToGo == 4 && !_gthis.get_hasRightHoloGameHall()) {
					return;
				}
				if(_gthis.blocks[xToGo].length == 0 || _gthis.blocks[xToGo][_gthis.blocks[xToGo].length - 1].sprite.alpha >= 1) {
					if(_gthis.blocks[xToGo].length < 4) {
						_gthis.gameInited = true;
						var newBlockSprite = new PIXI.Sprite(Resources.getTexture("spr_hgh_block"));
						_gthis.bgStage.addChild(newBlockSprite);
						var this1 = [random_Random.getFloat(360),1,1];
						var col = this1;
						_gthis.blocks[xToGo].push({ sprite : newBlockSprite, color : col});
						newBlockSprite.alpha = 0.1;
						newBlockSprite.tint = common_ColorExtensions.toHexInt(thx_color_Hsv.toRgb(col));
						newBlockSprite.position.set(_gthis.position.x + 2 + xToGo * 4,_gthis.position.y + 20 - 1 - 4 * _gthis.blocks[xToGo].length);
					} else {
						var blockToChange = random_Random.fromArray(_gthis.blocks[xToGo]);
						var this1 = [(blockToChange.color[0] + 5) % 360,1,1];
						blockToChange.color = this1;
						var tmp = thx_color_Hsv.toRgb(blockToChange.color);
						blockToChange.sprite.tint = common_ColorExtensions.toHexInt(tmp);
					}
				} else {
					var lastBlock = _gthis.blocks[xToGo][_gthis.blocks[xToGo].length - 1].sprite;
					lastBlock.alpha = Math.min(lastBlock.alpha + 0.1,1);
				}
			});
		}
	}
	,beEntertainedSpaceShipBattle: function(citizen,timeMod) {
		if(!citizen.hasBuildingInited || citizen.dynamicUnsavedVars.buildingInited == null) {
			citizen.dynamicUnsavedVars.hghTeam = random_Random.getInt(2);
			citizen.dynamicUnsavedVars.hghStarted = false;
			citizen.hasBuildingInited = true;
			citizen.dynamicUnsavedVars.focussingOnBoosters = random_Random.fromArray([false,false,true]);
			citizen.dynamicUnsavedVars.focussingOnBooster = random_Random.getInt(2);
			citizen.dynamicUnsavedVars.buildingInited = true;
		}
		if(!citizen.dynamicUnsavedVars.hghStarted) {
			var pleaseInit = false;
			if(citizen.dynamicUnsavedVars.hghTeam == 0) {
				if(this.get_hasLeftHoloGameHall()) {
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
					arr[0] = 2;
					arr[1] = 0;
					arr[2] = 4;
					arr[3] = random_Random.getInt(1,19);
					citizen1.setPathWithEnd(arr,0,4,function() {
						citizen.hasBuildingInited = true;
					},true);
				} else if(citizen.relativeX > 1) {
					citizen.setRelativeX(Math.max(1,citizen.relativeX - timeMod));
				} else {
					citizen.setRelativeX(1);
					pleaseInit = true;
				}
			} else if(this.get_hasRightHoloGameHall()) {
				var citizen1 = citizen;
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
				arr[0] = 3;
				arr[1] = 0;
				arr[2] = 4;
				arr[3] = random_Random.getInt(0,17);
				citizen1.setPathWithEnd(arr,0,4,function() {
					citizen.hasBuildingInited = true;
				},true);
			} else if(citizen.relativeX < 17) {
				citizen.setRelativeX(Math.min(17,citizen.relativeX + timeMod));
			} else {
				citizen.setRelativeX(17);
				pleaseInit = true;
			}
			if(pleaseInit) {
				citizen.dynamicUnsavedVars.hghStarted = true;
				this.coordinatorBuilding.hasAtLeastOneVisitor = true;
				if(citizen.accessorySprite == null) {
					citizen.accessorySprite = new PIXI.Sprite(buildings_HoloGameHall.citizenClothesTexture);
					citizen.accessorySprite.anchor.set(0,1);
					citizen.accessorySprite.alpha = 0.5;
					if(citizen.actualSpriteHeight == 4) {
						citizen.accessorySprite.position.set(0,1);
					}
					citizen.sprite.addChild(citizen.accessorySprite);
					citizen.addToWithAccessoryStage();
					if(citizen.dynamicUnsavedVars.hghTeam == 0) {
						citizen.accessorySprite.tint = 16711680;
					} else {
						citizen.accessorySprite.tint = 255;
					}
				}
			}
		} else {
			var totalRemWidth = this.coordinatorBuilding.totalWidth - buildings_HoloGameHall.monsterSize * 2;
			var theBoosters = this.coordinatorBuilding.boosters;
			if(!citizen.dynamicUnsavedVars.focussingOnBoosters && theBoosters.length > 0 && random_Random.getFloat(90) < timeMod) {
				citizen.dynamicUnsavedVars.focussingOnBoosters = true;
				citizen.dynamicUnsavedVars.focussingOnBooster = random_Random.getInt(theBoosters.length);
			}
			if(citizen.dynamicUnsavedVars.focussingOnBoosters) {
				if(theBoosters.length <= citizen.dynamicUnsavedVars.focussingOnBooster) {
					citizen.dynamicUnsavedVars.focussingOnBoosters = false;
				} else {
					var thisBooster = theBoosters[citizen.dynamicUnsavedVars.focussingOnBooster];
					var thisBoosterPos = this.coordinatorBuilding.position.x + thisBooster.xPos;
					if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).position.x + citizen.relativeX > thisBoosterPos && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).position.x + citizen.relativeX < thisBoosterPos + buildings_HoloGameHall.boosterSpriteSize) {
						if(citizen.dynamicUnsavedVars.hghTeam == 0) {
							thisBooster.team1Ownership++;
						} else {
							thisBooster.team2Ownership++;
						}
						if(random_Random.getFloat(40) < timeMod) {
							citizen.dynamicUnsavedVars.focussingOnBoosters = false;
						}
					} else {
						citizen.moveTowardsRandomInWorldCoords(thisBoosterPos,thisBoosterPos + buildings_HoloGameHall.boosterSpriteSize - 1,function() {
							citizen.hasBuildingInited = true;
						});
					}
				}
			}
			if(!citizen.dynamicUnsavedVars.focussingOnBoosters) {
				if(citizen.dynamicUnsavedVars.hghTeam == 0) {
					var currentTeam1Pos = this.coordinatorBuilding.position.x + 1 + Math.floor(this.coordinatorBuilding.progressTeam1 * totalRemWidth);
					if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).position.x + citizen.relativeX > currentTeam1Pos && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).position.x + citizen.relativeX < currentTeam1Pos + buildings_HoloGameHall.monsterSize - 1 && random_Random.getFloat(30) > timeMod) {
						this.coordinatorBuilding.progressTeam1 = Math.min(this.coordinatorBuilding.progressTeam1 + timeMod / (totalRemWidth * (10 + (20 - this.boostTeam1) * this.coordinatorBuilding.progressTeam1)),1);
						if(this.coordinatorBuilding.progressTeam1 + this.coordinatorBuilding.progressTeam2 > 1) {
							this.coordinatorBuilding.progressTeam2 = 1 - this.coordinatorBuilding.progressTeam1;
						}
					} else {
						citizen.moveTowardsRandomInWorldCoords(currentTeam1Pos,currentTeam1Pos + buildings_HoloGameHall.monsterSize - 1,function() {
							citizen.hasBuildingInited = true;
						});
					}
				} else {
					var currentTeam2Pos = this.coordinatorBuilding.position.x + this.coordinatorBuilding.totalWidth - buildings_HoloGameHall.monsterSize + 1 - Math.floor(this.coordinatorBuilding.progressTeam2 * totalRemWidth);
					if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).position.x + citizen.relativeX > currentTeam2Pos && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).position.x + citizen.relativeX < currentTeam2Pos + buildings_HoloGameHall.monsterSize - 1 && random_Random.getFloat(30) > timeMod) {
						this.coordinatorBuilding.progressTeam2 = Math.min(this.coordinatorBuilding.progressTeam2 + timeMod / (totalRemWidth * (10 + (20 - this.boostTeam2) * this.coordinatorBuilding.progressTeam2)),1);
						if(this.coordinatorBuilding.progressTeam1 + this.coordinatorBuilding.progressTeam2 > 1) {
							this.coordinatorBuilding.progressTeam1 = 1 - this.coordinatorBuilding.progressTeam2;
						}
					} else {
						citizen.moveTowardsRandomInWorldCoords(currentTeam2Pos,currentTeam2Pos + buildings_HoloGameHall.monsterSize - 1,function() {
							citizen.hasBuildingInited = true;
						});
					}
				}
			}
		}
	}
	,onCitizenLeave: function(citizen,newPermanent) {
		if(newPermanent == null || !newPermanent.is(buildings_HoloGameHall)) {
			if(citizen.accessorySprite != null) {
				citizen.accessorySprite.destroy();
				citizen.accessorySprite = null;
				citizen.addToCorrectStage();
			}
		}
	}
	,positionSprites: function() {
		Building.prototype.positionSprites.call(this);
		if(this.coordinatorBuilding == this) {
			this.positionHGHSprites();
		}
	}
	,createWindowAddBottomButtons: function() {
		Building.prototype.createWindowAddBottomButtons.call(this);
	}
	,update: function(timeMod) {
		Building.prototype.update.call(this,timeMod);
		switch(this.currentGameType) {
		case 0:
			this.updateSpaceShipGame(timeMod);
			break;
		case 1:
			this.updateBlockGame(timeMod);
			break;
		}
	}
	,updateBlockGame: function(timeMod) {
		if(!this.get_isOpen()) {
			if(this.gameInited && this.city.simulation.time.timeSinceStart / 60 % 24 > 4) {
				this.destroyHGHSprites();
				this.gameInited = false;
				if(this.coordinatorBuilding == this) {
					this.setGameType();
				}
			}
		}
	}
	,updateSpaceShipGame: function(timeMod) {
		if(this.coordinatorBuilding == this) {
			if(!this.get_isOpen()) {
				if(this.gameInited) {
					this.stopSpaceShipGame();
				}
			} else if(this.hasAtLeastOneVisitor) {
				this.gameInited = true;
				this.boostTeam1 = 0;
				this.boostTeam2 = 0;
				if(this.monsterSpriteTeam1 == null) {
					this.monsterSpriteTeam1 = new PIXI.Sprite(Resources.getTexture("spr_hgh_monster_1"));
					this.monsterSpriteTeam1.tint = 16711680;
					this.bgStage.addChild(this.monsterSpriteTeam1);
				}
				if(this.monsterSpriteTeam2 == null) {
					this.monsterSpriteTeam2 = new PIXI.Sprite(Resources.getTexture("spr_hgh_monster_1"));
					this.monsterSpriteTeam2.scale.set(-1,1);
					this.monsterSpriteTeam2.tint = 255;
					this.bgStage.addChild(this.monsterSpriteTeam2);
				}
				var i = this.boosters.length;
				while(--i >= 0) {
					var booster = this.boosters[i];
					if(booster.xPos > this.totalWidth - buildings_HoloGameHall.boosterSpriteSize) {
						booster.sprite.destroy();
						this.boosters.splice(i,1);
						continue;
					}
					booster.age += timeMod;
					if(booster.team1Ownership > booster.team2Ownership) {
						booster.sprite.tint = 16711680;
						this.boostTeam1 += 11;
					} else if(booster.team2Ownership > booster.team1Ownership) {
						booster.sprite.tint = 255;
						this.boostTeam2 += 11;
					}
					booster.team1Ownership = 0;
					booster.team2Ownership = 0;
					if(booster.isFadingOut) {
						booster.sprite.alpha -= 0.1 * timeMod;
						if(booster.sprite.alpha < 0) {
							booster.sprite.destroy();
							this.boosters.splice(i,1);
						}
					} else if(booster.age >= 200 && random_Random.getFloat(50) < timeMod && i == this.boosters.length - 1) {
						booster.isFadingOut = true;
					} else if(booster.sprite.alpha < 1) {
						booster.sprite.alpha = Math.min(1,booster.sprite.alpha + 0.1 * timeMod);
					}
				}
				if(this.boosters.length < 2 && random_Random.getFloat(100) < timeMod) {
					var xPos = -1;
					var tries = 0;
					while(tries < 10) {
						xPos = random_Random.getInt(this.totalWidth - buildings_HoloGameHall.boosterSpriteSize);
						var failed = false;
						var _g = 0;
						var _g1 = this.boosters;
						while(_g < _g1.length) {
							var booster = _g1[_g];
							++_g;
							if(xPos > booster.xPos - buildings_HoloGameHall.boosterSpriteSize && xPos < booster.xPos + buildings_HoloGameHall.boosterSpriteSize) {
								failed = true;
							}
						}
						if(!failed) {
							break;
						}
						++tries;
					}
					if(tries < 10) {
						var spr = new PIXI.Sprite(Resources.getTexture("spr_hgh_booster"));
						spr.alpha = 0;
						this.bgStage.addChild(spr);
						this.boosters.push({ xPos : xPos, team2Ownership : 0, team1Ownership : 0, sprite : spr, isFadingOut : false, age : 0});
					}
				}
				this.positionHGHSprites();
			}
		}
	}
	,resetSpaceShipGame: function() {
		this.progressTeam1 = 0;
		this.progressTeam2 = 0;
		this.gameInited = false;
		this.destroyHGHSprites();
		this.hasAtLeastOneVisitor = false;
		this.boosters = [];
	}
	,stopSpaceShipGame: function() {
		this.resetSpaceShipGame();
		this.setGameType();
	}
	,setGameType: function() {
		var tmp;
		switch(random_Random.getInt(1 + (this.get_hasRightHoloGameHall() || this.get_hasLeftHoloGameHall() ? 1 : 0))) {
		case 0:
			tmp = 1;
			break;
		case 1:
			tmp = 0;
			break;
		default:
			tmp = 1;
		}
		this.currentGameType = tmp;
	}
	,positionHGHSprites: function() {
		var totalRemWidth = this.totalWidth - buildings_HoloGameHall.monsterSize * 2;
		if(this.monsterSpriteTeam1 != null) {
			this.monsterSpriteTeam1.position.set(this.position.x + 1 + Math.floor(this.progressTeam1 * totalRemWidth),this.position.y + 2);
		}
		if(this.monsterSpriteTeam2 != null) {
			this.monsterSpriteTeam2.position.set(this.position.x + this.totalWidth + 1 - Math.ceil(this.progressTeam2 * totalRemWidth),this.position.y + 2);
		}
		var _g = 0;
		var _g1 = this.boosters;
		while(_g < _g1.length) {
			var booster = _g1[_g];
			++_g;
			booster.sprite.position.set(this.position.x + booster.xPos,this.position.y + 20 - 9);
		}
		var _g = 0;
		var _g1 = this.blocks.length;
		while(_g < _g1) {
			var i = _g++;
			var theseBlocks = this.blocks[i];
			var _g2 = 0;
			var _g3 = theseBlocks.length;
			while(_g2 < _g3) {
				var j = _g2++;
				theseBlocks[j].sprite.position.set(this.position.x + 2 + i * 4,this.position.y + 20 - 5 - 4 * j);
			}
		}
	}
	,__class__: buildings_HoloGameHall
});
