var buildings_HorrorGameHall = $hxClasses["buildings.HorrorGameHall"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.switchTime = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 20;
	this.endTime = 3.5;
	this.workTimePreferenceMod = 0.1;
	this.isEntertainment = true;
	this.lightUpSprite = Resources.makeSprite("spr_horrorgamehall_lightup");
	this.lightUpSprite.position.set(position.x,position.y);
	bgStage.addChild(this.lightUpSprite);
	this.lightUpSprite2 = Resources.makeSprite("spr_horrorgamehall_lightup2");
	this.lightUpSprite2.position.set(position.x,position.y);
	bgStage.addChild(this.lightUpSprite2);
};
buildings_HorrorGameHall.__name__ = "buildings.HorrorGameHall";
buildings_HorrorGameHall.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_HorrorGameHall.__super__ = buildings_Work;
buildings_HorrorGameHall.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 120;
	}
	,get_isOpen: function() {
		if(this.workers.length == 1 && this.workers[0].currentAction == 0) {
			return this.city.simulation.time.timeSinceStart / 60 % 24 < 3;
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 4;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 2.5;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 3;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 4;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 7;
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
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		this.lightUpSprite.position.set(this.position.x,this.position.y);
		this.lightUpSprite2.position.set(this.position.x,this.position.y);
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		this.lightUpSprite.destroy();
		this.lightUpSprite2.destroy();
	}
	,update: function(timeMod) {
		if(this.lightUpSprite.alpha == 1) {
			if(random_Random.getInt(10) == 1 && this.switchTime < 0) {
				this.lightUpSprite.alpha = 0;
				this.switchTime = 4;
			}
		} else if(random_Random.getInt(150) == 1 && this.switchTime < 0) {
			this.lightUpSprite.alpha = 1;
			this.switchTime = 4;
		}
		if(this.lightUpSprite2.alpha == 1) {
			if(random_Random.getInt(10) == 1 && this.switchTime < 0) {
				this.lightUpSprite2.alpha = 0;
				this.switchTime = 4;
			}
		} else if(random_Random.getInt(150) == 1 && this.switchTime < 0) {
			this.lightUpSprite2.alpha = 1;
			this.switchTime = 4;
		}
		this.switchTime--;
		if(random_Random.getFloat(100000) < timeMod && this.workers.length > 0) {
			this.workers[0].changeNameIfInFile("Dracula");
			this.workers[0].updateSpriteAndNameIndexInfo();
		}
	}
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			var xx = citizen.relativeY < 5 ? 5 + 4 * random_Random.getInt(3) : 5 + 8 * random_Random.getInt(2);
			citizen.moveAndWait(random_Random.getInt(xx,xx + 1),random_Random.getInt(100,120),null,false,false);
		};
		if(random_Random.getInt(3) == 1) {
			citizen.changeFloor(moveFunction);
		} else {
			moveFunction();
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(6 - citizen.relativeX) < spd) {
				citizen.relativeX = 6;
			} else {
				var num = 6 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_HorrorGameHall.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_HorrorGameHall
});
