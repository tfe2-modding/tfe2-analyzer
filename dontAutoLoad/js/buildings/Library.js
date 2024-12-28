var buildings_Library = $hxClasses["buildings.Library"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 14;
	this.endTime = 22;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_Library.__name__ = "buildings.Library";
buildings_Library.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_Library.__super__ = buildings_Work;
buildings_Library.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return 0;
	}
	,get_isOpen: function() {
		if(this.workers.length == 1 && this.workers[0].currentAction == 0) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = this.startTime - this.workTimePreferenceMod;
			if(start < 22) {
				if(this1 >= start) {
					return this1 < 22;
				} else {
					return false;
				}
			} else if(!(this1 >= start)) {
				return this1 < 22;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 5;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 2;
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
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
	}
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			if(citizen.relativeY < 5) {
				citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(30,60),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(30,60),null,false,false);
			}
		};
		if(random_Random.getInt(2) == 1) {
			citizen.changeFloor(moveFunction);
		} else {
			var citizen1 = citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(120,180);
			citizen1.setPath(arr,0,2,true);
			citizen.pathEndFunction = moveFunction;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
		if(!citizen.hasBuildingInited) {
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + 0.025,1.5),citizen.educationLevel);
			citizen.hasBuildingInited = true;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && this.city.simulation.time.timeSinceStart / 60 % 24 > 22) {
			citizen.currentAction = 2;
		} else {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(12 - citizen.relativeX) < spd) {
				citizen.relativeX = 12;
			} else {
				var num = 12 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
		}
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		buildings_Work.prototype.createMainWindowPart.call(this);
		var gui = this.city.gui;
		var materialsToPay2 = new Materials(5000,0,0,0,0,0,250);
		if(this.city.progress.unlocks.getUnlockState(buildings_LibraryOfTheKey) != progress_UnlockState.Researched) {
			materialsToPay2.knowledge = 50000;
		}
		var mission = this.city.progress.sideQuests.findSidequestWithType(progress_sidequests_SecretLibraryMission);
		var completedMission = this.city.progress.sideQuests.findCompletedSidequestWithType(progress_sidequests_SecretLibraryMission);
		if((mission != null || completedMission != null) && !this.is(buildings_LibraryOfTheKey) && (this.city.getAmountOfPermanentsPerType().h["buildings.LibraryOfTheKey"] == null || this.city.getAmountOfPermanentsPerType().h["buildings.LibraryOfTheKey"] == 0)) {
			var houseBuildButton = gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
				if(_gthis.city.materials.canAfford(materialsToPay2)) {
					_gthis.city.materials.remove(materialsToPay2);
					_gthis.destroyForReplacement();
					var newBuilding = _gthis.world.build(buildings_LibraryOfTheKey,_gthis.worldPosition.x,_gthis.worldPosition.y);
					_gthis.city.onBuildBuilding(false,true,newBuilding,buildings_LibraryOfTheKey,_gthis.worldPosition.y,_gthis.world.permanents[_gthis.worldPosition.x]);
					gui.closeWindow();
					newBuilding.showWindow();
					if(mission != null) {
						_gthis.city.progress.sideQuests.completeSidequest(mission);
					}
				}
			},common_Localize.lo("build_secret_society_library"),common_Localize.lo("build_secret_society_library_description"),this.city.gui.windowInner);
			var infoContainer = houseBuildButton.container;
			var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
			var mcd = new gui_MaterialsCostDisplay(this.city,materialsToPay2,"");
			mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : 2},$bind(mcd,mcd.updateCostDisplay)));
			mcd.setCost(materialsToPay2);
			infoContainer.addChild(mcdContainer);
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Library.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_Library
});
