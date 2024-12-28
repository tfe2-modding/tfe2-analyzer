var buildings_Teleporter = $hxClasses["buildings.Teleporter"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.teleportX = 9.;
	this.timesUsedTo = 0;
	this.timesUsed = 0;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.doorX = 12;
	city.teleporters.push(this);
};
buildings_Teleporter.__name__ = "buildings.Teleporter";
buildings_Teleporter.createUpkeepInfo = function(city,cityGUI) {
	cityGUI.windowInner.addChild(new gui_GUISpacing(cityGUI.windowInner,new common_Point(2,4)));
	cityGUI.windowAddInfoText(null,function() {
		return common_Localize.lo("teleporters_operating_cost",[Math.round(city.simulation.operatingCost.getWholeCityOperatingCostTeleporters().knowledge)]);
	});
	var button = gui_windowParts_FullSizeTextButton.create(cityGUI,function() {
		if(!(!city.simulation.operatingCost.teleportersEnabled && city.simulation.operatingCost.teleportersAreUserEnabled)) {
			city.simulation.operatingCost.changeTeleportersEnabledState(!city.simulation.operatingCost.teleportersEnabled,true);
		} else if(city.simulation.operatingCost.teleportersAreUserEnabled) {
			city.simulation.operatingCost.changeTeleportersEnabledState(false,true);
		} else {
			cityGUI.showSimpleWindow(common_Localize.lo("cant_enable_teleporters"),null,true);
		}
	},cityGUI.windowInner,function() {
		if(city.simulation.operatingCost.teleportersEnabled) {
			return common_Localize.lo("disable_all_teleporters");
		} else if(city.simulation.operatingCost.teleportersAreUserEnabled) {
			return common_Localize.lo("keep_teleporters_disabled");
		} else {
			return common_Localize.lo("enable_all_teleporters");
		}
	},cityGUI.innerWindowStage);
	cityGUI.windowInner.addChild(new gui_GUISpacing(cityGUI.windowInner,new common_Point(2,4)));
};
buildings_Teleporter.__super__ = Building;
buildings_Teleporter.prototype = $extend(Building.prototype,{
	get_typeID: function() {
		return 1;
	}
	,destroy: function() {
		HxOverrides.remove(this.city.teleporters,this);
		Building.prototype.destroy.call(this);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		Building.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("teleported_from",[_gthis.timesUsed]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("teleported_to",[_gthis.timesUsedTo]);
		});
		buildings_Teleporter.createUpkeepInfo(this.city,this.city.gui);
	}
	,createTeleportParticle: function(rayTexture) {
		if(rayTexture == null) {
			rayTexture = "spr_teleporter_ray";
		}
		this.city.particles.addParticle(Resources.getTexturesByWidth(rayTexture,4),new common_Point(this.position.x + 8,this.position.y + 4));
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Teleporter.saveDefinition);
		}
		var value = this.timesUsed;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.timesUsedTo;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsed")) {
			this.timesUsed = loadMap.h["timesUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsedTo")) {
			this.timesUsedTo = loadMap.h["timesUsedTo"];
		}
	}
	,__class__: buildings_Teleporter
});
