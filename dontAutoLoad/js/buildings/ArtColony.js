var buildings_ArtColony = $hxClasses["buildings.ArtColony"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.artSprite = null;
	this.currentWorkProgress = 0;
	this.currentTexture = 0;
	buildings_WorkWithHome.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 10;
	this.endTime = 22;
	this.workTimePreferenceMod = 0.3;
	this.isEntertainment = true;
	this.artTextures = Resources.getTexturesByWidth("spr_artcolonywork",20);
	this.currentTexture = 0;
	this.artSprite = new PIXI.Sprite(this.artTextures[this.currentTexture]);
	this.artSprite.position.set(position.x,position.y);
	bgStage.addChild(this.artSprite);
};
buildings_ArtColony.__name__ = "buildings.ArtColony";
buildings_ArtColony.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_ArtColony.__super__ = buildings_WorkWithHome;
buildings_ArtColony.prototype = $extend(buildings_WorkWithHome.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 50;
	}
	,get_isOpen: function() {
		if(this.workers.length > 0 && this.workers[0].currentAction == 0 && (1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0)) % 3 == 0 && this.city.simulation.time.timeSinceStart / 60 % 24 < 21.5) {
			return this.city.simulation.time.timeSinceStart / 60 % 24 > 15.0;
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 3;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 1;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 2;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 2;
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
	,postLoad: function() {
		this.artSprite.texture = this.artTextures[this.currentTexture];
	}
	,positionSprites: function() {
		buildings_WorkWithHome.prototype.positionSprites.call(this);
		if(this.artSprite != null) {
			this.artSprite.position.set(this.position.x,this.position.y);
		}
	}
	,destroy: function() {
		buildings_WorkWithHome.prototype.destroy.call(this);
		this.artSprite.destroy();
	}
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(50,100),null,modifyWithHappiness,slowMove);
		};
		if(citizen.relativeY < 5) {
			citizen.changeFloor(moveFunction);
		} else {
			moveFunction();
		}
	}
	,get_possibleUpgrades: function() {
		return [];
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		var tmp = this.city.gui;
		var tmp1 = Resources.getTexture("spr_work_housing");
		var city = this.city;
		var citizens = this.residents;
		var topText = common_Localize.lo("resident_workers_of",[this.get_name()]);
		var relatedBuilding = this;
		var nothingFoundText = common_Localize.lo("none");
		tmp.windowAddSimpleButton(tmp1,function() {
			gui_MultiFollowWindow.createWindow(city,citizens,topText,relatedBuilding,nothingFoundText);
		},null,function() {
			return common_Localize.lo("resident_workers",[_gthis.residents.length,_gthis.get_residentCapacity()]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("quality",[_gthis.get_baseAttractiveness() + _gthis.bonusAttractiveness]);
		});
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(3);
		if(r == 0 && stepsInBuilding > 120) {
			citizen.changeFloorAndWaitRandom(30,60);
		} else if(r == 1) {
			if(citizen.relativeY < 5) {
				citizen.moveAndWait(random_Random.getInt(3,15),random_Random.getInt(30,60),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(3,15),random_Random.getInt(30,60),null,false,false);
			}
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(90,120);
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		}
		var workerIndex = this.workers.indexOf(citizen);
		var myPlace = (workerIndex + (1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0))) % 5;
		if(myPlace == 0 || myPlace == 3) {
			if(citizen.relativeY > 5) {
				citizen.changeFloor();
			} else if(myPlace == 0) {
				if(citizen.relativeX < 3 || citizen.relativeX > 6 || random_Random.getFloat() < 0.015 * timeMod) {
					citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(5,10),null,false,false);
				}
			} else if(myPlace == 3) {
				if(citizen.relativeX < 12 || citizen.relativeX > 15 || random_Random.getFloat() < 0.015 * timeMod) {
					citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(5,10),null,false,false);
				}
			}
		} else if(citizen.relativeY < 5) {
			citizen.changeFloor();
		} else if(myPlace == 1) {
			if(citizen.relativeX < 3 || citizen.relativeX > 6 || random_Random.getFloat() < 0.015 * timeMod) {
				citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(5,10),null,false,false);
			}
		} else if(myPlace == 2) {
			if(citizen.relativeX < 12 || citizen.relativeX > 15 || random_Random.getFloat() < 0.015 * timeMod) {
				citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(5,10),null,false,false);
			}
		} else if(myPlace == 4) {
			if(citizen.relativeX < 8 || citizen.relativeX > 10 || random_Random.getFloat() < 0.015 * timeMod) {
				citizen.moveAndWait(random_Random.getInt(8,11),random_Random.getInt(5,10),null,false,false);
			}
		}
		if(this.currentWorkProgress >= 1.0) {
			this.currentTexture += 1;
			var totalNewWorksUnlocked = 0;
			var _g = 0;
			var _g1 = buildings_ArtColony.unlockNewWorkAfter;
			while(_g < _g1.length) {
				var newWorkAfter = _g1[_g];
				++_g;
				if(this.currentTexture > newWorkAfter) {
					++totalNewWorksUnlocked;
				}
			}
			var val1 = this.city.progress.unlocks.numberOfModernArtMuseumArtworksUnlocked;
			var val2 = 4 + totalNewWorksUnlocked;
			this.city.progress.unlocks.numberOfModernArtMuseumArtworksUnlocked = val2 > val1 ? val2 : val1;
			this.currentTexture %= this.artTextures.length;
			this.artSprite.texture = this.artTextures[this.currentTexture];
			this.currentWorkProgress = 0;
		}
		this.currentWorkProgress += timeMod * citizen.get_educationSpeedModifier() * this.city.simulation.happiness.actionSpeedModifier * 0.00002;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_WorkWithHome.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ArtColony.saveDefinition);
		}
		var value = this.currentTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.currentWorkProgress;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_WorkWithHome.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentTexture")) {
			this.currentTexture = loadMap.h["currentTexture"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentWorkProgress")) {
			this.currentWorkProgress = loadMap.h["currentWorkProgress"];
		}
		this.postLoad();
	}
	,__class__: buildings_ArtColony
});
