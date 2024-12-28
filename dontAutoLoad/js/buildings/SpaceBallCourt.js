var buildings_SpaceBallCourt = $hxClasses["buildings.SpaceBallCourt"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalWidth = 18;
	this.coordinatorBuilding = null;
	this.rightGoal = null;
	this.leftGoal = null;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.isEntertainment = true;
};
buildings_SpaceBallCourt.__name__ = "buildings.SpaceBallCourt";
buildings_SpaceBallCourt.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_SpaceBallCourt.__super__ = Building;
buildings_SpaceBallCourt.prototype = $extend(Building.prototype,{
	get_baseEntertainmentCapacity: function() {
		return 30;
	}
	,get_isOpen: function() {
		return true;
	}
	,get_entertainmentType: function() {
		return null;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 3;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 5;
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
	,get_hasLeftConnected: function() {
		if(this.leftBuilding != null) {
			return this.leftBuilding.is(buildings_SpaceBallCourt);
		} else {
			return false;
		}
	}
	,get_hasRightConnected: function() {
		if(this.rightBuilding != null) {
			return this.rightBuilding.is(buildings_SpaceBallCourt);
		} else {
			return false;
		}
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		if(this.leftGoal != null) {
			this.leftGoal.destroy();
			this.leftGoal = null;
		}
		if(this.rightGoal != null) {
			this.rightGoal.destroy();
			this.rightGoal = null;
		}
	}
	,updateSprites: function() {
		if(this.get_hasLeftConnected()) {
			if(this.leftGoal != null) {
				this.leftGoal.destroy();
				this.leftGoal = null;
			}
		} else if(this.leftGoal == null) {
			this.leftGoal = Resources.makeSprite("spr_spaceballcourt_goal");
			this.leftGoal.position.set(this.position.x + 3,this.position.y);
			this.bgStage.addChild(this.leftGoal);
		}
		if(this.get_hasRightConnected()) {
			if(this.rightGoal != null) {
				this.rightGoal.destroy();
				this.rightGoal = null;
			}
		} else if(this.rightGoal == null) {
			this.rightGoal = Resources.makeSprite("spr_spaceballcourt_goal");
			this.rightGoal.position.set(this.position.x + 17,this.position.y);
			this.rightGoal.scale.x = -1;
			this.bgStage.addChild(this.rightGoal);
		}
		if(buildings_SpaceBallCourt.citizenClothesTexture == null) {
			buildings_SpaceBallCourt.citizenClothesTexture = Resources.getTexture("spr_sbc_citizenclothes_1");
		}
	}
	,onCitizenLeave: function(citizen,newPermanent) {
		if(newPermanent == null || !newPermanent.is(buildings_SpaceBallCourt)) {
			if(citizen.accessorySprite != null) {
				citizen.accessorySprite.destroy();
				citizen.accessorySprite = null;
				citizen.addToCorrectStage();
			}
		}
	}
	,onCityChange: function() {
		Building.prototype.onCityChange.call(this);
		this.updateSprites();
		this.calculateCoordinatorBuilding();
	}
	,beEntertained: function(citizen,timeMod) {
		if(!citizen.hasBuildingInited || citizen.dynamicUnsavedVars.buildingInited == null) {
			citizen.dynamicUnsavedVars.sbcTeam = random_Random.getInt(2);
			citizen.hasBuildingInited = true;
			citizen.dynamicUnsavedVars.buildingInited = true;
			citizen.dynamicUnsavedVars.sbcStarted = true;
			if(citizen.accessorySprite == null) {
				citizen.accessorySprite = new PIXI.Sprite(buildings_SpaceBallCourt.citizenClothesTexture);
				citizen.accessorySprite.anchor.set(0,1);
				citizen.accessorySprite.alpha = 1;
				if(citizen.actualSpriteHeight == 4) {
					citizen.accessorySprite.position.set(0,1);
				}
				citizen.sprite.addChild(citizen.accessorySprite);
				citizen.addToWithAccessoryStage();
				if(citizen.dynamicUnsavedVars.sbcTeam == 0) {
					citizen.accessorySprite.tint = 16776960;
				} else {
					citizen.accessorySprite.tint = 65280;
				}
			}
		} else {
			citizen.moveTowardsRandomInWorldCoords(this.coordinatorBuilding.position.x + 4,this.coordinatorBuilding.position.x + this.coordinatorBuilding.totalWidth - 3,function() {
				citizen.hasBuildingInited = true;
			});
		}
	}
	,calculateCoordinatorBuilding: function() {
		var prevCoordinatorBuilding = this.coordinatorBuilding;
		this.coordinatorBuilding = this;
		while(this.coordinatorBuilding.get_hasLeftConnected()) this.coordinatorBuilding = this.coordinatorBuilding.leftBuilding;
		if(this.coordinatorBuilding == this) {
			this.totalWidth = 18;
			var currentlyHandling = this;
			while(currentlyHandling.get_hasRightConnected()) {
				this.totalWidth += 20;
				currentlyHandling = currentlyHandling.rightBuilding;
			}
		}
	}
	,__class__: buildings_SpaceBallCourt
});
