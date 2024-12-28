var gui_ColorPicker = $hxClasses["gui.ColorPicker"] = function(parent,stage,onColorUpdate,isLimited) {
	if(isLimited == null) {
		isLimited = false;
	}
	this.isLimited = false;
	this.parent = parent;
	this.rect = new common_Rectangle(0,0,0,0);
	this.h = this.get_colorHSV()[0];
	this.s = this.get_colorHSV()[1];
	this.v = this.get_colorHSV()[2];
	this.onColorUpdate = onColorUpdate;
	this.isLimited = isLimited;
	this.colorPickSprite = Resources.makeSprite(isLimited ? "spr_colorcircle_limited" : "spr_colorcircle");
	this.colorPickCircleSprite = Resources.makeSprite("spr_colorpicker_circle");
	this.colorPickCircleSprite.anchor.set(0.5,0.5);
	this.colorPickTriangleSprite = Resources.makeSprite("spr_colorpicker_triangle");
	this.colorPickTriangleSprite.anchor.set(0.5,0);
	this.graphics = new PIXI.Graphics();
	if(Main.isMobile) {
		this.colorPickSprite.scale.x = 0.6;
		this.colorPickSprite.scale.y = 0.6;
	}
	stage.addChild(this.colorPickSprite);
	stage.addChild(this.colorPickCircleSprite);
	stage.addChild(this.colorPickTriangleSprite);
	stage.addChild(this.graphics);
	this.rect.width = Math.round(this.colorPickSprite.width + 10);
	this.rect.height = Math.round(this.colorPickSprite.height + 10 + (Main.isMobile ? 25 : 40));
};
gui_ColorPicker.__name__ = "gui.ColorPicker";
gui_ColorPicker.__interfaces__ = [gui_IGUIElement];
gui_ColorPicker.prototype = {
	get_colorHSV: function() {
		var this1 = gui_ColorPicker.colorPicked;
		return thx_color_Rgb.toHsv(this1);
	}
	,updateSize: function() {
		if(this.parent != null) {
			this.parent.updateSize();
		}
	}
	,updatePosition: function(newPosition) {
		this.rect.x = newPosition.x;
		this.rect.y = newPosition.y;
		this.colorPickSprite.position.set(this.rect.x + 5,this.rect.y);
		this.graphics.position.set(this.rect.x,this.rect.y + this.colorPickSprite.height + 20);
		this.updateColorPickerSubSprites();
		this.redrawGraphics();
	}
	,updateColor: function() {
		var this1 = [this.h,this.s,this.v];
		gui_ColorPicker.colorPicked = common_ColorExtensions.toHexInt(thx_color_Hsv.toRgb(this1));
		this.onColorUpdate(gui_ColorPicker.colorPicked);
		this.redrawGraphics();
	}
	,updateColorPickerSubSprites: function() {
		this.colorPickCircleSprite.position.set(this.colorPickSprite.position.x + this.colorPickSprite.width / 2 + this.s * this.colorPickSprite.width / 2 * Math.cos(this.h / 360 * 2 * Math.PI),this.colorPickSprite.position.y + this.colorPickSprite.width / 2 + this.s * this.colorPickSprite.width / 2 * Math.sin(this.h / 360 * 2 * Math.PI));
		this.colorPickTriangleSprite.position.set(this.colorPickSprite.position.x + (this.isLimited ? (this.v - gui_ColorPicker.colorPickerLimit) / (1 - gui_ColorPicker.colorPickerLimit) : this.v) * this.colorPickSprite.width,this.colorPickSprite.position.y + this.colorPickSprite.height);
	}
	,destroy: function() {
		this.colorPickSprite.destroy();
		this.colorPickCircleSprite.destroy();
		this.colorPickTriangleSprite.destroy();
		this.graphics.destroy();
	}
	,redrawGraphics: function() {
		this.graphics.clear();
		this.graphics.beginFill(gui_ColorPicker.colorPicked);
		this.graphics.drawRect(0,0,this.colorPickSprite.width + 10,Main.isMobile ? 15 : 30);
		this.graphics.endFill();
	}
	,handleMouse: function(mouse) {
		if(this.rect.contains(mouse.position)) {
			var claim = mouse.claimMouse(this,"",true,true,true);
			if(claim == MouseState.Confirmed) {
				var x = mouse.position.x - this.colorPickSprite.position.x;
				var y = mouse.position.y - this.colorPickSprite.position.y;
				if(y < this.colorPickSprite.width) {
					var len = Math.min(Math.sqrt(Math.pow(x - this.colorPickSprite.width / 2,2) + Math.pow(y - this.colorPickSprite.width / 2,2)) / (this.colorPickSprite.width / 2),1);
					var dir = Math.atan2(y - this.colorPickSprite.width / 2,x - this.colorPickSprite.width / 2);
					this.s = len;
					this.h = (dir + 2 * Math.PI) / (2 * Math.PI) * 360 % 360;
					this.updateColor();
					this.updateColorPickerSubSprites();
				}
				if(y > this.colorPickSprite.height - 30 && y < this.colorPickSprite.height + 12) {
					if(this.isLimited) {
						var val = x / this.colorPickSprite.width * (1 - gui_ColorPicker.colorPickerLimit) + gui_ColorPicker.colorPickerLimit;
						var minVal = gui_ColorPicker.colorPickerLimit;
						this.v = val < minVal ? minVal : val > 1 ? 1 : val;
					} else {
						var val = x / this.colorPickSprite.width;
						this.v = val < 0 ? 0 : val > 1 ? 1 : val;
					}
					this.updateColor();
					this.updateColorPickerSubSprites();
				}
			}
			return true;
		}
		return false;
	}
	,update: function() {
	}
	,__class__: gui_ColorPicker
};
