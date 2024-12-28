var gui_TextButton = $hxClasses["gui.TextButton"] = function(gui,stage,parent,action,text,isActive,onHover,buttonSpriteName,fontName) {
	if(fontName == null) {
		fontName = "Arial";
	}
	if(buttonSpriteName == null) {
		buttonSpriteName = "spr_button";
	}
	this.extraTextPosY = 0;
	this.extraHeight = 0;
	this.extraWidth = 0;
	this.extraElements = [];
	if(Main.isMobile) {
		this.extraHeight += 4;
		this.extraTextPosY += 2;
	}
	gui_Button.call(this,gui,stage,parent,action,isActive,onHover);
	this.buttonTextures = Resources.getTextures(buttonSpriteName,3);
	this.buttonPatch = new gui_NinePatch(this.buttonTextures[0],2,2,this.buttonTextures[0].height | 0);
	this.buttonPatch.texture = this.buttonTextures[1];
	this.buttonPatch.updateTextures(false);
	this.buttonPatch.texture = this.buttonTextures[2];
	this.buttonPatch.updateTextures(false);
	this.buttonPatch.setTextureSet(0);
	stage.addChild(this.buttonPatch);
	this.rect = new common_Rectangle(0,0,1,(this.buttonTextures[0].height | 0) + 2);
	var tinting = 0;
	if(StringTools.startsWith(text,"[white]")) {
		text = HxOverrides.substr(text,"[white]".length,null);
		tinting = 16777215;
	} else if(StringTools.startsWith(text,"[grayish]")) {
		text = HxOverrides.substr(text,"[grayish]".length,null);
		tinting = 12630990;
	}
	this.bitmapText = new graphics_BitmapText(text,{ font : fontName, tint : tinting});
	this.setText(text,false);
	stage.addChild(this.bitmapText);
};
gui_TextButton.__name__ = "gui.TextButton";
gui_TextButton.__super__ = gui_Button;
gui_TextButton.prototype = $extend(gui_Button.prototype,{
	setText: function(text,calculateSize) {
		if(calculateSize == null) {
			calculateSize = true;
		}
		if(text != null) {
			this.text = text;
		} else {
			text = this.text;
		}
		this.bitmapText.set_text(text);
		var tmp = Math.ceil(this.bitmapText.get_textWidth()) + 6 + this.extraWidth;
		var tmp1 = common_ArrayExtensions.isum(this.extraElements,function(e) {
			return e.rect.width;
		});
		this.rect.width = tmp + tmp1;
		var tmp = Math.ceil(this.bitmapText.get_textHeight());
		var tmp1 = this.bitmapText.get_fontName() == "Arial16" ? 6 : 3;
		this.rect.height = tmp + tmp1 + this.extraHeight;
		this.buttonPatch.npWidth = this.rect.width;
		this.buttonPatch.npHeight = this.rect.height;
		if(calculateSize) {
			this.updateSize();
		}
	}
	,updatePosition: function(newPosition) {
		var _this = this.rect;
		var inlPoint_x = _this.x = newPosition.x;
		var inlPoint_y = _this.y = newPosition.y;
		this.buttonPatch.position.set(newPosition.x,newPosition.y);
		this.buttonPatch.updateSprites();
		this.bitmapText.position.set(newPosition.x + 3 + (this.extraWidth / 2 | 0),newPosition.y + 1 + this.extraTextPosY);
		var startX = newPosition.x + 3 + (this.extraWidth / 2 | 0) + Math.ceil(this.bitmapText.get_textWidth());
		var _g = 0;
		var _g1 = this.extraElements;
		while(_g < _g1.length) {
			var elem = _g1[_g];
			++_g;
			elem.updatePosition(new common_Point(startX,newPosition.y + 1 + this.extraTextPosY));
			startX += elem.rect.width;
		}
		gui_Button.prototype.updatePosition.call(this,newPosition);
	}
	,fillWidth: function() {
		this.extraWidth = this.parent.rect.width - this.rect.width - 4;
		this.setText(this.text);
	}
	,handleMouse: function(mouse) {
		var _gthis = this;
		return gui_Button.prototype.doHandleMouse.call(this,mouse,function() {
			_gthis.buttonPatch.setTextureSet(1);
		},function() {
			_gthis.buttonPatch.setTextureSet(2);
		});
	}
	,update: function() {
		if(this.mouseOut) {
			this.buttonPatch.setTextureSet(0);
		}
		if(this.isActive()) {
			this.buttonPatch.setTextureSet(2);
		}
		gui_Button.prototype.update.call(this);
	}
	,destroy: function() {
		gui_Button.prototype.destroy.call(this);
		this.buttonPatch.destroy();
		this.bitmapText.destroy();
		var _g = 0;
		var _g1 = this.extraElements;
		while(_g < _g1.length) {
			var elem = _g1[_g];
			++_g;
			elem.destroy();
		}
	}
	,__class__: gui_TextButton
});
