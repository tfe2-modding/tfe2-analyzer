var gui_HideableContainer = $hxClasses["gui.HideableContainer"] = function(parent,isShown) {
	this.alwaysUpdateChild = false;
	this.visible = true;
	this.parent = parent;
	this.isShown = isShown;
	this.rect = new common_Rectangle(0,0,0,0);
};
gui_HideableContainer.__name__ = "gui.HideableContainer";
gui_HideableContainer.__interfaces__ = [gui_IGUIElement];
gui_HideableContainer.prototype = {
	show: function() {
		this.visible = true;
		this.updateSize();
	}
	,hide: function() {
		this.visible = false;
		this.child.updatePosition(new common_Point(-10000,-10000));
		this.updateSize();
	}
	,setChild: function(child) {
		this.child = child;
		this.updateSize();
		if(this.isShown != null) {
			this.visible = this.isShown();
			if(!this.visible) {
				this.hide();
			}
		}
	}
	,updateSize: function() {
		if(this.visible && this.child != null) {
			this.rect = this.child.rect;
		} else {
			this.rect.width = 0;
			this.rect.height = 0;
		}
		if(this.parent != null) {
			this.parent.updateSize();
		}
	}
	,updatePosition: function(newPosition) {
		if(this.visible && this.child != null) {
			this.child.updatePosition(newPosition);
		}
	}
	,destroy: function() {
		if(this.child != null) {
			this.child.destroy();
		}
	}
	,handleMouse: function(mouse) {
		if(this.visible && this.child != null) {
			return this.child.handleMouse(mouse);
		}
		return false;
	}
	,update: function() {
		if(this.isShown != null) {
			var newVisible = this.isShown();
			if(newVisible != this.visible) {
				this.visible = newVisible;
				if(this.visible) {
					this.show();
				} else {
					this.hide();
				}
			}
		}
		if((this.visible || this.alwaysUpdateChild) && this.child != null) {
			this.child.update();
		}
	}
	,__class__: gui_HideableContainer
};
