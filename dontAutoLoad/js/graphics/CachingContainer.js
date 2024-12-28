var graphics_CachingContainer = $hxClasses["graphics.CachingContainer"] = function(cacheWithinRect) {
	this.previousCullRectangle = null;
	this.isInvalid = true;
	PIXI.Container.call(this);
	this.cacheWithinRect = cacheWithinRect;
	this.cacheableChildren = [];
	this.cacheContainer = new PIXI.Container();
	this.explicitUncachedContainer = new PIXI.Container();
	this.addChild(this.cacheContainer);
	this.addChild(this.explicitUncachedContainer);
};
graphics_CachingContainer.__name__ = "graphics.CachingContainer";
graphics_CachingContainer.__super__ = PIXI.Container;
graphics_CachingContainer.prototype = $extend(PIXI.Container.prototype,{
	preDraw: function(cullRectangle) {
		if(this.isInvalid) {
			if(Main.isCanvasRenderer && !Main.isMobile || this.cacheableChildren.length < 512 && (!Main.isMobile || this.cacheableChildren.length == 0)) {
				this.cacheContainer.cacheAsBitmap = false;
				var _g = 0;
				var _g1 = this.cacheableChildren;
				while(_g < _g1.length) {
					var child = _g1[_g];
					++_g;
					if(child.parent != this.explicitUncachedContainer) {
						if(child.parent != null) {
							child.parent.removeChild(this.parent);
						}
						this.explicitUncachedContainer.addChild(child);
						child.visible = true;
					}
				}
			} else {
				var _g = 0;
				var _g1 = this.cacheableChildren;
				while(_g < _g1.length) {
					var child = _g1[_g];
					++_g;
					var childRect;
					var childAsDynamic = child;
					if(childAsDynamic.width != null) {
						childRect = new common_Rectangle(Math.floor(child.x),Math.floor(child.y),Math.ceil(childAsDynamic.width + 1),Math.ceil(childAsDynamic.height + 1));
					} else {
						childRect = common_Rectangle.fromPixiRect(child.getLocalBounds());
					}
					if(this.cacheWithinRect.fullyContains(childRect)) {
						if(child.parent != this.cacheContainer) {
							if(child.parent != null) {
								child.parent.removeChild(this.parent);
							}
							this.cacheContainer.addChild(child);
							child.visible = true;
						}
					} else if(child.parent != this.explicitUncachedContainer) {
						if(child.parent != null) {
							child.parent.removeChild(this.parent);
						}
						this.explicitUncachedContainer.addChild(child);
					}
				}
				this.cacheContainer.cacheAsBitmap = false;
				this.cacheContainer.cacheAsBitmap = true;
			}
			this.isInvalid = false;
			this.cull(cullRectangle);
			this.previousCullRectangle = cullRectangle.clone();
		} else if(this.previousCullRectangle == null || this.previousCullRectangle.x != cullRectangle.x || this.previousCullRectangle.y != cullRectangle.y || this.previousCullRectangle.width != cullRectangle.width || this.previousCullRectangle.height != cullRectangle.height) {
			this.cull(cullRectangle);
			this.previousCullRectangle = cullRectangle.clone();
		}
	}
	,uncull: function() {
		var _g = 0;
		var _g1 = this.explicitUncachedContainer.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.visible = true;
		}
		var _g = 2;
		var _g1 = this.children.length;
		while(_g < _g1) {
			var i = _g++;
			this.children[i].visible = true;
		}
		this.previousCullRectangle = null;
	}
	,cull: function(cullRectangle) {
		var x2 = cullRectangle.get_x2();
		var y2 = cullRectangle.get_y2();
		var _g = 0;
		var _g1 = this.explicitUncachedContainer.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			var childAsDynamic = child;
			if(childAsDynamic.width != null && childAsDynamic.anchor != null && childAsDynamic.scale != null) {
				child.visible = child.x + childAsDynamic.width - childAsDynamic.anchor.x * childAsDynamic.scale.x * childAsDynamic.width >= cullRectangle.x && child.y + childAsDynamic.height - childAsDynamic.anchor.y * childAsDynamic.scale.y * childAsDynamic.height >= cullRectangle.y && child.x - childAsDynamic.anchor.x * childAsDynamic.width < x2 && child.y - childAsDynamic.anchor.y * childAsDynamic.height < y2;
			} else if(childAsDynamic.width != null) {
				child.visible = child.x + childAsDynamic.width >= cullRectangle.x && child.y + childAsDynamic.height >= cullRectangle.y && child.x < x2 && child.y < y2;
			}
		}
		var _g = 2;
		var _g1 = this.children.length;
		while(_g < _g1) {
			var i = _g++;
			var child = this.children[i];
			var childAsDynamic = child;
			if(childAsDynamic.width != null && childAsDynamic.anchor != null && childAsDynamic.scale != null) {
				child.visible = child.x + childAsDynamic.width - childAsDynamic.anchor.x * childAsDynamic.scale.x * childAsDynamic.width >= cullRectangle.x && child.y + childAsDynamic.height - childAsDynamic.anchor.y * childAsDynamic.scale.y * childAsDynamic.height >= cullRectangle.y && child.x - childAsDynamic.anchor.x * childAsDynamic.width < x2 && child.y - childAsDynamic.anchor.y * childAsDynamic.height < y2;
			} else if(childAsDynamic.width != null) {
				child.visible = child.x + childAsDynamic.width >= cullRectangle.x && child.y + childAsDynamic.height >= cullRectangle.y && child.x < x2 && child.y < y2;
			}
		}
	}
	,removeCache: function() {
		this.cacheContainer.cacheAsBitmap = false;
	}
	,__class__: graphics_CachingContainer
});
