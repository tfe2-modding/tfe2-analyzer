var Mouse = $hxClasses["Mouse"] = function() {
	this.timeMod = 0;
	this.scrollBarNextMovementPages = 0;
	this.scrollBarMovementPages = 0;
	this.scrollBarNextMovement = 0;
	this.scrollBarMovement = 0;
	this.nextTickReset = 12;
	this.mouseDownTick = 0;
	this.isTouch = false;
	this.disableCityMovement = false;
	this.strongClaimOnEnd = null;
	this.strongClaimOnUpdate = null;
	this.hasStrongClaim = false;
	this.additionalClaimData = null;
	this.activeObject = null;
	this.nextStepQuietReleased = false;
	this.nextStepMiddleReleased = false;
	this.nextStepMiddleDown = false;
	this.nextStepRightReleased = false;
	this.nextStepRightDown = false;
	this.nextStepReleased = false;
	this.nextStepDown = false;
	this.middleDown = false;
	this.middleReleased = false;
	this.middlePressed = false;
	this.rightDown = false;
	this.rightReleased = false;
	this.rightPressed = false;
	this.moved = false;
	this.down = false;
	this.released = false;
	this.pressed = false;
	this.position = new common_Point(0,0);
	this.unscaledPosition = new common_Point(0,0);
	this.cityPosition = new common_Point(0,0);
	this.mouseDownTick = 0;
	this.pointerDown = [];
	this.pointerUnscaledPosition = new haxe_ds_IntMap();
	this.pointerPosition = new haxe_ds_IntMap();
	this.pointerCityScaledPosition = new haxe_ds_IntMap();
	this.pointerCityPosition = new haxe_ds_IntMap();
};
Mouse.__name__ = "Mouse";
Mouse.prototype = {
	get_x: function() {
		return this.position.x;
	}
	,get_y: function() {
		return this.position.y;
	}
	,get_cityX: function() {
		return this.cityPosition.x;
	}
	,get_cityY: function() {
		return this.cityPosition.y;
	}
	,claimMouse: function(object,additionalData,disableCityMovementOnPress,continuousEffect,continuousEveryStep) {
		if(continuousEveryStep == null) {
			continuousEveryStep = false;
		}
		if(continuousEffect == null) {
			continuousEffect = false;
		}
		if(disableCityMovementOnPress == null) {
			disableCityMovementOnPress = true;
		}
		if(this.pressed) {
			this.activeObject = object;
			this.additionalClaimData = additionalData;
			this.disableCityMovement = disableCityMovementOnPress;
			this.hasStrongClaim = false;
		}
		if(this.activeObject == object && this.additionalClaimData == additionalData) {
			if(continuousEffect) {
				if(this.released) {
					this.releaseClaim();
					return MouseState.None;
				} else if((this.down || this.released) && (this.mouseDownTick <= 0 || continuousEveryStep)) {
					this.mouseDownTick += this.nextTickReset;
					this.nextTickReset -= 1;
					if(this.nextTickReset <= 2) {
						this.nextTickReset = 2;
					}
					return MouseState.Confirmed;
				} else {
					return MouseState.Active;
				}
			}
			if(this.released) {
				this.releaseAllClaims(true);
				return MouseState.Confirmed;
			} else {
				return MouseState.Active;
			}
		} else {
			this.releaseClaim();
		}
		return MouseState.None;
	}
	,weakClaimForScroll: function(object) {
		if(this.activeWeakObject != null && this.activeWeakObject != object) {
			return false;
		}
		if(this.hasStrongClaim) {
			return false;
		}
		if(this.activeWeakObject == object) {
			if(common_Point.distance(this.weakClaimStartPos,this.position) >= 10) {
				this.activeWeakObject = null;
				this.releaseAllClaims();
				return true;
			}
			return false;
		}
		if(this.pressed) {
			this.activeWeakObject = object;
			this.weakClaimStartPos = this.position;
		}
		return false;
	}
	,hasNoClaim: function() {
		return this.activeObject == null;
	}
	,hasSpecificClaim: function(thisClaim) {
		return this.activeObject == thisClaim;
	}
	,strongClaimMouse: function(object,onUpdate,needsPress) {
		if(needsPress == null) {
			needsPress = true;
		}
		if(this.activeObject == object && this.hasStrongClaim) {
			return true;
		}
		if(this.pressed || !needsPress) {
			this.activeObject = object;
			this.disableCityMovement = true;
			this.hasStrongClaim = true;
			this.strongClaimOnUpdate = onUpdate;
			return true;
		}
		return false;
	}
	,preHandling: function() {
		if(this.released && this.hasStrongClaim) {
			this.releaseAllClaims(true);
		}
		if(!this.down) {
			this.disableCityMovement = false;
		}
	}
	,afterHandling: function() {
		if(this.hasStrongClaim && this.strongClaimOnUpdate != null) {
			this.strongClaimOnUpdate();
		}
	}
	,releaseAllClaims: function(evenStrongClaims) {
		if(evenStrongClaims == null) {
			evenStrongClaims = false;
		}
		this.releaseClaim(evenStrongClaims);
		this.releaseWeakClaim();
	}
	,releaseClaim: function(evenStrongClaims) {
		if(evenStrongClaims == null) {
			evenStrongClaims = false;
		}
		if(evenStrongClaims || !this.hasStrongClaim) {
			if(this.strongClaimOnEnd != null) {
				this.strongClaimOnEnd();
			}
			this.activeObject = null;
			this.additionalClaimData = null;
			this.mouseDownTick = 0;
			this.nextTickReset = 12;
			this.hasStrongClaim = false;
			this.strongClaimOnEnd = null;
		}
	}
	,releaseWeakClaim: function() {
		this.activeWeakObject = null;
	}
	,calcCityPosition: function(game,cityState) {
		var _this = this.unscaledPosition;
		var otherPoint_x = (game.rect.width / 2 | 0) * game.scaling;
		var otherPoint_y = (game.rect.height / 2 | 0) * game.scaling;
		var _this_x = _this.x - otherPoint_x;
		var _this_y = _this.y - otherPoint_y;
		var _this_x1 = _this_x;
		var _this_y1 = _this_y;
		var withFloat = cityState.zoomScale;
		var _this_x = _this_x1 / withFloat;
		var _this_y = _this_y1 / withFloat;
		var otherPoint_x = game.addX;
		var otherPoint_y = game.addY;
		var _this_x1 = _this_x - otherPoint_x;
		var _this_y1 = _this_y - otherPoint_y;
		var otherPoint = cityState.viewPos;
		var _this_x = _this_x1 + otherPoint.x;
		var _this_y = _this_y1 + otherPoint.y;
		return new common_Point(Math.floor(_this_x),Math.floor(_this_y));
	}
	,calcCityPositionForPointer: function(game,cityState,pointer) {
		var _this = this.calcCityFPositionForPointer(game,cityState,pointer);
		return new common_Point(Math.floor(_this.x),Math.floor(_this.y));
	}
	,calcCityFPositionForPointer: function(game,cityState,pointer) {
		var _this = this.pointerUnscaledPosition.h[pointer];
		var otherPoint_x = (game.rect.width / 2 | 0) * game.scaling;
		var otherPoint_y = (game.rect.height / 2 | 0) * game.scaling;
		var _this_x = _this.x - otherPoint_x;
		var _this_y = _this.y - otherPoint_y;
		var _this_x1 = _this_x;
		var _this_y1 = _this_y;
		var withFloat = cityState.zoomScale;
		var _this_x = _this_x1 / withFloat;
		var _this_y = _this_y1 / withFloat;
		var otherPoint_x = game.addX;
		var otherPoint_y = game.addY;
		var _this_x1 = _this_x - otherPoint_x;
		var _this_y1 = _this_y - otherPoint_y;
		var otherPoint = cityState.viewPos;
		return new common_FPoint(_this_x1 + otherPoint.x,_this_y1 + otherPoint.y);
	}
	,getActiveObject: function() {
		return this.activeObject;
	}
	,resetPosition: function() {
		this.position = new common_Point(-100000,-100000);
		this.unscaledPosition = new common_Point(-100000,-100000);
		this.cityScaledPosition = new common_FPoint(-100000,-100000);
		this.cityPosition = new common_Point(-100000,-100000);
	}
	,__class__: Mouse
};
