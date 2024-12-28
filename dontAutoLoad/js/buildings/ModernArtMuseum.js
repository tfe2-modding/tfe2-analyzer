var buildings_ModernArtMuseum = $hxClasses["buildings.ModernArtMuseum"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.artSprite = null;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 9;
	this.endTime = 22;
	this.workTimePreferenceMod = 0.1;
	this.isEntertainment = true;
	this.artTextures = Resources.getTexturesByWidth("spr_modernart",20);
	this.currentTexture = random_Random.getInt(city.progress.unlocks.numberOfModernArtMuseumArtworksUnlocked);
	this.artSprite = new PIXI.Sprite(this.artTextures[this.currentTexture]);
	this.artSprite.position.set(position.x,position.y);
	bgStage.addChild(this.artSprite);
};
buildings_ModernArtMuseum.__name__ = "buildings.ModernArtMuseum";
buildings_ModernArtMuseum.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_ModernArtMuseum.__super__ = buildings_Work;
buildings_ModernArtMuseum.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 100;
	}
	,get_isOpen: function() {
		if(this.workers.length == 1 && this.workers[0].currentAction == 0) {
			return this.city.simulation.time.timeSinceStart / 60 % 24 < 21.5;
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
		return 2;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 3;
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
	,onBuild: function() {
		this.city.progress.unlocks.unlock(buildings_ArtColony);
	}
	,postLoad: function() {
		if(this.currentTexture == -1) {
			this.artSprite.texture = Resources.getTexture("spr_modernart_mission");
		} else {
			this.artSprite.texture = this.artTextures[this.currentTexture];
		}
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.artSprite != null) {
			this.artSprite.position.set(this.position.x,this.position.y);
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
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
			citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(100,120),null,modifyWithHappiness,slowMove);
		};
		if(citizen.relativeY < 5) {
			citizen.changeFloor(moveFunction);
		} else {
			moveFunction();
		}
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		if(this.currentTexture == -1) {
			var mission = this.city.progress.sideQuests.findCompletedSidequestWithType(progress_sidequests_SpecialArtworksMission);
			if(mission != null) {
				this.city.gui.windowAddInfoText(common_Localize.lo("showing_art_by",[mission.associatedCitizen]));
			}
		} else {
			gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.currentTexture;
			},function(t) {
				_gthis.currentTexture = t;
				_gthis.artSprite.texture = _gthis.artTextures[_gthis.currentTexture];
			},function() {
				return _gthis.city.progress.unlocks.numberOfModernArtMuseumArtworksUnlocked;
			},common_Localize.lo("change_exhibition"));
		}
		var mission = this.city.progress.sideQuests.findSidequestWithType(progress_sidequests_SpecialArtworksMission);
		if(mission != null) {
			gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
				_gthis.currentTexture = -1;
				_gthis.artSprite.texture = Resources.getTexture("spr_modernart_mission");
				_gthis.city.progress.sideQuests.completeSidequest(mission);
				_gthis.city.gui.reloadWindow();
			},this.city.gui.windowInner,function() {
				return common_Localize.lo("show_art_by",[mission.associatedCitizen]);
			},this.city.gui.innerWindowStage);
			this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		}
		buildings_Work.prototype.createWindowAddBottomButtons.call(this);
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else if(citizen.relativeX >= 4 && citizen.relativeX < 6) {
			if(random_Random.getInt(10) == 0) {
				citizen.changeFloorAndWaitRandom(30,60,function() {
					var slowMove = true;
					if(slowMove == null) {
						slowMove = false;
					}
					var moveToX = random_Random.getInt(14,15);
					if(slowMove) {
						var citizen1 = citizen;
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
						arr[0] = 12;
						arr[1] = 50;
						arr[2] = 4;
						arr[3] = moveToX;
						citizen1.setPath(arr,0,4,true);
					} else {
						var citizen1 = citizen;
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
						arr[0] = 4;
						arr[1] = moveToX;
						citizen1.setPath(arr,0,2,true);
					}
					citizen.pathEndFunction = function() {
						var citizen1 = citizen;
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
						arr[0] = 8;
						arr[1] = random_Random.getInt(30,60);
						citizen1.setPath(arr,0,2,true);
						citizen.pathEndFunction = function() {
							var slowMove = true;
							if(slowMove == null) {
								slowMove = false;
							}
							var moveToX = random_Random.getInt(4,6);
							if(slowMove) {
								var citizen1 = citizen;
								var pool = pooling_Int32ArrayPool.pool;
								var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
								arr[0] = 12;
								arr[1] = 50;
								arr[2] = 4;
								arr[3] = moveToX;
								citizen1.setPath(arr,0,4,true);
							} else {
								var citizen1 = citizen;
								var pool = pooling_Int32ArrayPool.pool;
								var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
								arr[0] = 4;
								arr[1] = moveToX;
								citizen1.setPath(arr,0,2,true);
							}
							citizen.pathEndFunction = function() {
								var citizen1 = citizen;
								var pool = pooling_Int32ArrayPool.pool;
								var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
								arr[0] = 8;
								arr[1] = random_Random.getInt(30,60);
								citizen1.setPath(arr,0,2,true);
								citizen.pathEndFunction = function() {
									citizen.changeFloor();
								};
								citizen.pathOnlyRelatedTo = citizen.inPermanent;
							};
							citizen.pathOnlyRelatedTo = citizen.inPermanent;
						};
						citizen.pathOnlyRelatedTo = citizen.inPermanent;
					};
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
				});
			} else {
				var citizen1 = citizen;
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 8;
				arr[1] = random_Random.getInt(30,60);
				citizen1.setPath(arr,0,2,true);
				citizen.pathEndFunction = null;
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
			}
		} else {
			var moveToX = random_Random.getInt(4,6);
			var citizen1 = citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = moveToX;
			citizen1.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ModernArtMuseum.saveDefinition);
		}
		var value = this.currentTexture;
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
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentTexture")) {
			this.currentTexture = loadMap.h["currentTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_ModernArtMuseum
});
