var buildings_EscapeRoom = $hxClasses["buildings.EscapeRoom"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.graphicsDrawn = false;
	this.escapeRoomPhaseProgress = 0;
	this.escapeRoomPhase = buildings_EscapeRoomPhase.Start;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 13;
	this.endTime = 3;
	this.workTimePreferenceMod = 0.1;
	this.isEntertainment = true;
	this.registeredCitizens = [];
	this.graphics = new PIXI.Graphics();
	bgStage.addChild(this.graphics);
	this.graphics.position.set(position.x,position.y);
};
buildings_EscapeRoom.__name__ = "buildings.EscapeRoom";
buildings_EscapeRoom.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_EscapeRoom.__super__ = buildings_Work;
buildings_EscapeRoom.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 120;
	}
	,get_isOpen: function() {
		if(this.workers.length == 1 && this.workers[0].currentAction == 0 && this.city.simulation.time.timeSinceStart / 60 % 24 < 23.99) {
			return this.registeredCitizens.length < 10;
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
		return 3.5;
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
		if(this.workers.length == 1) {
			return this.workers[0].currentAction == 0;
		} else {
			return false;
		}
	}
	,finishEntertainment: function(citizen,timeMod) {
		if(!(this.registeredCitizens.length < 5 || this.registeredCitizens.indexOf(citizen) == -1 || this.escapeRoomPhase == buildings_EscapeRoomPhase.Done)) {
			return !this.get_isOpenForExistingVisitors();
		} else {
			return true;
		}
	}
	,beEntertained: function(citizen,timeMod) {
		if(!citizen.hasBuildingInited || citizen.dynamicUnsavedVars.buildingInited == null) {
			if(this.registeredCitizens.indexOf(citizen) == -1) {
				if(this.registeredCitizens.length > 10) {
					citizen.entertainment.stop();
					return;
				}
				this.registeredCitizens.push(citizen);
			}
			citizen.hasBuildingInited = true;
			citizen.dynamicUnsavedVars.buildingInited = true;
		}
		if(this.escapeRoomPhase == buildings_EscapeRoomPhase.Done) {
			citizen.entertainment.stop();
			return;
		}
		if(this.registeredCitizens.length < 5) {
			if(citizen.relativeY > 5) {
				citizen.changeFloor();
			} else {
				citizen.moveAndWait(random_Random.getInt(7,16),random_Random.getInt(50,70),null,false,false);
			}
		} else if(this.escapeRoomPhase == buildings_EscapeRoomPhase.Start) {
			if(citizen.relativeY > 5) {
				citizen.changeFloor();
			} else {
				citizen.moveAndWait(random_Random.getInt(7,16),random_Random.getInt(50,70),null,false,false);
			}
			if(this.registeredCitizens.length < 8 && this.escapeRoomPhaseProgress < 1) {
				this.escapeRoomPhaseProgress += 0.02 * timeMod;
			} else {
				this.escapeRoomPhase = buildings_EscapeRoomPhase.First;
				this.escapeRoomPhaseProgress = 0;
			}
			return;
		} else if(this.escapeRoomPhase == buildings_EscapeRoomPhase.First) {
			if(citizen.relativeY < 5 && citizen.relativeX > 2 && citizen.relativeX < 7) {
				citizen.changeFloor();
			} else {
				citizen.moveAndWait(random_Random.getInt(3,6),random_Random.getInt(30,60),null,false,false);
				if(random_Random.getFloat(1) < 0.2) {
					this.escapeRoomPhaseProgress += 0.2;
					if(this.escapeRoomPhaseProgress > 1) {
						this.escapeRoomPhase = buildings_EscapeRoomPhase.Second;
						this.escapeRoomPhaseProgress = 0;
					}
				}
			}
		} else if(this.escapeRoomPhase == buildings_EscapeRoomPhase.Second) {
			var ind = this.registeredCitizens.indexOf(citizen);
			if(ind % 2 == 0) {
				if(citizen.relativeY > 5) {
					citizen.changeFloor();
				} else {
					citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(50,120),null,false,false);
					if(random_Random.getFloat(1) < 0.3) {
						this.escapeRoomPhaseProgress += 0.34;
						if(this.escapeRoomPhaseProgress > 1) {
							this.escapeRoomPhase = buildings_EscapeRoomPhase.Third;
							this.escapeRoomPhaseProgress = 0;
						}
					}
				}
			} else if(citizen.relativeY < 5 && citizen.relativeX > 2 && citizen.relativeX < 7) {
				citizen.changeFloor();
			} else {
				citizen.moveAndWait(random_Random.getInt(3,6),random_Random.getInt(30,60),null,false,false);
			}
		} else if(this.escapeRoomPhase == buildings_EscapeRoomPhase.Third) {
			if(citizen.relativeY > 5) {
				citizen.changeFloor();
			} else if(citizen.relativeX > 4) {
				var moveToX = random_Random.getInt(3,5);
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 4;
				arr[1] = moveToX;
				citizen.setPath(arr,0,2,true);
				citizen.pathEndFunction = null;
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
			}
		} else if(this.escapeRoomPhase == buildings_EscapeRoomPhase.Last) {
			if(citizen.relativeY < 5 && citizen.relativeX > 11 && citizen.relativeX < 16) {
				citizen.changeFloor();
			} else {
				citizen.moveAndWait(random_Random.getInt(11,16),random_Random.getInt(20,60),null,false,false);
			}
		}
	}
	,update: function(timeMod) {
		var i = this.registeredCitizens.length;
		while(--i > 0) {
			var thisCitizen = this.registeredCitizens[i];
			if(thisCitizen.hasDied || (thisCitizen.inPermanent != null && thisCitizen.inPermanent.isBuilding ? thisCitizen.inPermanent : null) != this) {
				this.registeredCitizens.splice(i,1);
			}
		}
		if(this.escapeRoomPhase == buildings_EscapeRoomPhase.Done) {
			this.escapeRoomPhaseProgress += 0.02 * timeMod;
			if(this.escapeRoomPhaseProgress >= 1) {
				this.resetEscapeRoom();
			}
		} else if(this.escapeRoomPhase == buildings_EscapeRoomPhase.Third) {
			if(common_ArrayExtensions.all(this.registeredCitizens,function(c) {
				if(c.relativeY < 5) {
					return c.relativeX < 5;
				} else {
					return false;
				}
			})) {
				this.escapeRoomPhase = buildings_EscapeRoomPhase.Lasers;
				this.escapeRoomPhaseProgress = 0;
			}
		} else if(this.escapeRoomPhase == buildings_EscapeRoomPhase.Last) {
			if(common_ArrayExtensions.all(this.registeredCitizens,function(c) {
				if(c.relativeY > 5) {
					return c.relativeX > 11;
				} else {
					return false;
				}
			})) {
				this.escapeRoomPhase = buildings_EscapeRoomPhase.Done;
				this.escapeRoomPhaseProgress = 0;
			}
		}
		if(this.escapeRoomPhase == buildings_EscapeRoomPhase.Lasers) {
			this.graphics.clear();
			this.graphics.beginFill(16711680,0.7);
			var y = 13;
			this.graphics.drawRect(7,y,1,1);
			var y = 13;
			this.graphics.drawRect(8,y,1,1);
			var y = 13;
			this.graphics.drawRect(9,y,1,1);
			var y = 13;
			this.graphics.drawRect(10,y,1,1);
			var y = 13;
			this.graphics.drawRect(11,y,1,1);
			var y = 13;
			this.graphics.drawRect(12,y,1,1);
			var y = 13;
			this.graphics.drawRect(13,y,1,1);
			var y = 13;
			this.graphics.drawRect(14,y,1,1);
			var y = 13;
			this.graphics.drawRect(15,y,1,1);
			var y = 13;
			this.graphics.drawRect(16,y,1,1);
			this.graphics.endFill();
			this.graphicsDrawn = true;
			this.escapeRoomPhaseProgress += 0.01 * timeMod;
			if(this.escapeRoomPhaseProgress >= 1) {
				this.escapeRoomPhaseProgress = 0;
				this.escapeRoomPhase = buildings_EscapeRoomPhase.Last;
			}
		} else if(this.graphicsDrawn) {
			this.graphics.clear();
			this.graphicsDrawn = false;
		}
	}
	,postLoad: function() {
		this.graphics.position.set(this.position.x,this.position.y);
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		this.graphics.position.set(this.position.x,this.position.y);
	}
	,onCitizenLeave: function(citizen,newPermanent) {
		HxOverrides.remove(this.registeredCitizens,citizen);
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			this.resetEscapeRoom();
		} else {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(3 - citizen.relativeX) < spd) {
				citizen.relativeX = 3;
			} else {
				var num = 3 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
		}
	}
	,resetEscapeRoom: function() {
		this.escapeRoomPhase = buildings_EscapeRoomPhase.Start;
		this.escapeRoomPhaseProgress = 0;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_EscapeRoom.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		this.postLoad();
	}
	,__class__: buildings_EscapeRoom
});
