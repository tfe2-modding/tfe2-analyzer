var buildings_RedwoodTree = $hxClasses["buildings.RedwoodTree"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.lastExpanded = city.simulation.time.timeSinceStart;
	this.subImageIfRelevant = random_Random.getInt(4,7);
	this.doorX = 9;
	this.isEntertainment = true;
	this.hasGrass = false;
	this.isPrimary = true;
	this.isRooftopBuilding = true;
};
buildings_RedwoodTree.__name__ = "buildings.RedwoodTree";
buildings_RedwoodTree.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_RedwoodTree.__super__ = Building;
buildings_RedwoodTree.prototype = $extend(Building.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_DecorationBuildingDrawer;
	}
	,get_decorationDrawer: function() {
		return this.drawer;
	}
	,get_baseEntertainmentCapacity: function() {
		return 30;
	}
	,get_isOpen: function() {
		return false;
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 3;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 4;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 1.5;
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
	,get_primaryRedwood: function() {
		var bld = this;
		while(bld.topBuilding != null && bld.topBuilding.is(buildings_RedwoodTree)) bld = bld.topBuilding;
		return bld;
	}
	,postLoad: function() {
		this.isRooftopBuilding = this.isPrimary;
	}
	,postCreate: function() {
		if(this.get_primaryRedwood() == this) {
			this.isRooftopBuilding = true;
		} else {
			this.isRooftopBuilding = false;
		}
		this.updateSprite();
	}
	,updateSprite: function() {
		var img = this.subImageIfRelevant;
		if(this.topBuilding == null && this.bottomBuilding == null) {
			img = this.hasGrass ? 9 : 0;
		} else if(this.topBuilding != null && this.topBuilding.topBuilding == null && this.bottomBuilding == null) {
			img = this.hasGrass ? 10 : 1;
		} else if(this.topBuilding == null && this.bottomBuilding != null && this.bottomBuilding.bottomBuilding == null) {
			img = 2;
		} else if(this.bottomBuilding == null) {
			img = this.hasGrass ? 11 : 3;
		} else if(this.topBuilding == null) {
			img = 8;
		} else if(this.topBuilding.topBuilding == null) {
			img = 7;
		}
		this.get_decorationDrawer().changeSubImage(img);
	}
	,doForWholeTrunk: function(func) {
		var rw = this.get_primaryRedwood();
		while(rw != null) {
			func(rw);
			if(rw.is(buildings_RedwoodTree)) {
				rw = rw.bottomBuilding;
			}
		}
	}
	,canBuildAbove: function() {
		if(this == this.get_primaryRedwood()) {
			if(this.world.permanents[this.worldPosition.x].length <= this.worldPosition.y || this.world.permanents[this.worldPosition.x][this.worldPosition.y + 1] == null) {
				return !this.city.miscCityElements.isUnbuildable(new common_Point(this.position.x,this.position.y - 20),true);
			} else {
				return false;
			}
		}
		return this.get_primaryRedwood().canBuildAbove();
	}
	,destroy: function() {
		var _gthis = this;
		var otherRw = null;
		if(this == this.get_primaryRedwood()) {
			if(this.bottomBuilding != null && this.bottomBuilding.is(buildings_RedwoodTree)) {
				this.bottomBuilding.isRooftopBuilding = true;
				this.bottomBuilding.isPrimary = true;
				otherRw = this.bottomBuilding;
			}
		} else {
			otherRw = this.get_primaryRedwood();
		}
		Building.prototype.destroy.call(this);
		if(otherRw != null) {
			var _this = this;
			otherRw.doForWholeTrunk(function(rw) {
				if(rw != _this) {
					rw.updateSprite();
				}
			});
			otherRw.doForWholeTrunk(function(rw) {
				if(_gthis.city.gui.windowRelatedTo == rw) {
					_gthis.city.gui.reloadWindow();
				}
			});
		}
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		Building.prototype.createMainWindowPart.call(this);
		var gui = this.city.gui;
		if(!this.is(buildings_RedwoodTreeHouse)) {
			if(this.topBuilding != null && this.bottomBuilding != null && this.topBuilding.topBuilding != null) {
				gui_windowParts_CycleValueButton.create(this.city.gui,function() {
					return _gthis.subImageIfRelevant - 4;
				},function(t) {
					_gthis.subImageIfRelevant = t + 4;
					_gthis.updateSprite();
				},function() {
					return 3;
				},common_Localize.lo("change_variant"));
				gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
			}
			if(this.bottomBuilding == null) {
				gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
					_gthis.hasGrass = !_gthis.hasGrass;
					_gthis.updateSprite();
				},this.city.gui.windowInner,function() {
					if(_gthis.hasGrass) {
						return common_Localize.lo("remove_grass");
					}
					return common_Localize.lo("add_grass");
				},gui.innerWindowStage);
				gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
			}
		}
		var materialsToPay = new Materials(100,0,50,0,0);
		var materialsToPay2 = new Materials(50,0,0,20,0,10);
		if(this.city.progress.unlocks.getUnlockState(buildings_RedwoodTreeHouse) != progress_UnlockState.Researched) {
			materialsToPay2.knowledge = 2500;
		}
		if(this.city.simulation.time.timeSinceStart > this.get_primaryRedwood().lastExpanded + 1440) {
			var redwoodBuildButton = gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
				if(_gthis.city.materials.canAfford(materialsToPay) && _gthis.canBuildAbove()) {
					_gthis.city.materials.remove(materialsToPay);
					_gthis.get_primaryRedwood().isRooftopBuilding = false;
					_gthis.get_primaryRedwood().isPrimary = false;
					var newBuilding = _gthis.world.build(buildings_RedwoodTree,_gthis.worldPosition.x,_gthis.get_primaryRedwood().worldPosition.y + 1);
					newBuilding.isRooftopBuilding = true;
					newBuilding.isPrimary = true;
					_gthis.city.onBuildBuilding(false,false,newBuilding,buildings_RedwoodTree,_gthis.get_primaryRedwood().worldPosition.y + 1,_gthis.world.permanents[_gthis.worldPosition.x]);
					var pleaseCountTheHeightOfThisRedwoodSoICanAddAnotherAchievement = 0;
					_gthis.doForWholeTrunk(function(rw) {
						rw.updateSprite();
						pleaseCountTheHeightOfThisRedwoodSoICanAddAnotherAchievement += 1;
					});
					if(pleaseCountTheHeightOfThisRedwoodSoICanAddAnotherAchievement >= 20) {
						common_Achievements.achieve("TALL_REDWOOD");
					}
					_gthis.reloadWindow();
				}
			},common_Localize.lo("build_redwood"),common_Localize.lo("build_redwood_description"),this.city.gui.windowInner);
			var infoContainer = redwoodBuildButton.container;
			var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
			var mcd = new gui_MaterialsCostDisplay(this.city,materialsToPay,"");
			mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : 2},$bind(mcd,mcd.updateCostDisplay)));
			mcd.setCost(materialsToPay);
			infoContainer.addChild(mcdContainer);
		} else {
			gui.windowAddInfoText(null,function() {
				if(_gthis.city.simulation.time.timeSinceStart > _gthis.get_primaryRedwood().lastExpanded + 1440) {
					gui.reloadWindow();
				}
				var hrs = Math.ceil(24 - (_gthis.city.simulation.time.timeSinceStart - _gthis.get_primaryRedwood().lastExpanded) / 60);
				if(hrs <= 1) {
					return common_Localize.lo("build_redwood_wait_1");
				}
				return common_Localize.lo("build_redwood_wait",[hrs]);
			});
		}
		if(!this.is(buildings_RedwoodTreeHouse) && this.canBuildHouseHere()) {
			var houseBuildButton = gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
				if(_gthis.city.materials.canAfford(materialsToPay2) && _gthis.canBuildHouseHere()) {
					_gthis.city.materials.remove(materialsToPay2);
					_gthis.destroyForReplacement();
					var newBuilding = _gthis.world.build(buildings_RedwoodTreeHouse,_gthis.worldPosition.x,_gthis.worldPosition.y);
					newBuilding.isPrimary = false;
					newBuilding.isRooftopBuilding = false;
					_gthis.city.onBuildBuilding(false,true,newBuilding,buildings_RedwoodTreeHouse,_gthis.worldPosition.y,_gthis.world.permanents[_gthis.worldPosition.x]);
					gui.closeWindow();
					newBuilding.showWindow();
				}
			},common_Localize.lo("build_redwood_house"),common_Localize.lo("build_redwood_house_description"),this.city.gui.windowInner);
			var infoContainer = houseBuildButton.container;
			var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
			var mcd = new gui_MaterialsCostDisplay(this.city,materialsToPay2,"");
			mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : 2},$bind(mcd,mcd.updateCostDisplay)));
			mcd.setCost(materialsToPay2);
			infoContainer.addChild(mcdContainer);
		} else if(this.is(buildings_RedwoodTreeHouse)) {
			gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
				var houseRefund = materialsToPay2.copy();
				houseRefund.multiply(_gthis.city.upgrades.vars.recyclingAmount);
				_gthis.city.materials.add(houseRefund);
				_gthis.destroyForReplacement();
				var newBuilding = _gthis.world.build(buildings_RedwoodTree,_gthis.worldPosition.x,_gthis.worldPosition.y);
				newBuilding.isPrimary = false;
				newBuilding.isRooftopBuilding = false;
				_gthis.city.onBuildBuilding(false,true,newBuilding,buildings_RedwoodTree,_gthis.worldPosition.y,_gthis.world.permanents[_gthis.worldPosition.x]);
				gui.closeWindow();
				newBuilding.showWindow();
			},common_Localize.lo("remove_redwood_house"),"",this.city.gui.windowInner);
		}
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
		this.city.gui.windowAddInfoText(common_Localize.lo("redwoodtree_credits"));
	}
	,canBuildHouseHere: function() {
		if(this.topBuilding != null && this.topBuilding.topBuilding != null) {
			return this.bottomBuilding != null;
		} else {
			return false;
		}
	}
	,tryDestroy: function(warnIfNot) {
		if(warnIfNot == null) {
			warnIfNot = true;
		}
		if(this.topBuilding == null && this.bottomBuilding != null && this.bottomBuilding.bottomBuilding != null && this.bottomBuilding.bottomBuilding.is(buildings_RedwoodTreeHouse) || this.topBuilding != null && this.topBuilding.topBuilding == null && this.bottomBuilding != null && this.bottomBuilding.is(buildings_RedwoodTreeHouse) || this.bottomBuilding == null && this.topBuilding != null && this.topBuilding.is(buildings_RedwoodTreeHouse)) {
			if(warnIfNot) {
				this.city.gui.showSimpleWindow(common_Localize.lo("redwoodtree_cannot_destroy_because_house_limits"),null,true,true);
			}
			return false;
		}
		return Building.prototype.tryDestroy.call(this,warnIfNot);
	}
	,beEntertained: function(citizen,timeMod) {
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_RedwoodTree.saveDefinition);
		}
		var value = this.lastExpanded;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.subImageIfRelevant;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.isPrimary;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.hasGrass;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastExpanded")) {
			this.lastExpanded = loadMap.h["lastExpanded"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"subImageIfRelevant")) {
			this.subImageIfRelevant = loadMap.h["subImageIfRelevant"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"isPrimary")) {
			this.isPrimary = loadMap.h["isPrimary"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hasGrass")) {
			this.hasGrass = loadMap.h["hasGrass"];
		}
		this.postLoad();
	}
	,__class__: buildings_RedwoodTree
});
