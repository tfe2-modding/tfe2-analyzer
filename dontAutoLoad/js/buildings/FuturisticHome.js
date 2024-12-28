var buildings_FuturisticHome = $hxClasses["buildings.FuturisticHome"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.interior = 0;
	this.mirrored = false;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.isMedical = true;
	this.interiorSprites = Resources.getTexturesByWidth("spr_futuristichome_interiors",20);
	this.interior = random_Random.getInt(this.interiorSprites.length);
};
buildings_FuturisticHome.__name__ = "buildings.FuturisticHome";
buildings_FuturisticHome.__interfaces__ = [buildings_IMedicalBuilding];
buildings_FuturisticHome.__super__ = buildings_House;
buildings_FuturisticHome.prototype = $extend(buildings_House.prototype,{
	get_medicalQuality: function() {
		return 100;
	}
	,get_medicalCapacity: function() {
		return this.residents.length;
	}
	,get_medicalTypeLimit: function() {
		return 1;
	}
	,get_medicalTypeID: function() {
		return 0;
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_CustomizableBuildingDrawer;
	}
	,get_customizableDrawer: function() {
		return this.drawer;
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
	,mirror: function() {
		this.mirrored = !this.mirrored;
		this.drawer.mirror();
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
	,walkAround: function(citizen,stepsInBuilding) {
		if(!citizen.hasBuildingInited) {
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + 0.005,1.2),citizen.educationLevel);
			citizen.hasBuildingInited = true;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_FuturisticHome.saveDefinition);
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
	,__class__: buildings_FuturisticHome
});
