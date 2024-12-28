var gui_ContainerWithScrollbar = $hxClasses["gui.ContainerWithScrollbar"] = function(maxWidthWithoutScrollbar,maxHeight,gui,stage,parent,position,origin,children,background,padding,extraPadding,scrollbarTexture) {
	if(scrollbarTexture == null) {
		scrollbarTexture = "spr_windowparts";
	}
	if(extraPadding == null) {
		extraPadding = 1;
	}
	this.disableScrollbar = false;
	this.setScrollPositionNextUpdate = null;
	this.extraPadding = 1;
	this.scrollable = null;
	gui_GUIContainer.call(this,gui,stage,parent,position,origin,children,background,padding);
	this.maxWidthWithoutScrollbar = maxWidthWithoutScrollbar;
	this.maxHeight = maxHeight;
	this.scrollbar = null;
	this.extraPadding = extraPadding;
	this.scrollbarTexture = scrollbarTexture;
};
gui_ContainerWithScrollbar.__name__ = "gui.ContainerWithScrollbar";
gui_ContainerWithScrollbar.__super__ = gui_GUIContainer;
gui_ContainerWithScrollbar.prototype = $extend(gui_GUIContainer.prototype,{
	setInnerContainer: function(container) {
		this.clear();
		var paddingContainer = new gui_GUIContainer(this.gui,this.stage,this,null,null,null,null,{ top : this.extraPadding, right : this.extraPadding, bottom : this.extraPadding, left : this.extraPadding});
		this.addChild(paddingContainer);
		this.scrollable = new gui_AutoScrollable(this.gui.game,this.stage,paddingContainer,new common_Point(0,0),this.maxWidthWithoutScrollbar,this.maxHeight,new common_FPoint(0,0));
		this.innerContainer = container;
		this.innerContainer.parent = this.scrollable;
		this.scrollable.setChild(this.innerContainer);
		paddingContainer.addChild(this.scrollable);
	}
	,addScrollBar: function() {
		if(this.disableScrollbar) {
			return;
		}
		this.scrollbar = new gui_ScrollBar(this,this.stage,this.scrollable,this.scrollbarTexture);
		this.addChild(this.scrollbar);
	}
	,setScrollPosition: function(scrollPosition) {
		if(this.scrollable != null) {
			this.scrollable.updateScrollPosition(scrollPosition);
		}
		if(this.scrollbar != null) {
			this.scrollbar.redraw();
		}
	}
	,forceSetScrollPosition: function(scrollPosition) {
		this.setScrollPosition(new common_Point(scrollPosition.x,scrollPosition.y));
		this.setScrollPositionNextUpdate = scrollPosition;
	}
	,update: function() {
		gui_GUIContainer.prototype.update.call(this);
		if(this.setScrollPositionNextUpdate != null) {
			this.setScrollPosition(this.setScrollPositionNextUpdate);
			this.setScrollPositionNextUpdate = null;
		}
	}
	,updateSize: function() {
		if(this.scrollable != null) {
			if(this.scrollbar != null) {
				if(this.scrollable.rect.height >= this.scrollable.get_innerHeight()) {
					this.removeChild(this.scrollbar,false);
					this.scrollbar = null;
				}
			} else if(this.scrollbar == null) {
				if(this.scrollable.rect.height < this.scrollable.get_innerHeight()) {
					this.addScrollBar();
				}
			}
		}
		if(this.scrollbar != null && this.scrollable != null) {
			this.scrollbar.rect.height = this.scrollable.rect.height + this.extraPadding * 2;
		}
		gui_GUIContainer.prototype.updateSize.call(this);
	}
	,__class__: gui_ContainerWithScrollbar
});
