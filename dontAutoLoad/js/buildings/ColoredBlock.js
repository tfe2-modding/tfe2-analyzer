var buildings_ColoredBlock = $hxClasses["buildings.ColoredBlock"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.textSprite = null;
	this.currentTextChar = -1;
	this.currentRecolor = -1;
	this.currentTexture = 0;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_ColoredBlock.__name__ = "buildings.ColoredBlock";
buildings_ColoredBlock.__interfaces__ = [buildings_IRecolorableOnBuild,buildings_ICustomizableOnBuild];
buildings_ColoredBlock.__super__ = Building;
buildings_ColoredBlock.prototype = $extend(Building.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_DecorationBuildingDrawer;
	}
	,get_decorationDrawer: function() {
		return this.drawer;
	}
	,customize: function(appearance,mirror) {
		this.currentTexture = appearance;
	}
	,customizeColor: function(color) {
		this.currentRecolor = color;
	}
	,areSameCustomizations: function(appearance,mirror,color) {
		if(this.currentTexture == appearance) {
			return this.currentRecolor == color;
		} else {
			return false;
		}
	}
	,createOrRemoveBuilderForThis: function() {
		this.city.createOrRemoveBuilder(js_Boot.getClass(this),true,this.currentTexture,null,this.currentRecolor);
	}
	,postCreate: function() {
		this.get_decorationDrawer().changeSubImage(this.currentTexture);
		this.get_decorationDrawer().setTint(this.currentRecolor);
		if(this.currentTextChar >= 0) {
			this.setTextSprite();
		}
	}
	,positionSprites: function() {
		Building.prototype.positionSprites.call(this);
		this.setTextSprite();
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		if(this.textSprite != null) {
			this.textSprite.destroy();
			this.textSprite = null;
		}
	}
	,setTextSprite: function() {
		if(this.currentTextChar >= 0 && this.textSprite == null) {
			var code = this.currentTextChar;
			this.textSprite = new graphics_BitmapText(String.fromCodePoint(code),{ font : "Arial18", tint : 0});
			this.textSprite.get_anchor().set(0.5,0.5);
			this.stage.addChild(this.textSprite);
		} else if(this.textSprite != null) {
			this.textSprite.destroy();
			this.textSprite = null;
		}
		if(this.textSprite != null) {
			var code = this.currentTextChar;
			this.textSprite.set_text(String.fromCodePoint(code));
			this.textSprite.position.set(this.position.x + 10,this.position.y + 6.5);
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
			queue.addString(buildings_ColoredBlock.saveDefinition);
		}
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
		var value = this.currentTextChar;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentRecolor")) {
			this.currentRecolor = loadMap.h["currentRecolor"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentTextChar")) {
			this.currentTextChar = loadMap.h["currentTextChar"];
		}
	}
	,__class__: buildings_ColoredBlock
});
