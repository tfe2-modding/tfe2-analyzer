var buildings_HighTechNightClub = $hxClasses["buildings.HighTechNightClub"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.lowestNightClub = null;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.positionSprites();
	this.startTime = 20;
	this.endTime = 7.5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
	if(buildings_HighTechNightClub.citizenClothesTexture == null) {
		buildings_HighTechNightClub.citizenClothesTexture = Resources.getTexture("spr_tech_nightclub_hoverer");
	}
	this.lowestNightClub = this;
};
buildings_HighTechNightClub.__name__ = "buildings.HighTechNightClub";
buildings_HighTechNightClub.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_HighTechNightClub.__super__ = buildings_Work;
buildings_HighTechNightClub.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 100;
	}
	,get_isOpen: function() {
		if((this.bottomBuilding == null || !this.bottomBuilding.is(buildings_HighTechNightClub)) && this.workers.length == 1 && this.workers[0].currentAction == 0) {
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
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_AllDirMergingBuildingDrawer;
	}
	,get_mergingDrawer: function() {
		return this.drawer;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		if(this.bottomBuilding != null) {
			return !this.bottomBuilding.is(buildings_HighTechNightClub);
		} else {
			return true;
		}
	}
	,get_hasLeftNightClub: function() {
		if(this.leftBuilding != null) {
			return this.leftBuilding.is(buildings_HighTechNightClub);
		} else {
			return false;
		}
	}
	,get_hasRightNightClub: function() {
		if(this.rightBuilding != null) {
			return this.rightBuilding.is(buildings_HighTechNightClub);
		} else {
			return false;
		}
	}
	,get_hasTopNightClub: function() {
		if(this.topBuilding != null) {
			return this.topBuilding.is(buildings_HighTechNightClub);
		} else {
			return false;
		}
	}
	,get_hasBottomNightClub: function() {
		if(this.bottomBuilding != null) {
			return this.bottomBuilding.is(buildings_HighTechNightClub);
		} else {
			return false;
		}
	}
	,get_firstBuildingToGoTo: function() {
		return this.lowestNightClub;
	}
	,postCreate: function() {
		buildings_Work.prototype.postCreate.call(this);
		this.updateLowestNightClub();
	}
	,onCityChange: function() {
		this.updateLowestNightClub();
	}
	,updateLowestNightClub: function() {
		this.lowestNightClub = this;
		while(this.lowestNightClub.get_hasBottomNightClub()) this.lowestNightClub = this.lowestNightClub.bottomBuilding;
	}
	,onCitizenLeave: function(citizen,newPermanent) {
		if(newPermanent != null && !newPermanent.is(buildings_HighTechNightClub)) {
			if(citizen.accessorySprite != null) {
				citizen.accessorySprite.destroy();
				citizen.accessorySprite = null;
			}
		}
	}
	,beEntertained: function(citizen,timeMod) {
		if(citizen.accessorySprite == null) {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			var tmp;
			if(Math.abs(9 - citizen.relativeX) < spd) {
				citizen.relativeX = 9;
				tmp = true;
			} else {
				var num = 9 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				tmp = false;
			}
			if(tmp) {
				citizen.setRelativeY(citizen.relativeY + timeMod / 2);
				if(citizen.relativeY >= 4) {
					citizen.accessorySprite = new PIXI.Sprite(buildings_HighTechNightClub.citizenClothesTexture);
					citizen.accessorySprite.anchor.set(0,0);
					citizen.accessorySprite.position.set(-1,-1);
					citizen.sprite.addChild(citizen.accessorySprite);
					citizen.setRelativeY(4);
					citizen.addToWithAccessoryStage();
				}
			} else {
				citizen.setRelativeY(0);
			}
			citizen.dynamicUnsavedVars.xMoveLeft = 0.0;
			citizen.dynamicUnsavedVars.yMoveLeft = 0.0;
			citizen.dynamicUnsavedVars.waitTime = 0.0;
			return;
		}
		var hasLeftBuildingOfSameType = this.get_hasLeftNightClub();
		var leftBuilding = this.leftBuilding;
		var hasRightBuildingOfSameType = this.get_hasRightNightClub();
		var rightBuilding = this.rightBuilding;
		var hasTopBuildingOfSameType = this.get_hasTopNightClub();
		var topBuilding = this.topBuilding;
		var hasBottomBuildingOfSameType = this.get_hasBottomNightClub();
		var bottomBuilding = this.bottomBuilding;
		if(Math.abs(citizen.dynamicUnsavedVars.xMoveLeft) > 0) {
			var num = citizen.dynamicUnsavedVars.xMoveLeft;
			var xMoveNowSign = num > 0 ? 1 : num < 0 ? -1 : 0;
			var xMoveNow = timeMod * xMoveNowSign;
			if(xMoveNowSign * xMoveNow > xMoveNowSign * citizen.dynamicUnsavedVars.xMoveLeft) {
				citizen.setRelativeX(citizen.relativeX + citizen.dynamicUnsavedVars.xMoveLeft);
				citizen.dynamicUnsavedVars.xMoveLeft = 0;
			} else {
				citizen.setRelativeX(citizen.relativeX + xMoveNow);
				citizen.dynamicUnsavedVars.xMoveLeft -= xMoveNow;
			}
			if(xMoveNowSign > 0 && citizen.relativeX > 20) {
				if(hasRightBuildingOfSameType) {
					citizen.inPermanent = rightBuilding;
					citizen.setRelativeX(citizen.relativeX - 20);
				} else {
					citizen.dynamicUnsavedVars.xMoveLeft = 0;
				}
			}
			if(xMoveNowSign < 0 && citizen.relativeX < 0) {
				if(hasLeftBuildingOfSameType) {
					citizen.setRelativeX(citizen.relativeX + 20);
					citizen.inPermanent = leftBuilding;
				} else {
					citizen.dynamicUnsavedVars.xMoveLeft = 0;
				}
			}
		}
		if(Math.abs(citizen.dynamicUnsavedVars.yMoveLeft) > 0) {
			var num = citizen.dynamicUnsavedVars.yMoveLeft;
			var yMoveNowSign = num > 0 ? 1 : num < 0 ? -1 : 0;
			var yMoveNow = timeMod * yMoveNowSign;
			if(yMoveNowSign * yMoveNow > yMoveNowSign * citizen.dynamicUnsavedVars.yMoveLeft) {
				citizen.setRelativeY(citizen.relativeY + citizen.dynamicUnsavedVars.yMoveLeft);
				citizen.dynamicUnsavedVars.yMoveLeft = 0;
			} else {
				citizen.setRelativeY(citizen.relativeY + yMoveNow);
				citizen.dynamicUnsavedVars.yMoveLeft -= yMoveNow;
			}
			if(yMoveNowSign > 0 && citizen.relativeY > 20) {
				if(hasTopBuildingOfSameType) {
					citizen.inPermanent = topBuilding;
					citizen.setRelativeY(citizen.relativeY - 20);
				} else {
					citizen.dynamicUnsavedVars.yMoveLeft = 0;
				}
			}
			if(yMoveNowSign < 0 && citizen.relativeY < 0) {
				if(hasBottomBuildingOfSameType) {
					citizen.setRelativeY(citizen.relativeY + 20);
					citizen.inPermanent = bottomBuilding;
				} else {
					citizen.dynamicUnsavedVars.yMoveLeft = 0;
				}
			}
		}
		if(citizen.dynamicUnsavedVars.yMoveLeft == 0 && citizen.dynamicUnsavedVars.xMoveLeft == 0) {
			if(citizen.dynamicUnsavedVars.waitTime < 1) {
				citizen.dynamicUnsavedVars.waitTime += timeMod;
				return;
			}
			citizen.dynamicUnsavedVars.waitTime = 0.0;
			var r = random_Random.getInt(2);
			if(r == 0) {
				var remainingTop = 20 - citizen.relativeY - citizen.actualSpriteHeight - 4;
				if(this.get_hasTopNightClub() && (this.topBuilding.get_hasLeftNightClub() || citizen.relativeX >= 4) && (this.topBuilding.get_hasRightNightClub() || citizen.relativeX <= 14)) {
					remainingTop += 20;
				}
				var remainingBottom = 0.0;
				if(remainingTop < 10 || random_Random.getInt(2) == 0) {
					remainingBottom = citizen.relativeY - 4;
					if(this.get_hasBottomNightClub() && (this.bottomBuilding.get_hasLeftNightClub() || citizen.relativeX >= 4) && (this.bottomBuilding.get_hasRightNightClub() || citizen.relativeX <= 14)) {
						remainingBottom += 20;
					}
				}
				citizen.dynamicUnsavedVars.yMoveLeft = random_Random.getFloat(-remainingBottom,remainingTop);
			} else if(r == 1) {
				var remainingRight = 20 - citizen.relativeX - 2 - 4;
				if(this.get_hasRightNightClub() && (this.rightBuilding.get_hasBottomNightClub() || citizen.relativeY > 2) && (this.rightBuilding.get_hasTopNightClub() || citizen.relativeY < 20 - citizen.actualSpriteHeight - 4)) {
					remainingRight += 20;
				}
				var remainingLeft = citizen.relativeX - 4;
				if(this.get_hasLeftNightClub() && (this.leftBuilding.get_hasBottomNightClub() || citizen.relativeY > 2) && (this.leftBuilding.get_hasTopNightClub() || citizen.relativeY < 20 - citizen.actualSpriteHeight - 4)) {
					remainingLeft += 20;
				}
				citizen.dynamicUnsavedVars.xMoveLeft = random_Random.getFloat(-remainingLeft,remainingRight);
			}
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && this.city.simulation.time.timeSinceStart / 60 % 24 > 6) {
			if(!citizen.inPermanent.is(buildings_HighTechNightClub)) {
				citizen.setRelativeY(0);
				if(citizen.accessorySprite != null) {
					citizen.accessorySprite.destroy();
					citizen.accessorySprite = null;
				}
				citizen.currentAction = 2;
				return;
			}
			if(citizen.inPermanent.exitBuilding(citizen,timeMod)) {
				citizen.currentAction = 2;
			}
			return;
		}
		if(citizen.inPermanent != this) {
			if(!citizen.inPermanent.is(buildings_HighTechNightClub) || !citizen.inPermanent.get_hasTopNightClub()) {
				return;
			}
		}
	}
	,createWindowAddBottomButtons: function() {
		buildings_Work.prototype.createWindowAddBottomButtons.call(this);
	}
	,exitBuilding: function(citizen,timeMod) {
		if(citizen.accessorySprite == null && citizen.relativeY <= 0) {
			return true;
		}
		var tmp;
		if(citizen.relativeX < 3) {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			var tmp1;
			if(Math.abs(3 - citizen.relativeX) < spd) {
				citizen.relativeX = 3;
				tmp1 = true;
			} else {
				var num = 3 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				tmp1 = false;
			}
			tmp = !tmp1;
		} else {
			tmp = false;
		}
		if(tmp) {
			return false;
		}
		var tmp;
		if(citizen.relativeX > 16) {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			var tmp1;
			if(Math.abs(16 - citizen.relativeX) < spd) {
				citizen.relativeX = 16;
				tmp1 = true;
			} else {
				var num = 16 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				tmp1 = false;
			}
			tmp = !tmp1;
		} else {
			tmp = false;
		}
		if(tmp) {
			return false;
		}
		var hasLeftBuildingOfSameType = this.get_hasLeftNightClub();
		var leftBuilding = this.leftBuilding;
		var hasRightBuildingOfSameType = this.get_hasRightNightClub();
		var rightBuilding = this.rightBuilding;
		var hasTopBuildingOfSameType = this.get_hasTopNightClub();
		var topBuilding = this.topBuilding;
		var hasBottomBuildingOfSameType = this.get_hasBottomNightClub();
		var bottomBuilding = this.bottomBuilding;
		if(Math.abs(citizen.dynamicUnsavedVars.xMoveLeft) > 0) {
			var num = citizen.dynamicUnsavedVars.xMoveLeft;
			var xMoveNowSign = num > 0 ? 1 : num < 0 ? -1 : 0;
			var xMoveNow = timeMod * xMoveNowSign;
			if(xMoveNowSign * xMoveNow > xMoveNowSign * citizen.dynamicUnsavedVars.xMoveLeft) {
				citizen.setRelativeX(citizen.relativeX + citizen.dynamicUnsavedVars.xMoveLeft);
				citizen.dynamicUnsavedVars.xMoveLeft = 0;
			} else {
				citizen.setRelativeX(citizen.relativeX + xMoveNow);
				citizen.dynamicUnsavedVars.xMoveLeft -= xMoveNow;
			}
			if(xMoveNowSign > 0 && citizen.relativeX > 20) {
				if(hasRightBuildingOfSameType) {
					citizen.inPermanent = rightBuilding;
					citizen.setRelativeX(citizen.relativeX - 20);
				} else {
					citizen.dynamicUnsavedVars.xMoveLeft = 0;
				}
			}
			if(xMoveNowSign < 0 && citizen.relativeX < 0) {
				if(hasLeftBuildingOfSameType) {
					citizen.setRelativeX(citizen.relativeX + 20);
					citizen.inPermanent = leftBuilding;
				} else {
					citizen.dynamicUnsavedVars.xMoveLeft = 0;
				}
			}
		}
		if(Math.abs(citizen.dynamicUnsavedVars.yMoveLeft) > 0) {
			var num = citizen.dynamicUnsavedVars.yMoveLeft;
			var yMoveNowSign = num > 0 ? 1 : num < 0 ? -1 : 0;
			var yMoveNow = timeMod * yMoveNowSign;
			if(yMoveNowSign * yMoveNow > yMoveNowSign * citizen.dynamicUnsavedVars.yMoveLeft) {
				citizen.setRelativeY(citizen.relativeY + citizen.dynamicUnsavedVars.yMoveLeft);
				citizen.dynamicUnsavedVars.yMoveLeft = 0;
			} else {
				citizen.setRelativeY(citizen.relativeY + yMoveNow);
				citizen.dynamicUnsavedVars.yMoveLeft -= yMoveNow;
			}
			if(yMoveNowSign > 0 && citizen.relativeY > 20) {
				if(hasTopBuildingOfSameType) {
					citizen.inPermanent = topBuilding;
					citizen.setRelativeY(citizen.relativeY - 20);
				} else {
					citizen.dynamicUnsavedVars.yMoveLeft = 0;
				}
			}
			if(yMoveNowSign < 0 && citizen.relativeY < 0) {
				if(hasBottomBuildingOfSameType) {
					citizen.setRelativeY(citizen.relativeY + 20);
					citizen.inPermanent = bottomBuilding;
				} else {
					citizen.dynamicUnsavedVars.yMoveLeft = 0;
				}
			}
		}
		if(this.get_hasBottomNightClub()) {
			citizen.dynamicUnsavedVars.yMoveLeft = -citizen.relativeY - 15;
			return false;
		} else if(citizen.relativeY > 4) {
			citizen.dynamicUnsavedVars.yMoveLeft = -citizen.relativeY + 4;
			return false;
		}
		citizen.dynamicUnsavedVars.yMoveLeft = 0;
		citizen.dynamicUnsavedVars.xMoveLeft = 0;
		var spd = citizen.pathWalkSpeed * timeMod;
		Citizen.shouldUpdateDraw = true;
		var tmp;
		if(Math.abs(9 - citizen.relativeX) < spd) {
			citizen.relativeX = 9;
			tmp = true;
		} else {
			var num = 9 - citizen.relativeX;
			citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			tmp = false;
		}
		if(!tmp) {
			return false;
		}
		if(citizen.accessorySprite != null) {
			citizen.accessorySprite.destroy();
			citizen.accessorySprite = null;
		}
		if(citizen.relativeY > 0) {
			citizen.setRelativeY(Math.max(citizen.relativeY - timeMod * 0.5,0));
			return false;
		}
		return true;
	}
	,finishEntertainment: function(citizen,timeMod) {
		return this.exitBuilding(citizen,timeMod);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_HighTechNightClub.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_HighTechNightClub
});
