var gui_GUIContainer = $hxClasses["gui.GUIContainer"] = function(gui,stage,parent,position,origin,children,background,padding) {
	this.neverDownsize = false;
	this.minHeight = 0;
	this.minWidth = 0;
	this.fillPrimarySize = false;
	this.fillSecondarySize = false;
	this.direction = gui_GUIContainerDirection.Horizontal;
	this.alignment = gui_GUIContainerAlignment.LeftOrTop;
	this.parent = parent;
	this.stage = stage;
	this.gui = gui;
	this.children = children == null ? [] : children;
	this.background = background;
	if(padding == null) {
		padding = { top : 0, right : 0, bottom : 0, left : 0};
	}
	this.padding = padding;
	if(background != null) {
		stage.addChild(background);
	}
	this.rect = new common_Rectangle(0,0,0,0);
	this.origin = origin == null ? new common_FPoint(0,0) : origin;
	if(position == null) {
		position = new common_Point(0,0);
	}
	this.updatePosition(position);
	this.updateSize();
};
gui_GUIContainer.__name__ = "gui.GUIContainer";
gui_GUIContainer.__interfaces__ = [gui_IGUIElement];
gui_GUIContainer.prototype = {
	handleMouse: function(mouse) {
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.handleMouse(mouse)) {
				return true;
			}
		}
		if(this.background != null && this.rect.contains(mouse.position)) {
			mouse.claimMouse(this);
			return true;
		}
		return false;
	}
	,update: function() {
		if(this.onUpdate != null) {
			this.onUpdate();
		}
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.update();
		}
	}
	,updateSize: function() {
		this.updateSizeNonRecursive();
		if(this.parent != null) {
			this.parent.updateSize();
		} else {
			this.updateChildrenPosition();
		}
	}
	,updateSizeNonRecursive: function() {
		this.rect.width = 0;
		this.rect.height = 0;
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(((child) instanceof gui_GUIFiller)) {
				continue;
			}
			if(((child) instanceof gui_GUIContainer)) {
				var childContainer = child;
				if(this.direction == gui_GUIContainerDirection.Horizontal) {
					this.rect.width += childContainer.originalRectWidth;
					var val1 = this.rect.height;
					var val2 = childContainer.originalRectHeight;
					this.rect.height = val2 > val1 ? val2 : val1;
				} else {
					var val11 = this.rect.width;
					var val21 = childContainer.originalRectWidth;
					this.rect.width = val21 > val11 ? val21 : val11;
					this.rect.height += childContainer.originalRectHeight;
				}
			} else if(((child) instanceof gui_ContainerButton) && child.container.fillPrimarySize) {
				var childContainer1 = child.container;
				if(this.direction == gui_GUIContainerDirection.Horizontal) {
					this.rect.width += childContainer1.originalRectWidth;
					var val12 = this.rect.height;
					var val22 = childContainer1.originalRectHeight;
					this.rect.height = val22 > val12 ? val22 : val12;
				} else {
					var val13 = this.rect.width;
					var val23 = childContainer1.originalRectWidth;
					this.rect.width = val23 > val13 ? val23 : val13;
					this.rect.height += childContainer1.originalRectHeight;
				}
			} else if(this.direction == gui_GUIContainerDirection.Horizontal) {
				this.rect.width += child.rect.width;
				var val14 = this.rect.height;
				var val24 = child.rect.height;
				this.rect.height = val24 > val14 ? val24 : val14;
			} else {
				var val15 = this.rect.width;
				var val25 = child.rect.width;
				this.rect.width = val25 > val15 ? val25 : val15;
				this.rect.height += child.rect.height;
			}
		}
		if(this.neverDownsize) {
			if(this.rect.width > this.minWidth) {
				this.minWidth = this.rect.width;
			}
			if(this.rect.height > this.minHeight) {
				this.minHeight = this.rect.height;
			}
		}
		if(this.rect.width < this.minWidth) {
			this.rect.width = this.minWidth;
		}
		if(this.rect.height < this.minHeight) {
			this.rect.height = this.minHeight;
		}
		this.baseWidth = this.rect.width;
		this.baseHeight = this.rect.height;
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(((child) instanceof gui_GUIFiller)) {
				var childFiller = child;
				switch(this.direction._hx_index) {
				case 0:
					this.rect.width += childFiller.minFill;
					break;
				case 1:
					this.rect.height += childFiller.minFill;
					break;
				}
			}
		}
		this.rect.width += this.padding.left + this.padding.right;
		this.rect.height += this.padding.top + this.padding.bottom;
		this.originalRectWidth = this.rect.width;
		this.originalRectHeight = this.rect.height;
		this.nonBaseWidth = this.rect.width - this.baseWidth;
		this.nonBaseHeight = this.rect.height - this.baseHeight;
	}
	,updateBackgroundSize: function() {
		if(this.background != null) {
			var oldBackgroundWidth = this.background.npWidth;
			var oldBackgroundHeight = this.background.npHeight;
			this.background.npWidth = this.rect.width;
			this.background.npHeight = this.rect.height;
			if(this.background != null) {
				this.background.position.x = this.rect.x;
				this.background.position.y = this.rect.y;
				this.background.updateSprites();
			}
			if(oldBackgroundWidth != this.background.npWidth || oldBackgroundHeight != this.background.npHeight) {
				this.background.updateSprites();
			}
		}
	}
	,updatePosition: function(newPosition) {
		this.position = newPosition;
		this.updateChildrenPosition();
		if(this.background != null) {
			this.background.position.x = this.rect.x;
			this.background.position.y = this.rect.y;
			this.background.updateSprites();
		}
	}
	,updateChildrenPosition: function() {
		var _this = this.rect;
		var _this1 = this.position;
		var otherPoint_x = this.origin.x * this.rect.width | 0;
		var otherPoint_y = this.origin.y * this.rect.height | 0;
		var newPos_x = _this1.x - otherPoint_x;
		var newPos_y = _this1.y - otherPoint_y;
		var inlPoint_x = _this.x = newPos_x;
		var inlPoint_y = _this.y = newPos_y;
		var extraFillAmount = 0;
		var extraFillNumberLeft = 0;
		if(this.rect.width > this.originalRectWidth || this.rect.height > this.originalRectHeight) {
			var originalChildrenSize = 0;
			var _g = 0;
			var _g1 = this.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(((child) instanceof gui_GUIContainer) && child.fillPrimarySize) {
					var childContainer = child;
					++extraFillNumberLeft;
					switch(this.direction._hx_index) {
					case 0:
						originalChildrenSize += childContainer.originalRectWidth;
						break;
					case 1:
						originalChildrenSize += childContainer.originalRectHeight;
						break;
					}
				} else if(((child) instanceof gui_ContainerButton) && child.container.fillPrimarySize) {
					var childContainer1 = child.container;
					++extraFillNumberLeft;
					switch(this.direction._hx_index) {
					case 0:
						originalChildrenSize += childContainer1.originalRectWidth;
						break;
					case 1:
						originalChildrenSize += childContainer1.originalRectHeight;
						break;
					}
				} else {
					switch(this.direction._hx_index) {
					case 0:
						originalChildrenSize += child.rect.width;
						break;
					case 1:
						originalChildrenSize += child.rect.height;
						break;
					}
				}
			}
			if(extraFillNumberLeft >= 0) {
				switch(this.direction._hx_index) {
				case 0:
					originalChildrenSize -= this.nonBaseWidth;
					extraFillAmount = this.rect.width - originalChildrenSize;
					break;
				case 1:
					originalChildrenSize -= this.nonBaseHeight;
					extraFillAmount = this.rect.height - originalChildrenSize;
					break;
				}
			}
		}
		var secundarySizeFillWidth = this.rect.width - this.padding.left - this.padding.right;
		var secundarySizeFillHeight = this.rect.height - this.padding.top - this.padding.bottom;
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(((child) instanceof gui_GUIFiller)) {
				switch(this.direction._hx_index) {
				case 0:
					child.rect.width = this.rect.width - this.padding.left - this.padding.right - this.baseWidth;
					break;
				case 1:
					child.rect.height = this.rect.height - this.padding.top - this.padding.bottom - this.baseHeight;
					break;
				}
			} else if(((child) instanceof gui_ContainerButton) || ((child) instanceof gui_CheckboxButton)) {
				var childContainerButton = child;
				if(childContainerButton.container.fillSecondarySize) {
					if(this.direction == gui_GUIContainerDirection.Horizontal) {
						child.rect.height = secundarySizeFillHeight;
						childContainerButton.container.rect.height = secundarySizeFillHeight;
					} else {
						child.rect.width = secundarySizeFillWidth;
						childContainerButton.container.rect.width = secundarySizeFillWidth;
					}
				}
				if(childContainerButton.container.fillPrimarySize) {
					var thisFillAmount = extraFillAmount / extraFillNumberLeft | 0;
					switch(this.direction._hx_index) {
					case 0:
						child.rect.width = childContainerButton.container.originalRectWidth + thisFillAmount;
						break;
					case 1:
						child.rect.height = childContainerButton.container.originalRectHeight + thisFillAmount;
						break;
					}
					extraFillAmount -= thisFillAmount;
					--extraFillNumberLeft;
				}
				childContainerButton.updateSizeDisplay();
			} else if(((child) instanceof gui_GUIContainer)) {
				var childContainer = child;
				if(childContainer.fillSecondarySize) {
					if(this.direction == gui_GUIContainerDirection.Horizontal) {
						child.rect.height = secundarySizeFillHeight;
					} else {
						child.rect.width = secundarySizeFillWidth;
					}
				}
				if(childContainer.fillPrimarySize) {
					var thisFillAmount1 = extraFillAmount / extraFillNumberLeft | 0;
					switch(this.direction._hx_index) {
					case 0:
						child.rect.width = childContainer.originalRectWidth + thisFillAmount1;
						break;
					case 1:
						child.rect.height = childContainer.originalRectHeight + thisFillAmount1;
						break;
					}
					extraFillAmount -= thisFillAmount1;
					--extraFillNumberLeft;
				}
			}
		}
		var x = this.rect.x + this.padding.left;
		var y = this.rect.y + this.padding.top;
		switch(this.direction._hx_index) {
		case 0:
			var _g = 0;
			var _g1 = this.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(((child) instanceof gui_GUIContainer)) {
					var childContainer = child;
					switch(childContainer.alignment._hx_index) {
					case 0:
						child.updatePosition(new common_Point(x,y));
						break;
					case 1:
						child.updatePosition(new common_Point(x,y + ((this.rect.height - this.padding.top - this.padding.bottom - child.rect.height) / 2 | 0)));
						break;
					case 2:
						child.updatePosition(new common_Point(x,this.rect.get_y2() - this.padding.bottom - child.rect.height));
						break;
					}
				} else {
					child.updatePosition(new common_Point(x,y));
				}
				x += child.rect.width;
			}
			break;
		case 1:
			var _g = 0;
			var _g1 = this.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(((child) instanceof gui_GUIContainer)) {
					var childContainer = child;
					switch(childContainer.alignment._hx_index) {
					case 0:
						child.updatePosition(new common_Point(x,y));
						break;
					case 1:
						child.updatePosition(new common_Point(x + ((this.rect.width - this.padding.left - this.padding.right - child.rect.width) / 2 | 0),y));
						break;
					case 2:
						child.updatePosition(new common_Point(this.rect.get_x2() - child.rect.width - this.padding.right,y));
						break;
					}
				} else {
					child.updatePosition(new common_Point(x,y));
				}
				y += child.rect.height;
			}
			break;
		}
		this.updateBackgroundSize();
	}
	,addChild: function(child) {
		this.children.push(child);
		this.updateSize();
		return child;
	}
	,addChildWithoutSizeUpdate: function(child) {
		this.children.push(child);
		return child;
	}
	,insertChild: function(child,atPosition) {
		this.children.splice(atPosition,0,child);
		this.updateSize();
		return child;
	}
	,removeChild: function(child,thenUpdateSize) {
		if(thenUpdateSize == null) {
			thenUpdateSize = true;
		}
		child.destroy();
		HxOverrides.remove(this.children,child);
		if(thenUpdateSize) {
			this.updateSize();
		}
	}
	,clear: function() {
		Lambda.iter(this.children,function(c) {
			c.destroy();
		});
		this.children = [];
		this.updateSize();
	}
	,destroy: function() {
		if(this.onDestroy != null) {
			this.onDestroy();
		}
		Lambda.iter(this.children,function(c) {
			c.destroy();
		});
		if(this.background != null) {
			this.background.destroy();
		}
	}
	,__class__: gui_GUIContainer
};
