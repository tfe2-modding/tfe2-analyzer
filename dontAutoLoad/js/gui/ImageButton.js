var gui_ImageButton = $hxClasses["gui.ImageButton"] = function(gui,stage,parent,action,spriteTexture,isActive,onHover,backSpriteTexture,buttonSpriteName,imageSpriteOffset) {
	if(imageSpriteOffset == null) {
		imageSpriteOffset = 1;
	}
	if(buttonSpriteName == null) {
		buttonSpriteName = "spr_buildingbutton";
	}
	this.needsAttention = false;
	this.attentionGetterSprite = null;
	this.imageSpriteOffsetX = 0;
	this.imageSpriteOffset = 1;
	this.removeNotificationEver = true;
	this.removeNotificationOnHover = true;
	this.shown = true;
	gui_Button.call(this,gui,stage,parent,action,isActive,onHover);
	this.buttonTextures = Resources.getTextures(buttonSpriteName,3);
	this.buttonSprite = new PIXI.Sprite(this.buttonTextures[0]);
	stage.addChild(this.buttonSprite);
	if(backSpriteTexture != null) {
		this.imageSpriteBack = new PIXI.Sprite(backSpriteTexture);
		this.imageSpriteBack.position.set(1,1);
		stage.addChild(this.imageSpriteBack);
	}
	this.imageSpriteOffset = imageSpriteOffset;
	this.imageSprite = new PIXI.Sprite(spriteTexture);
	this.imageSprite.position.set(imageSpriteOffset,imageSpriteOffset);
	stage.addChild(this.imageSprite);
	this.rect = new common_Rectangle(0,0,(spriteTexture.width | 0) + imageSpriteOffset * 2,(spriteTexture.height | 0) + imageSpriteOffset * 2);
};
gui_ImageButton.__name__ = "gui.ImageButton";
gui_ImageButton.__super__ = gui_Button;
gui_ImageButton.prototype = $extend(gui_Button.prototype,{
	updateTexture: function(newTexture) {
		this.imageSprite.texture = newTexture;
	}
	,updatePosition: function(newPosition) {
		gui_Button.prototype.updatePosition.call(this,newPosition);
		this.buttonSprite.position.set(newPosition.x,newPosition.y);
		this.imageSprite.position.set(newPosition.x + this.imageSpriteOffset + this.imageSpriteOffsetX,newPosition.y + this.imageSpriteOffset);
		if(this.imageSpriteBack != null) {
			this.imageSpriteBack.position.set(newPosition.x + 1,newPosition.y + 1);
		}
		if(this.imageSpriteForeground != null) {
			this.imageSpriteForeground.position.set(newPosition.x,newPosition.y);
		}
		if(this.attentionGetterSprite != null) {
			this.attentionGetterSprite.position.set(newPosition.x,newPosition.y);
		}
	}
	,handleMouse: function(mouse) {
		var _gthis = this;
		if(!this.shown) {
			return false;
		}
		return gui_Button.prototype.doHandleMouse.call(this,mouse,function() {
			_gthis.buttonSprite.texture = _gthis.buttonTextures[1];
			if(_gthis.removeNotificationOnHover) {
				_gthis.stopNotify();
			}
		},function() {
			_gthis.buttonSprite.texture = _gthis.buttonTextures[2];
			if(_gthis.removeNotificationEver) {
				_gthis.stopNotify();
			}
		});
	}
	,update: function() {
		if(this.mouseOut) {
			this.buttonSprite.texture = this.buttonTextures[0];
		}
		if(this.isActive()) {
			this.buttonSprite.texture = this.buttonTextures[2];
		}
		this.updateNeedsAttention();
		gui_Button.prototype.update.call(this);
	}
	,mirror: function() {
		var spr = this.imageSprite;
		if(spr != null) {
			spr.anchor.set(1,0);
			spr.scale.set(-1,1);
		}
		var spr = this.imageSpriteBack;
		if(spr != null) {
			spr.anchor.set(1,0);
			spr.scale.set(-1,1);
		}
		var spr = this.imageSpriteForeground;
		if(spr != null) {
			spr.anchor.set(1,0);
			spr.scale.set(-1,1);
		}
	}
	,setNeedsAttention: function(needsAttention) {
		if(needsAttention == null) {
			needsAttention = false;
		}
		this.needsAttention = needsAttention;
		this.updateNeedsAttention();
	}
	,updateNeedsAttention: function() {
		if(this.buttonSprite == null) {
			return;
		}
		if(this.needsAttention && this.buttonSprite.texture == this.buttonTextures[0]) {
			if(this.attentionGetterSprite == null) {
				this.attentionGetterSprite = new PIXI.Sprite(Resources.getTexture("spr_whiteoutline"));
				this.attentionGetterSprite.position.set(this.buttonSprite.position.x,this.buttonSprite.position.y);
				if(this.buttonSprite.parent != null) {
					this.buttonSprite.parent.addChild(this.attentionGetterSprite);
				}
			}
			var this1 = [89,1,0.77];
			var tmp = thx_color_Hsv.toRgb(this1);
			this.attentionGetterSprite.tint = common_ColorExtensions.toHexInt(tmp);
			this.attentionGetterSprite.alpha = (Math.sin(this.gui.guiTimer / 10) + 1) / 2;
		} else if(this.attentionGetterSprite != null) {
			if(!this.needsAttention) {
				this.attentionGetterSprite.destroy();
				this.attentionGetterSprite = null;
			} else {
				this.attentionGetterSprite.alpha = 0;
			}
		}
	}
	,destroy: function() {
		gui_Button.prototype.destroy.call(this);
		if(this.buttonSprite.texture != null) {
			this.buttonSprite.destroy();
			this.imageSprite.destroy();
			if(this.imageSpriteBack != null) {
				this.imageSpriteBack.destroy();
			}
			if(this.imageSpriteForeground != null) {
				this.imageSpriteForeground.destroy();
				this.imageSpriteForeground = null;
			}
			if(this.attentionGetterSprite != null) {
				this.attentionGetterSprite.destroy();
				this.attentionGetterSprite = null;
			}
		}
	}
	,hide: function() {
		if(this.imageSpriteBack != null) {
			this.imageSpriteBack.visible = false;
		}
		this.imageSprite.visible = false;
		this.buttonSprite.visible = false;
		if(this.imageSpriteForeground != null) {
			this.imageSpriteForeground.visible = false;
		}
		if(this.attentionGetterSprite != null) {
			this.attentionGetterSprite.visible = false;
		}
		this.shown = false;
	}
	,show: function() {
		if(this.imageSpriteBack != null) {
			this.imageSpriteBack.visible = true;
		}
		this.imageSprite.visible = true;
		this.buttonSprite.visible = true;
		if(this.imageSpriteForeground != null) {
			this.imageSpriteForeground.visible = true;
		}
		if(this.attentionGetterSprite != null) {
			this.attentionGetterSprite.visible = true;
		}
		this.shown = true;
	}
	,notify: function(removeNotificationOnHover,onRemove) {
		this.removeNotificationOnHover = removeNotificationOnHover;
		if(this.imageSpriteForeground != null) {
			return;
		}
		this.imageSpriteForeground = new PIXI.Sprite(Resources.getTexture("spr_buttonnotification"));
		var _this = this.rect;
		var _this_x = _this.x;
		var _this_y = _this.y;
		var tmp = new PIXI.Point(_this_x,_this_y);
		this.imageSpriteForeground.position = tmp;
		this.stage.addChild(this.imageSpriteForeground);
		this.doOnStopNotify = onRemove;
	}
	,addExtraSprite: function(textureName) {
		if(this.imageSpriteForeground != null) {
			return;
		}
		this.removeNotificationOnHover = false;
		this.removeNotificationEver = false;
		this.imageSpriteForeground = new PIXI.Sprite(Resources.getTexture(textureName));
		var _this = this.rect;
		var _this_x = _this.x;
		var _this_y = _this.y;
		var tmp = new PIXI.Point(_this_x,_this_y);
		this.imageSpriteForeground.position = tmp;
		this.stage.addChild(this.imageSpriteForeground);
	}
	,stopNotify: function() {
		if(this.imageSpriteForeground == null) {
			return;
		}
		this.imageSpriteForeground.destroy();
		this.imageSpriteForeground = null;
		this.doOnStopNotify();
	}
	,__class__: gui_ImageButton
});
