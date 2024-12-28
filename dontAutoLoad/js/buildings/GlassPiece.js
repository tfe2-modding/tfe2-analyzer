var buildings_GlassPiece = $hxClasses["buildings.GlassPiece"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.currentTexture = 0;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_GlassPiece.__name__ = "buildings.GlassPiece";
buildings_GlassPiece.__interfaces__ = [buildings_ICustomizableOnBuild];
buildings_GlassPiece.__super__ = Building;
buildings_GlassPiece.prototype = $extend(Building.prototype,{
	customize: function(appearance,mirror) {
		this.currentTexture = appearance;
		this.setAppearance();
	}
	,createOrRemoveBuilderForThis: function() {
		this.city.createOrRemoveBuilder(js_Boot.getClass(this),true,this.currentTexture);
	}
	,areSameCustomizations: function(appearance,mirror,color) {
		return this.currentTexture == appearance;
	}
	,postLoad: function() {
		this.setAppearance();
	}
	,setAppearance: function() {
		var mainTexture;
		switch(this.currentTexture) {
		case 0:
			mainTexture = "spr_indoorfarm";
			break;
		case 1:
			mainTexture = "spr_treeplantation";
			break;
		default:
			mainTexture = "";
		}
		this.drawer.changeMainTexture(mainTexture);
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.currentTexture;
		},function(t) {
			_gthis.currentTexture = t;
			_gthis.setAppearance();
		},function() {
			return 2;
		},common_Localize.lo("change_building_color"));
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		Building.prototype.createWindowAddBottomButtons.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_GlassPiece.saveDefinition);
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
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentTexture")) {
			this.currentTexture = loadMap.h["currentTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_GlassPiece
});
