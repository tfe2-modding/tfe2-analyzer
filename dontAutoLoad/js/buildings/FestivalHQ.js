var buildings_FestivalHQ = $hxClasses["buildings.FestivalHQ"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.doorX = 14;
	this.festivalCoolDown = 0;
};
buildings_FestivalHQ.__name__ = "buildings.FestivalHQ";
buildings_FestivalHQ.__super__ = buildings_Work;
buildings_FestivalHQ.prototype = $extend(buildings_Work.prototype,{
	onBuild: function() {
		buildings_Work.prototype.onBuild.call(this);
		common_Achievements.achieve("BUILD_FESTIVAL_HQ");
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		if(citizen.relativeY > 5) {
			if(random_Random.getFloat(1) < 0.5) {
				citizen.changeFloor(function() {
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 8;
					arr[1] = random_Random.getInt(50,100);
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
				});
			} else {
				citizen.moveAndWait(random_Random.fromArray([3,4,5,6,12,13,14,15]),random_Random.getInt(50,100));
			}
		} else if(random_Random.getFloat(1) < 0.3) {
			citizen.changeFloor(function() {
				var citizen1 = citizen;
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 8;
				arr[1] = random_Random.getInt(50,100);
				citizen1.setPath(arr,0,2,true);
				citizen.pathEndFunction = null;
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
			});
		} else {
			citizen.moveAndWait(random_Random.fromArray([3,8,13,14]),random_Random.getInt(50,100));
		}
	}
	,update: function(timeMod) {
		if(this.festivalCoolDown > -1) {
			this.festivalCoolDown -= timeMod * (this.workers.length / this.get_jobs()) * this.city.simulation.time.minutesPerTick;
		}
	}
	,getMusicFestivalMTP: function() {
		return new Materials(this.city.simulation.citizens.length,0,this.city.simulation.citizens.length * 3);
	}
	,getHundredFestivalMTP: function() {
		return new Materials(0,0,this.city.simulation.citizens.length * 2);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		var shouldShowCreationOptions = function() {
			if(_gthis.city.simulation.festivalManager.hasNoPlannedFestival() && _gthis.festivalCoolDown < 0) {
				return _gthis.city.simulation.festivalManager.festivalCoolDown < 0;
			} else {
				return false;
			}
		};
		buildings_Work.prototype.addWindowInfoLines.call(this);
		var gui = this.city.gui;
		var windowDisplayType = 0;
		var festivalContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
		festivalContainer.fillSecondarySize = true;
		festivalContainer.direction = gui_GUIContainerDirection.Vertical;
		gui.windowInner.addChild(festivalContainer);
		var showFestivalCreationOptions;
		var showCurrentFestivalInfo = function() {
			festivalContainer.clear();
			festivalContainer.addChild(new gui_GUISpacing(festivalContainer,new common_Point(0,3)));
			festivalContainer.addChild(new gui_TextElement(festivalContainer,gui.innerWindowStage,null,function() {
				var fm = _gthis.city.simulation.festivalManager;
				if(fm.hasFestival()) {
					return common_Localize.lo("current_festival");
				}
				if(fm.plannedFestival() != null) {
					return common_Localize.lo("planned_festival");
				}
				return common_Localize.lo("preparing");
			},"Arial15"));
			festivalContainer.addChild(new gui_TextElement(festivalContainer,gui.innerWindowStage,null,function() {
				var fm = _gthis.city.simulation.festivalManager;
				if(fm.hasFestival()) {
					return fm.currentFestival().getText();
				}
				if(fm.plannedFestival() != null) {
					return fm.plannedFestival().getText();
				}
				if(_gthis.workers.length == 0) {
					return common_Localize.lo("assign_workers_to_prepare");
				}
				var hireMoreText = "";
				if(_gthis.workers.length < _gthis.get_jobs()) {
					hireMoreText = " " + common_Localize.lo("assign_more_to_speed_up");
				}
				return common_StringExtensions.firstToUpper(CityTime.getBasicTimeString(Math.max(_gthis.festivalCoolDown,_gthis.city.simulation.festivalManager.festivalCoolDown) * (_gthis.get_jobs() / _gthis.workers.length))) + " of preparation left." + hireMoreText;
			}));
			gui.window.onUpdate = function() {
				if(shouldShowCreationOptions()) {
					showFestivalCreationOptions();
				}
			};
		};
		showFestivalCreationOptions = function() {
			festivalContainer.clear();
			var headerContainer = gui_UpgradeWindowParts.createHeader(gui,common_Localize.lo("organize_a_festival"),festivalContainer);
			var infoContainerInfo = gui_UpgradeWindowParts.createActivatableButton(_gthis.city.gui,false,function() {
				var mtp = _gthis.getMusicFestivalMTP();
				if(_gthis.city.materials.canAfford(mtp) && _gthis.city.simulation.festivalManager.hasNoPlannedFestival() && simulation_festival_MusicFestival.canDo(_gthis.city,_gthis.city.simulation,_gthis)) {
					_gthis.city.materials.remove(mtp);
					var musicFestival = new simulation_festival_MusicFestival(_gthis.city,_gthis.city.simulation,_gthis.city.simulation.festivalManager,_gthis);
					musicFestival.plan();
					_gthis.city.simulation.festivalManager.addFestival(musicFestival);
					_gthis.festivalCoolDown += 8783.9999999999982;
					_gthis.city.simulation.festivalManager.festivalCoolDown = _gthis.festivalCoolDown;
					showCurrentFestivalInfo();
				} else {
					var createWarningWindow = function() {
						_gthis.city.gui.showSimpleWindow(common_Localize.lo("cant_organize"),null,true);
					};
					createWarningWindow();
					_gthis.city.gui.addWindowToStack(createWarningWindow);
				}
			},common_Localize.lo("music_festival"),common_Localize.lo("music_festival_help"),festivalContainer);
			var materialsToPay = _gthis.getMusicFestivalMTP();
			var infoContainer = infoContainerInfo.container;
			var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
			var mcd = new gui_MaterialsCostDisplay(_gthis.city,materialsToPay,"");
			mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? materialsToPay.knowledge == 0 ? 0 : 1 : 2},$bind(mcd,mcd.updateCostDisplay)));
			gui.window.onUpdate = function() {
				var materialsToPay = _gthis.getMusicFestivalMTP();
				mcd.setCost(materialsToPay);
			};
			infoContainer.addChild(mcdContainer);
			festivalContainer.addChild(new gui_GUISpacing(festivalContainer,new common_Point(0,3)));
		};
		if(shouldShowCreationOptions()) {
			showFestivalCreationOptions();
		} else {
			showCurrentFestivalInfo();
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		var _g = 0;
		var _g1 = this.city.simulation.festivalManager.festivals;
		while(_g < _g1.length) {
			var fes = _g1[_g];
			++_g;
			this.city.simulation.festivalManager.endFestival(fes);
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_FestivalHQ.saveDefinition);
		}
		var value = this.festivalCoolDown;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"festivalCoolDown")) {
			this.festivalCoolDown = loadMap.h["festivalCoolDown"];
		}
	}
	,__class__: buildings_FestivalHQ
});
