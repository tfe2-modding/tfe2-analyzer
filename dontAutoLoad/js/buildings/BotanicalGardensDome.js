var buildings_BotanicalGardensDome = $hxClasses["buildings.BotanicalGardensDome"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.currentDomeVersion = 0;
	buildings_BotanicalGardens.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.drawer.mergeClass = buildings_BotanicalGardens;
	this.drawer.changeTextureGroup("spr_botanicalgardens");
};
buildings_BotanicalGardensDome.__name__ = "buildings.BotanicalGardensDome";
buildings_BotanicalGardensDome.__super__ = buildings_BotanicalGardens;
buildings_BotanicalGardensDome.prototype = $extend(buildings_BotanicalGardens.prototype,{
	get_mainTextures: function() {
		if(this.currentDomeVersion == 0) {
			return ["spr_dome_botanicalgarden","spr_dome_botanicalgarden_alt1","spr_dome_botanicalgarden_alt2"];
		} else {
			return ["spr_dome_botanicalgarden_b","spr_dome_botanicalgarden_alt1b","spr_dome_botanicalgarden_alt2b"];
		}
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_RooftopDownMergingDrawer;
	}
	,updateGardenTexture: function() {
		var _gthis = this;
		this.get_mergingDrawer().setSecondaryBackgroundImages("spr_dome_botanicalgarden_plants",this.gardenTextureSets,this.currentTexture,function(n) {
			_gthis.currentTexture = n;
		});
	}
	,postLoad: function() {
		buildings_BotanicalGardens.prototype.postLoad.call(this);
		this.drawer.changeTextureGroup(buildings_BotanicalGardensDome.mainTexturesNonDome[this.get_mainTextures().indexOf(this.get_mainTextures()[this.currentMainTexture])]);
	}
	,changeMainTexture: function(textureName) {
		buildings_BotanicalGardens.prototype.changeMainTexture.call(this,textureName);
		this.drawer.changeTextureGroup(buildings_BotanicalGardensDome.mainTexturesNonDome[this.get_mainTextures().indexOf(textureName)]);
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.currentDomeVersion;
		},function(t) {
			_gthis.currentDomeVersion = t;
			_gthis.changeMainTexture(_gthis.get_mainTextures()[_gthis.currentMainTexture]);
		},function() {
			return 2;
		},common_Localize.lo("change_dome_variant"));
		buildings_BotanicalGardens.prototype.createWindowAddBottomButtons.call(this);
	}
	,couldStandHere: function() {
		if(this.bottomBuilding != null) {
			return !this.bottomBuilding.is(buildings_BotanicalGardens);
		} else {
			return true;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_BotanicalGardens.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_BotanicalGardensDome.saveDefinition);
		}
		var value = this.currentDomeVersion;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_BotanicalGardens.prototype.load.call(this,queue);
		if(queue.version < 51) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentDomeVersion")) {
			this.currentDomeVersion = loadMap.h["currentDomeVersion"];
		}
		this.postLoad();
	}
	,__class__: buildings_BotanicalGardensDome
});
