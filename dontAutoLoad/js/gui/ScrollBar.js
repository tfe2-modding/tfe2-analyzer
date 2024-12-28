var gui_ScrollBar = $hxClasses["gui.ScrollBar"] = function(parent,stage,scrollable,texture) {
	if(texture == null) {
		texture = "spr_windowparts";
	}
	this.resetTexturesNextUpdate = false;
	this.width = 10;
	if(Main.isMobile) {
		this.width = 14;
	}
	this.parent = parent;
	this.stage = stage;
	this.scrollable = scrollable;
	this.rect = new common_Rectangle(0,0,this.width,0);
	var windowParts = Resources.getTextures(texture,4);
	this.background = new gui_NinePatch(windowParts[0],3,9,9);
	stage.addChild(this.background);
	this.scrollbar = new gui_NinePatch(windowParts[1],3,9,9);
	this.scrollbar.texture = windowParts[2];
	this.scrollbar.updateTextures(false);
	this.scrollbar.texture = windowParts[3];
	this.scrollbar.updateTextures(false);
	this.scrollbar.texture = windowParts[1];
	this.scrollbar.updateTextures(false);
	stage.addChild(this.scrollbar);
};
gui_ScrollBar.__name__ = "gui.ScrollBar";
gui_ScrollBar.__interfaces__ = [gui_IGUIElement];
gui_ScrollBar.prototype = {
	get_scrollPart: function() {
		return this.scrollable.scrollPosition.y;
	}
	,get_scrollHandlePosition: function() {
		return Math.round(this.get_scrollPart() / this.scrollable.get_innerHeight() * this.rect.height);
	}
	,get_scrollHandleHeight: function() {
		return Math.round(this.scrollable.rect.height / this.scrollable.get_innerHeight() * this.rect.height);
	}
	,updateSize: function() {
		this.parent.updateSize();
	}
	,updatePosition: function(newPosition) {
		var _this = this.rect;
		var inlPoint_x = _this.x = newPosition.x;
		var inlPoint_y = _this.y = newPosition.y;
		this.redraw();
	}
	,redraw: function() {
		if(this.scrollable != null) {
			this.background.npWidth = this.width;
			this.background.npHeight = this.rect.height;
			var _this = this.rect;
			var inlPoint_x = _this.x;
			var inlPoint_y = _this.y;
			this.background.position.x = inlPoint_x;
			var _this = this.rect;
			var inlPoint_x = _this.x;
			var inlPoint_y = _this.y;
			this.background.position.y = inlPoint_y;
			this.background.updateSprites(true);
			this.scrollbar.npWidth = this.width;
			this.scrollbar.npHeight = this.get_scrollHandleHeight();
			var _this = this.rect;
			var inlPoint_x = _this.x;
			var inlPoint_y = _this.y;
			this.scrollbar.position.x = inlPoint_x;
			var _this = this.rect;
			var inlPoint_x = _this.x;
			var inlPoint_y = _this.y;
			var tmp = this.get_scrollHandlePosition();
			this.scrollbar.position.y = inlPoint_y + tmp;
			this.scrollbar.updateSprites(true);
		}
	}
	,destroy: function() {
		this.background.destroy();
		this.scrollbar.destroy();
	}
	,handleMouse: function(mouse) {
		var _gthis = this;
		if(this.rect.contains(mouse.position)) {
			this.scrollable.handleScrollWheel(mouse);
			var wasInScrollbarHandle = true;
			var mouseStartY = 0;
			var mouseRelativeStartY = 0;
			var relativeMouseY;
			var isInScrollBarHandle;
			relativeMouseY = mouse.get_y() - _gthis.rect.y;
			var lower = _gthis.get_scrollHandlePosition();
			var upper = _gthis.get_scrollHandlePosition() + _gthis.get_scrollHandleHeight();
			isInScrollBarHandle = relativeMouseY >= lower && relativeMouseY < upper;
			if(isInScrollBarHandle) {
				this.scrollbar.setTextureSet(1);
				this.resetTexturesNextUpdate = false;
			}
			mouse.strongClaimMouse(this,function() {
				if(_gthis.scrollable != null && _gthis.background.parent != null) {
					_gthis.resetTexturesNextUpdate = false;
					_gthis.scrollbar.setTextureSet(2);
					relativeMouseY = mouse.get_y() - _gthis.rect.y;
					var lower = _gthis.get_scrollHandlePosition();
					var upper = _gthis.get_scrollHandlePosition() + _gthis.get_scrollHandleHeight();
					isInScrollBarHandle = relativeMouseY >= lower && relativeMouseY < upper;
					if(mouse.pressed) {
						mouseStartY = relativeMouseY;
						mouseRelativeStartY = mouseStartY - _gthis.get_scrollHandlePosition();
						wasInScrollbarHandle = isInScrollBarHandle;
					}
					var maxScrollY = _gthis.scrollable.get_innerHeight() - _gthis.scrollable.rect.height;
					var newScrollPart = _gthis.scrollable.scrollPosition.y;
					if(wasInScrollbarHandle) {
						var newScrollBarTop = relativeMouseY - mouseRelativeStartY;
						if(_gthis.rect.height != 0) {
							newScrollPart = Math.round(newScrollBarTop * (_gthis.scrollable.get_innerHeight() / _gthis.rect.height));
						}
					} else {
						var scrollBarMid = _gthis.get_scrollHandlePosition() + _gthis.get_scrollHandleHeight() / 2;
						var currentScrollSpeed = Math.round(8 * mouse.timeMod);
						if(relativeMouseY < scrollBarMid - currentScrollSpeed) {
							newScrollPart -= currentScrollSpeed;
						} else if(relativeMouseY >= scrollBarMid + currentScrollSpeed) {
							newScrollPart += currentScrollSpeed;
						}
					}
					if(newScrollPart < 0) {
						newScrollPart = 0;
					} else if(newScrollPart > maxScrollY) {
						newScrollPart = maxScrollY;
					}
					_gthis.scrollable.updateScrollPosition(new common_Point(_gthis.scrollable.scrollPosition.x,newScrollPart));
				}
			});
			return true;
		}
		return false;
	}
	,update: function() {
		if(this.resetTexturesNextUpdate) {
			this.scrollbar.setTextureSet(0);
		}
		this.resetTexturesNextUpdate = true;
	}
	,__class__: gui_ScrollBar
};
