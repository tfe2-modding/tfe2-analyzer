var CityView = $hxClasses["CityView"] = function(city) {
	this.remZoomScrollBarMovement = 0;
	this.isDraggingViewTwoPointer = false;
	this.isDraggingView = false;
	this.city = city;
	this.dragPreviousMousePos = new common_FPoint(0,0);
	this.dragDir = new common_FPoint(0,0);
	this.dragDirRemaining = new common_FPoint(0,0);
	this.dragPointerIdentifiers = [0,1];
	this.dragPreviousCityPointerPositions = [null,null];
	this.dragInitialPointerPositions = [null,null];
};
CityView.__name__ = "CityView";
CityView.prototype = {
	get_game: function() {
		return this.city.game;
	}
	,handleEarlyMouse: function(mouse) {
		if(mouse.weakClaimForScroll("doCityViewScroll")) {
			if(!mouse.disableCityMovement) {
				this.startViewDrag();
				return true;
			}
		}
		return false;
	}
	,handleMouse: function(mouse) {
		if(isNaN(this.city.viewPos.x) || isNaN(this.city.viewPos.y)) {
			this.city.viewPos.x = 0;
			this.city.viewPos.y = 0;
		}
		if(!this.isDraggingView && !mouse.disableCityMovement) {
			if(mouse.down) {
				this.startViewDrag();
				return true;
			} else if(mouse.pointerDown.length >= 2) {
				this.startViewDrag();
				return true;
			}
		}
		return false;
	}
	,handleKeyboardMove: function(timeMod) {
		var keyboardXMove = 0.0;
		var keyboardYMove = 0.0;
		var keyboardMoveSpeed = 2.0 + 12.0 / this.city.zoomScale;
		if(this.get_game().keyboard.down[37]) {
			keyboardXMove -= keyboardMoveSpeed * timeMod;
		}
		if(this.get_game().keyboard.down[39]) {
			keyboardXMove += keyboardMoveSpeed * timeMod;
		}
		if(this.get_game().keyboard.down[38]) {
			keyboardYMove -= keyboardMoveSpeed * timeMod;
		}
		if(this.get_game().keyboard.down[40]) {
			keyboardYMove += keyboardMoveSpeed * timeMod;
		}
		if(keyboardXMove != 0 || keyboardYMove != 0) {
			this.city.viewPos.x += keyboardXMove;
			this.city.viewPos.y += keyboardYMove;
			this.updateMovingView();
		}
		if(this.get_game().keyboard.pressed[187] || this.get_game().keyboard.pressed[61]) {
			this.zoomIn();
		}
		if(this.get_game().keyboard.pressed[189] || this.get_game().keyboard.pressed[173]) {
			this.zoomOut();
		}
	}
	,updateMovingView: function() {
		var edges = this.city.getCityEdges();
		var minX = edges.minX;
		var maxX = edges.maxX;
		var minY = edges.minY;
		var maxY = edges.maxY;
		var val = this.city.viewPos.x - this.get_game().addX;
		this.city.viewPos.x = (val < minX ? minX : val > maxX ? maxX : val) + this.get_game().addX;
		var tmp;
		if(this.city.fixViewBottomYOn == null) {
			var val = this.city.viewPos.y - this.get_game().addY;
			tmp = (val < minY ? minY : val > maxY ? maxY : val) + this.get_game().addY;
		} else {
			tmp = this.city.fixViewBottomYOn - (this.get_game().rect.height / 2 | 0) + this.get_game().addY;
		}
		this.city.viewPos.y = tmp;
		this.updateMovingViewStagePosition();
	}
	,updateMovingViewStagePosition: function() {
		if(this.city.viewIsControlled) {
			this.city.movingViewStage.position.set((-this.city.viewPos.x + this.get_game().addX) * this.city.zoomScale + (this.get_game().rect.width / 2 | 0) * this.get_game().scaling,(-this.city.viewPos.y + this.get_game().addY) * this.city.zoomScale + this.get_game().scaling * (this.get_game().rect.height / 2 | 0));
		} else {
			this.city.movingViewStage.position.set(Math.floor((-this.city.viewPos.x + this.get_game().addX) * this.city.zoomScale + (this.get_game().rect.width / 2 | 0) * this.get_game().scaling),Math.floor((-this.city.viewPos.y + this.get_game().addY) * this.city.zoomScale + this.get_game().scaling * (this.get_game().rect.height / 2 | 0)));
		}
	}
	,handleMouseMovement: function(timeMod) {
		var _gthis = this;
		var mouse = this.get_game().mouse;
		if(!this.city.viewIsControlled || mouse.pointerDown.length >= 2) {
			if(mouse.middlePressed) {
				if(!this.city.viewIsControlled) {
					this.startViewDrag();
				}
			} else if(this.isDraggingView) {
				var shouldBeTwoPointerDrag = mouse.pointerDown.length >= 2;
				if(mouse.pointerDown.length == 0 && !mouse.middleDown && !mouse.down) {
					this.isDraggingView = false;
					this.isDraggingViewTwoPointer = false;
				} else if(shouldBeTwoPointerDrag != this.isDraggingViewTwoPointer) {
					this.startViewDrag();
				} else if(this.isDraggingViewTwoPointer) {
					if(common_ArrayExtensions.any(mouse.pointerDown,function(d) {
						return _gthis.dragPointerIdentifiers.indexOf(d) == -1;
					}) || common_ArrayExtensions.any(this.dragPointerIdentifiers,function(d) {
						return mouse.pointerDown.indexOf(d) == -1;
					})) {
						this.startViewDrag();
					} else {
						var _g = [];
						var _g1 = 0;
						var _g2 = this.dragPointerIdentifiers.length;
						while(_g1 < _g2) {
							var i = _g1++;
							_g.push(null);
						}
						var currentPointerCityPositions = _g;
						var _g = [];
						var _g1 = 0;
						var _g2 = this.dragPointerIdentifiers.length;
						while(_g1 < _g2) {
							var i = _g1++;
							_g.push(null);
						}
						var currentPointerPositions = _g;
						var _g = 0;
						var _g1 = this.dragPointerIdentifiers.length;
						while(_g < _g1) {
							var i = _g++;
							currentPointerCityPositions[i] = mouse.pointerCityPosition.h[this.dragPointerIdentifiers[i]];
							currentPointerPositions[i] = mouse.pointerPosition.h[this.dragPointerIdentifiers[i]];
						}
						if(currentPointerCityPositions.indexOf(null) != -1) {
							this.startViewDrag();
						} else {
							var _this = common_ArrayExtensions.sumFPoint(currentPointerPositions);
							var withFloat = 1 / currentPointerCityPositions.length;
							var newCenterPointerPos = new common_FPoint(_this.x * withFloat,_this.y * withFloat);
							var _this = common_ArrayExtensions.sumFPoint(this.dragInitialPointerPositions);
							var withFloat = 1 / this.dragInitialPointerPositions.length;
							var initialCenterPointerPos = new common_FPoint(_this.x * withFloat,_this.y * withFloat);
							var newPointerDistance = Math.max(1,common_ArrayExtensions.sum(currentPointerPositions,function(pnt) {
								return common_FPoint.distance(newCenterPointerPos,new common_FPoint(pnt.x,pnt.y));
							}));
							var initialPointerDistance = Math.max(1,common_ArrayExtensions.sum(this.dragInitialPointerPositions,function(pnt) {
								return common_FPoint.distance(initialCenterPointerPos,new common_FPoint(pnt.x,pnt.y));
							}));
							var val = newPointerDistance / initialPointerDistance * this.originalTwoFingerDragZoom;
							var val1 = this.get_game().scaling / 2;
							var maxVal = Settings.allowMoreZoom ? 1 : 2;
							var minVal = Math.floor(val1 < 1 ? 1 : val1 > maxVal ? maxVal : val1);
							var maxVal = 7 * (this.get_game().scaling / 2);
							this.setZoom(val < minVal ? minVal : val > maxVal ? maxVal : val,mouse);
							if(!this.city.viewIsControlled) {
								var _g = 0;
								var _g1 = this.dragPointerIdentifiers.length;
								while(_g < _g1) {
									var i = _g++;
									currentPointerCityPositions[i] = mouse.pointerCityPosition.h[this.dragPointerIdentifiers[i]];
								}
								var _this = common_ArrayExtensions.sumFPoint(currentPointerCityPositions);
								var withFloat = 1 / currentPointerCityPositions.length;
								var newCenterPosition_x = _this.x * withFloat;
								var newCenterPosition_y = _this.y * withFloat;
								var _this = common_ArrayExtensions.sumFPoint(this.dragPreviousCityPointerPositions);
								var withFloat = 1 / this.dragPreviousCityPointerPositions.length;
								var oldCenterPosition_x = _this.x * withFloat;
								var oldCenterPosition_y = _this.y * withFloat;
								var thisDragDir_x = oldCenterPosition_x - newCenterPosition_x;
								var thisDragDir_y = oldCenterPosition_y - newCenterPosition_y;
								this.dragDir.x = this.dragDir.x * 0.4 + 0.6 * thisDragDir_x;
								this.dragDir.y = this.dragDir.y * 0.4 + 0.6 * thisDragDir_y;
								var _this = this.city.viewPos;
								var val = new common_FPoint(_this.x + thisDragDir_x,_this.y + thisDragDir_y);
								this.city.viewPos = val;
								this.updateMovingView();
							}
							var _g = 0;
							var _g1 = this.dragPointerIdentifiers.length;
							while(_g < _g1) {
								var i = _g++;
								this.dragPreviousCityPointerPositions[i] = mouse.calcCityFPositionForPointer(this.get_game(),this.city,this.dragPointerIdentifiers[i]);
							}
						}
					}
				} else {
					var scaledCityPos;
					if(!mouse.down && mouse.pointerDown.length > 0) {
						scaledCityPos = mouse.pointerCityScaledPosition.h[mouse.pointerDown[0]];
					} else {
						scaledCityPos = mouse.cityScaledPosition;
					}
					var _this = this.dragPreviousMousePos;
					var thisDragDir_x = _this.x - scaledCityPos.x;
					var thisDragDir_y = _this.y - scaledCityPos.y;
					this.dragDir.x = this.dragDir.x * 0.4 + 0.6 * thisDragDir_x;
					this.dragDir.y = this.dragDir.y * 0.4 + 0.6 * thisDragDir_y;
					var _this = this.city.viewPos;
					var val = new common_FPoint(_this.x + thisDragDir_x,_this.y + thisDragDir_y);
					this.city.viewPos = val;
					this.dragPreviousMousePos = scaledCityPos;
					this.updateMovingView();
				}
			}
			if(!this.isDraggingView) {
				if(mouse.pressed || this.dragDir.get_length() < 0.5) {
					this.dragDir.x = 0;
					this.dragDir.y = 0;
					this.dragDirRemaining.x = 0;
					this.dragDirRemaining.y = 0;
				} else {
					var dragSpeedTimeout = mouse.isTouch ? 0.933 : 0.8;
					this.dragDir.x *= dragSpeedTimeout;
					this.dragDir.y *= dragSpeedTimeout;
					var stepDragDir_x = this.dragDir.x + this.dragDirRemaining.x;
					var stepDragDir_y = this.dragDir.y + this.dragDirRemaining.y;
					this.dragDirRemaining.x += this.dragDir.x - stepDragDir_x;
					this.dragDirRemaining.y += this.dragDir.y - stepDragDir_y;
					var _this = this.city.viewPos;
					var val = new common_FPoint(_this.x + stepDragDir_x,_this.y + stepDragDir_y);
					this.city.viewPos = val;
					this.updateMovingView();
				}
			}
		} else {
			this.isDraggingView = false;
			this.isDraggingViewTwoPointer = false;
		}
	}
	,startViewDrag: function() {
		var mouse = this.get_game().mouse;
		if(mouse.pointerDown.length >= 2) {
			this.dragPointerIdentifiers = mouse.pointerDown.slice();
			var _g = [];
			var _g1 = 0;
			var _g2 = this.dragPointerIdentifiers.length;
			while(_g1 < _g2) {
				var i = _g1++;
				_g.push(null);
			}
			this.dragPreviousCityPointerPositions = _g;
			var _g = [];
			var _g1 = 0;
			var _g2 = this.dragPointerIdentifiers.length;
			while(_g1 < _g2) {
				var i = _g1++;
				_g.push(null);
			}
			this.dragInitialPointerPositions = _g;
			var _g = 0;
			var _g1 = this.dragPointerIdentifiers.length;
			while(_g < _g1) {
				var i = _g++;
				this.dragPreviousCityPointerPositions[i] = mouse.pointerCityPosition.h[this.dragPointerIdentifiers[i]];
				this.dragInitialPointerPositions[i] = mouse.pointerPosition.h[this.dragPointerIdentifiers[i]];
			}
			this.isDraggingViewTwoPointer = true;
			this.originalTwoFingerDragZoom = this.city.zoomScale;
		} else {
			if(!mouse.down && mouse.pointerDown.length > 0) {
				this.dragPreviousMousePos = mouse.pointerCityScaledPosition.h[mouse.pointerDown[0]];
			} else {
				this.dragPreviousMousePos = mouse.cityScaledPosition;
			}
			this.isDraggingViewTwoPointer = false;
		}
		this.dragDir = new common_FPoint(0,0);
		this.isDraggingView = true;
	}
	,zoomIn: function(mouse) {
		if(this.city.zoomScale < Math.max(7,7 * (this.get_game().scaling / 2))) {
			this.setZoom(Math.round(this.city.zoomScale + 1),mouse);
		}
	}
	,zoomOut: function(mouse) {
		if(this.city.zoomScale > 1) {
			this.setZoom(Math.max(Math.round(this.city.zoomScale - 1),1),mouse);
		}
	}
	,setZoom: function(newZoomScale,mouse) {
		var oldCityPos = new common_FPoint(0,0);
		if(mouse != null && this.isDraggingView && this.isDraggingViewTwoPointer) {
			oldCityPos = common_Point.mean(mouse.calcCityPositionForPointer(this.get_game(),this.city,this.dragPointerIdentifiers[0]),mouse.calcCityPositionForPointer(this.get_game(),this.city,this.dragPointerIdentifiers[1]));
		}
		var oldZoomScale = this.city.zoomScale;
		this.city.zoomScale = newZoomScale;
		this.city.resize();
		if(mouse != null) {
			if(this.isDraggingView && this.isDraggingViewTwoPointer) {
				var _g = 0;
				var _g1 = this.dragPointerIdentifiers.length;
				while(_g < _g1) {
					var i = _g++;
					var this1 = mouse.pointerCityPosition;
					var k = this.dragPointerIdentifiers[i];
					var v = mouse.calcCityFPositionForPointer(this.get_game(),this.city,this.dragPointerIdentifiers[i]);
					this1.h[k] = v;
				}
			} else {
				var newCityPosition = mouse.calcCityPosition(this.get_game(),this.city);
				this.city.viewPos.x += mouse.cityPosition.x - newCityPosition.x;
				this.city.viewPos.y += mouse.cityPosition.y - newCityPosition.y;
			}
		}
		this.updateMovingView();
	}
	,handleScrollbarZoom: function(mouse) {
		if(mouse.isTouch && !Main.isIPadVersionOnAMac) {
			return;
		}
		if(Math.abs(this.remZoomScrollBarMovement) < 0.75) {
			this.remZoomScrollBarMovement = 0;
		} else {
			var num = this.remZoomScrollBarMovement;
			this.remZoomScrollBarMovement -= (num > 0 ? 1 : num < 0 ? -1 : 0) * 0.75;
		}
		this.remZoomScrollBarMovement += mouse.scrollBarMovement + mouse.scrollBarMovementPages * this.get_game().rect.height * this.get_game().scaling;
		if(this.remZoomScrollBarMovement >= 15) {
			this.zoomOut(mouse);
			this.remZoomScrollBarMovement = 0;
		} else if(this.remZoomScrollBarMovement <= -15) {
			this.zoomIn(mouse);
			this.remZoomScrollBarMovement = 0;
		}
	}
	,__class__: CityView
};
