var buildings_RooftopDecoration4 = $hxClasses["buildings.RooftopDecoration4"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.currentRecolor = -1;
	this.currentTexture = 0;
	this.mirrored = false;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_RooftopDecoration4.__name__ = "buildings.RooftopDecoration4";
buildings_RooftopDecoration4.__interfaces__ = [buildings_IRecolorableOnBuild,buildings_ICustomizableOnBuild];
buildings_RooftopDecoration4.__super__ = Building;
buildings_RooftopDecoration4.prototype = $extend(Building.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_DecorationBuildingDrawer;
	}
	,get_decorationDrawer: function() {
		return this.drawer;
	}
	,areSameCustomizations: function(appearance,mirror,color) {
		if(this.currentTexture == appearance) {
			return this.currentRecolor == color;
		} else {
			return false;
		}
	}
	,customize: function(appearance,mirror) {
		this.currentTexture = appearance;
		this.mirrored = mirror;
	}
	,customizeColor: function(color) {
		this.currentRecolor = color;
	}
	,createOrRemoveBuilderForThis: function() {
		this.city.createOrRemoveBuilder(js_Boot.getClass(this),true,this.currentTexture,this.mirrored,this.currentRecolor);
	}
	,postCreate: function() {
		if(this.mirrored) {
			this.mirror();
			this.mirrored = true;
		}
		this.get_decorationDrawer().changeSubImage(this.currentTexture);
		this.get_decorationDrawer().setTint(this.currentRecolor);
	}
	,mirror: function() {
		this.mirrored = !this.mirrored;
		this.drawer.mirror();
		if(this.mirrored) {
			this.doorX = 14;
		} else {
			this.doorX = 4;
		}
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		if(this.currentRecolor == -1) {
			gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.currentTexture;
			},function(t) {
				_gthis.currentTexture = t;
				_gthis.get_decorationDrawer().changeSubImage(t);
			},function() {
				return _gthis.get_decorationDrawer().getSubImageNumber() - 1;
			},common_Localize.lo("change_building_color"));
		} else {
			gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
				gui_ColorPicker.colorPicked = _gthis.currentRecolor;
				gui_ColorPickerWindow.createWindow(_gthis.city,function(pickedCol) {
					_gthis.currentRecolor = pickedCol;
					_gthis.get_decorationDrawer().setTint(_gthis.currentRecolor);
				});
			},this.city.gui.windowInner,function() {
				return common_Localize.lo("change_building_color");
			},this.city.gui.innerWindowStage);
			this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
			gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
				_gthis.createOrRemoveBuilderForThis();
				_gthis.city.gui.closeWindow();
			},this.city.gui.windowInner,function() {
				return common_Localize.lo("duplicate_building");
			},this.city.gui.innerWindowStage);
		}
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		Building.prototype.createWindowAddBottomButtons.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_RooftopDecoration4.saveDefinition);
		}
		var value = this.mirrored;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.currentTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.currentRecolor;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mirrored")) {
			this.mirrored = loadMap.h["mirrored"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentTexture")) {
			this.currentTexture = loadMap.h["currentTexture"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentRecolor")) {
			this.currentRecolor = loadMap.h["currentRecolor"];
		}
	}
	,__class__: buildings_RooftopDecoration4
});
