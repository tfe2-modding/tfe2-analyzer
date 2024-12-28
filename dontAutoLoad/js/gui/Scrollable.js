var gui_Scrollable = $hxClasses["gui.Scrollable"] = function(game,outerStage,parent,position,width,height,origin) {
	this.destroyed = false;
	this.maskRect = null;
	this.game = game;
	this.outerStage = outerStage;
	this.parent = parent;
	this.stage = new PIXI.Container();
	outerStage.addChild(this.stage);
	this.scrollPosition = new common_Point(0,0);
	this.rect = new common_Rectangle(0,0,width,height);
	this.origin = origin;
	this.updatePosition(position);
	this.updateSize();
	this.dragDir = new common_FPoint(0,0);
	this.dragDirRemaining = new common_FPoint(0,0);
	this.remainingStepDragDir = new common_FPoint(0,0);
};
gui_Scrollable.__name__ = "gui.Scrollable";
gui_Scrollable.__interfaces__ = [gui_IGUIElement];
gui_Scrollable.prototype = {
	get_innerHeight: function() {
		return this.child.rect.height;
	}
	,setChild: function(child) {
		this.child = child;
		this.updateSize();
	}
	,updateSize: function() {
		if(this.child != null) {
			var val = this.scrollPosition.y;
			var val2 = this.get_innerHeight() - this.rect.height;
			var maxVal = val2 > 0 ? val2 : 0;
			this.scrollPosition.y = val < 0 ? 0 : val > maxVal ? maxVal : val;
		}
		if(this.parent != null) {
			this.parent.updateSize();
		} else {
			this.updatePosition(this.position);
		}
	}
	,updateScrollPosition: function(newPosition) {
		this.scrollPosition = newPosition;
		this.updateSize();
	}
	,updateStageMask: function() {
		if(this.child == null || this.child.rect.width <= this.rect.width && this.get_innerHeight() <= this.rect.height) {
			if(this.stage.mask != null) {
				this.stage.mask.destroy();
			}
			this.stage.mask = null;
			this.maskRect = null;
			return;
		}
		if(this.maskRect == null || (this.maskRect.x != this.rect.x || this.maskRect.y != this.rect.y || this.maskRect.width != this.rect.width || this.maskRect.height != this.rect.height)) {
			this.maskRect = this.rect.clone();
			if(this.stage.mask != null) {
				this.stage.mask.destroy();
			}
			this.stage.mask = null;
			if(!Settings.compatDisableMasking) {
				var mask = new PIXI.Graphics();
				mask.beginFill(16777215);
				this.stage.addChild(mask);
				mask.drawRect(this.rect.x,this.rect.y - 1,this.rect.width,this.rect.height + 1);
				mask.endFill();
				this.stage.mask = mask;
			}
		}
	}
	,updatePosition: function(newPosition) {
		this.position = newPosition;
		var _this = this.rect;
		var _this1 = this.position;
		var otherPoint_x = this.origin.x * this.rect.width | 0;
		var otherPoint_y = this.origin.y * this.rect.height | 0;
		var newPos_x = _this1.x - otherPoint_x;
		var newPos_y = _this1.y - otherPoint_y;
		var inlPoint_x = _this.x = newPos_x;
		var inlPoint_y = _this.y = newPos_y;
		if(this.child != null) {
			var _this = this.rect;
			var _this_x = _this.x;
			var _this_y = _this.y;
			var otherPoint = this.scrollPosition;
			this.child.updatePosition(new common_Point(_this_x - otherPoint.x,_this_y - otherPoint.y));
		}
		this.updateStageMask();
	}
	,destroy: function() {
		if(this.child != null) {
			this.child.destroy();
		}
		this.stage.destroy({ children : true});
		this.destroyed = true;
	}
	,claimMouseForScroll: function(mouse,needsPress) {
		if(needsPress == null) {
			needsPress = true;
		}
		var _gthis = this;
		if(mouse.hasNoClaim()) {
			this.mousePreviousY = mouse.position.y;
			mouse.strongClaimMouse("scrollWindow",function() {
				if(_gthis.destroyed) {
					return;
				}
				var scrollAmount = _gthis.mousePreviousY - mouse.position.y;
				_gthis.updateScrollPosition(new common_Point(_gthis.scrollPosition.x,_gthis.scrollPosition.y + scrollAmount));
				_gthis.mousePreviousY = mouse.position.y;
			},needsPress);
			return true;
		}
		return false;
	}
	,handleMouse: function(mouse) {
		if(this.rect.contains(mouse.position)) {
			this.handleScrollWheel(mouse);
			if(mouse.isTouch) {
				if(mouse.weakClaimForScroll(this)) {
					if(this.claimMouseForScroll(mouse,false)) {
						return true;
					}
				}
			}
			if(this.child != null) {
				if(this.child.handleMouse(mouse)) {
					return true;
				}
			}
			if(mouse.isTouch) {
				if(this.claimMouseForScroll(mouse)) {
					return true;
				}
			}
			mouse.claimMouse(this);
			return true;
		}
		return false;
	}
	,handleScrollWheel: function(mouse) {
		var maxScroll = this.rect.height - 10;
		if(mouse.scrollBarMovement != 0) {
			var val = Math.round(mouse.scrollBarMovement);
			var minVal = -maxScroll;
			this.updateScrollPosition(new common_Point(this.scrollPosition.x,this.scrollPosition.y + (val < minVal ? minVal : val > maxScroll ? maxScroll : val)));
		}
		if(mouse.scrollBarMovementPages != 0) {
			var val = Math.round(this.rect.height * mouse.scrollBarMovementPages);
			var minVal = -maxScroll;
			this.updateScrollPosition(new common_Point(this.scrollPosition.x,this.scrollPosition.y + (val < minVal ? minVal : val > maxScroll ? maxScroll : val)));
		}
	}
	,update: function() {
		if(this.child != null) {
			this.child.update();
		}
		if(this.game.mouse.pressed || this.dragDir.get_length() < 0.5) {
			this.dragDir.x = 0;
			this.dragDir.y = 0;
			this.remainingStepDragDir.x = 0;
			this.remainingStepDragDir.y = 0;
		} else if(!this.game.mouse.hasSpecificClaim("scrollWindow")) {
			var dragSpeedTimeout = this.game.mouse.isTouch ? 0.933 : 0.8;
			this.dragDir.x *= dragSpeedTimeout;
			this.dragDir.y *= dragSpeedTimeout;
			var stepDragDir_x = this.dragDir.x + this.dragDirRemaining.x;
			var stepDragDir_y = this.dragDir.y + this.dragDirRemaining.y;
			this.dragDirRemaining.x += this.dragDir.x - stepDragDir_x;
			this.dragDirRemaining.y += this.dragDir.y - stepDragDir_y;
			this.remainingStepDragDir.x += stepDragDir_x;
			this.remainingStepDragDir.y += stepDragDir_y;
			var remStepDragDirToUse = Math.floor(this.remainingStepDragDir.y);
			this.updateScrollPosition(new common_Point(this.scrollPosition.x,this.scrollPosition.y + remStepDragDirToUse));
			this.remainingStepDragDir.y -= remStepDragDirToUse;
		}
	}
	,__class__: gui_Scrollable
};
