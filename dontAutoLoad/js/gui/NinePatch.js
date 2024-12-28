var gui_NinePatch = $hxClasses["gui.NinePatch"] = function(texture,sidePixels,width,height) {
	this.tint = 16777215;
	this.currentTextureSet = 0;
	this.npWidth = width;
	this.npHeight = height;
	PIXI.Container.call(this);
	this.textureSets = [];
	this.texture = texture;
	this.sidePixels = sidePixels;
	this.updateTextures();
	this.updateSprites();
};
gui_NinePatch.__name__ = "gui.NinePatch";
gui_NinePatch.__super__ = PIXI.Container;
gui_NinePatch.prototype = $extend(PIXI.Container.prototype,{
	setTextureSet: function(setNumber) {
		var newTextureSet = this.textureSets[setNumber];
		this.currentTextureSet = setNumber;
		if(newTextureSet != this.textureParts) {
			this.textureParts = newTextureSet;
			this.updateSprites();
		}
	}
	,updateTextures: function(destroyOld) {
		if(destroyOld == null) {
			destroyOld = true;
		}
		if(this.textureParts == null) {
			this.textureParts = [];
		} else if(destroyOld) {
			this.textureSets.pop();
		} else {
			this.textureParts = [];
		}
		if(gui_NinePatch.ninePatchTextureCache.h.__keys__[this.texture.__id__] != null && gui_NinePatch.ninePatchTextureCache.h[this.texture.__id__].h.hasOwnProperty(this.sidePixels)) {
			this.textureParts = gui_NinePatch.ninePatchTextureCache.h[this.texture.__id__].h[this.sidePixels];
		} else {
			var _g = 0;
			while(_g < 9) {
				var i = _g++;
				this.textureParts[i] = this.texture.clone();
				var frame = new PIXI.Rectangle();
				if(i % 3 == 1) {
					frame.width = this.texture.width - 2 * this.sidePixels;
					frame.x = this.sidePixels;
				} else {
					frame.width = this.sidePixels;
					if(i % 3 == 2) {
						frame.x = this.texture.width - this.sidePixels;
					}
				}
				if(i >= 3 && i <= 5) {
					frame.height = this.texture.height - 2 * this.sidePixels;
					frame.y = this.sidePixels;
				} else {
					frame.height = this.sidePixels;
					if(i > 5) {
						frame.y = this.texture.height - this.sidePixels;
					}
				}
				this.textureParts[i].frame = new PIXI.Rectangle(this.textureParts[i].frame.x + frame.x,this.textureParts[i].frame.y + frame.y,frame.width,frame.height);
				this.textureParts[i].update();
			}
			if(gui_NinePatch.ninePatchTextureCache.h.__keys__[this.texture.__id__] == null) {
				var this1 = gui_NinePatch.ninePatchTextureCache;
				var k = this.texture;
				var v = new haxe_ds_IntMap();
				this1.set(k,v);
			}
			var v = this.textureParts;
			gui_NinePatch.ninePatchTextureCache.h[this.texture.__id__].h[this.sidePixels] = v;
		}
		this.textureSets.push(this.textureParts);
	}
	,updateSprites: function(refresh) {
		if(refresh == null) {
			refresh = false;
		}
		if(this.npWidth == 0 || this.npHeight == 0) {
			this.visible = false;
			return;
		}
		this.visible = true;
		if(refresh) {
			var _g = 0;
			var _g1 = this.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.destroy();
			}
			this.children = [];
		}
		var _g = 0;
		while(_g < 9) {
			var i = _g++;
			var thisSprite = null;
			if(this.children.length <= i) {
				thisSprite = new PIXI.Sprite(this.textureParts[i]);
				this.addChild(thisSprite);
			} else {
				thisSprite = this.children[i];
				thisSprite.texture = this.textureParts[i];
			}
			var tmp;
			switch(i % 3) {
			case 1:
				tmp = this.sidePixels;
				break;
			case 2:
				tmp = this.npWidth - this.sidePixels;
				break;
			default:
				tmp = 0;
			}
			thisSprite.position.x = tmp;
			if(i % 3 == 1) {
				thisSprite.width = this.npWidth - this.sidePixels * 2;
			}
			var tmp1;
			switch(i / 3 | 0) {
			case 1:
				tmp1 = this.sidePixels;
				break;
			case 2:
				tmp1 = this.npHeight - this.sidePixels;
				break;
			default:
				tmp1 = 0;
			}
			thisSprite.position.y = tmp1;
			thisSprite.tint = this.tint;
			if((i / 3 | 0) == 1) {
				if(this.npHeight - this.sidePixels * 2 < 0) {
					thisSprite.height = 0;
				} else {
					thisSprite.scale.y = (this.npHeight - this.sidePixels * 2) / thisSprite.texture.height;
				}
			}
		}
	}
	,__class__: gui_NinePatch
});
