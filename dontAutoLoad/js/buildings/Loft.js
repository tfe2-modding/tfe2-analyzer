var buildings_Loft = $hxClasses["buildings.Loft"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.interior = 0;
	this.mirrored = false;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.doorX = 14;
	this.interiorSprites = Resources.getTexturesByWidth("spr_loft_furnishings",20);
	this.interior = random_Random.getInt(this.interiorSprites.length);
	this.isEntertainment = true;
};
buildings_Loft.__name__ = "buildings.Loft";
buildings_Loft.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_Loft.__super__ = buildings_House;
buildings_Loft.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_SoundProofing];
	}
	,get_baseAttractiveness: function() {
		return 88;
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_CustomizableBuildingDrawer;
	}
	,get_customizableDrawer: function() {
		return this.drawer;
	}
	,get_baseEntertainmentCapacity: function() {
		return this.residents.length * 5;
	}
	,get_isOpen: function() {
		return false;
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
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 1.5;
	}
	,get_entertainmentQuality: function() {
		return 100;
	}
	,get_isOpenForExistingVisitors: function() {
		return false;
	}
	,finishEntertainment: function(citizen,timeMod) {
		return true;
	}
	,postLoad: function() {
		if(this.mirrored) {
			this.mirror();
			this.mirrored = true;
		}
	}
	,postCreate: function() {
		buildings_House.prototype.postCreate.call(this);
		this.get_customizableDrawer().setCustomTextures(null,null,this.interiorSprites[this.interior]);
	}
	,beEntertained: function(citizen,timeMod) {
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(200,240),null,modifyWithHappiness,slowMove);
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
	,walkAround: function(citizen,stepsInBuilding) {
		if(this.mirrored) {
			if(citizen.relativeY < 5) {
				if(citizen.relativeX >= 5 || random_Random.getFloat() < 0.5) {
					citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(60,90),null,false,false);
				}
			}
		} else if(citizen.relativeY < 5) {
			if(citizen.relativeX < 14 || random_Random.getFloat() < 0.5) {
				citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(60,90),null,false,false);
			}
		}
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_FullSizeTextButton.create(this.city.gui,$bind(this,this.mirror),this.city.gui.windowInner,function() {
			return common_Localize.lo("mirror");
		},this.city.gui.innerWindowStage);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.interior;
		},function(t) {
			_gthis.interior = t;
			_gthis.get_customizableDrawer().setCustomTextures(null,null,_gthis.interiorSprites[_gthis.interior]);
		},function() {
			return _gthis.interiorSprites.length;
		},common_Localize.lo("change_interior"));
		buildings_House.prototype.createWindowAddBottomButtons.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Loft.saveDefinition);
		}
		var value = this.mirrored;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.interior;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_House.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mirrored")) {
			this.mirrored = loadMap.h["mirrored"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"interior")) {
			this.interior = loadMap.h["interior"];
		}
		this.postLoad();
	}
	,__class__: buildings_Loft
});
