var buildings_WizardHatCafe = $hxClasses["buildings.WizardHatCafe"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.mirrored = false;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 16;
	this.endTime = 2;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
	this.doorX = 8;
};
buildings_WizardHatCafe.__name__ = "buildings.WizardHatCafe";
buildings_WizardHatCafe.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_WizardHatCafe.__super__ = buildings_Work;
buildings_WizardHatCafe.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		var bec = 55;
		return this.workers.length * bec | 0;
	}
	,get_isOpen: function() {
		if(this.workers.length >= 1 && this.workers[0].currentAction == 0) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = this.startTime - this.workTimePreferenceMod;
			if(start < 0.5) {
				if(this1 >= start) {
					return this1 < 0.5;
				} else {
					return false;
				}
			} else if(!(this1 >= start)) {
				return this1 < 0.5;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 0;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 2;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 4;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 2;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 4;
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
	,createWindowAddBottomButtons: function() {
		gui_windowParts_FullSizeTextButton.create(this.city.gui,$bind(this,this.mirror),this.city.gui.windowInner,function() {
			return common_Localize.lo("mirror");
		},this.city.gui.innerWindowStage);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		buildings_Work.prototype.createWindowAddBottomButtons.call(this);
	}
	,postLoad: function() {
		if(this.mirrored) {
			this.mirror();
			this.mirrored = true;
		}
	}
	,mirror: function() {
		this.mirrored = !this.mirrored;
		this.drawer.mirror();
		if(this.mirrored) {
			this.doorX = 4;
		} else {
			this.doorX = 14;
		}
	}
	,beEntertained: function(citizen,timeMod) {
		citizen.moveAndWait(random_Random.getInt(7 + (this.mirrored ? 1 : 0),11 + (this.mirrored ? 1 : 0)),random_Random.getInt(60,90),null,false,false);
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && this.city.simulation.time.timeSinceStart / 60 % 24 > 0.5) {
			citizen.currentAction = 2;
		} else {
			citizen.moveAndWait(random_Random.getInt(7 + (this.mirrored ? 1 : 0),11 + (this.mirrored ? 1 : 0)),random_Random.getInt(120,180),null,false,false);
		}
		if(random_Random.getInt(35) == 0) {
			var spawnOnWorld = this.world;
			if(this.world.rect.height == 0 || this.world.rect.width < 70) {
				spawnOnWorld = common_ArrayExtensions.findRandom(this.city.worlds,function(w) {
					if(w.rect.height > 0) {
						return w.rect.width > 70;
					} else {
						return false;
					}
				});
			}
			if(spawnOnWorld != null) {
				this.city.simulation.frogs.addFrog(spawnOnWorld);
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_WizardHatCafe.saveDefinition);
		}
		var value = this.mirrored;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(queue.version < 57) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mirrored")) {
			this.mirrored = loadMap.h["mirrored"];
		}
		this.postLoad();
	}
	,__class__: buildings_WizardHatCafe
});
