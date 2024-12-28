var gui_InfoBox = $hxClasses["gui.InfoBox"] = function(gui,stage,parent,onUpdate,iconTexture,minWidth,onHover,backgroundSpriteName,shouldShowInfinitySign) {
	if(backgroundSpriteName == null) {
		backgroundSpriteName = "spr_9p_info";
	}
	if(minWidth == null) {
		minWidth = 0;
	}
	this.showingInfinitySign = false;
	this.additionalSprite = null;
	if(shouldShowInfinitySign == null) {
		this.shouldShowInfinitySign = function() {
			return false;
		};
	} else {
		this.shouldShowInfinitySign = shouldShowInfinitySign;
	}
	var backgroundPatch = backgroundSpriteName == "none" ? null : new gui_NinePatch(Resources.getTexture(backgroundSpriteName),2,10,14);
	var extraSpacing = gui.game.isMobile ? 3 : 0;
	gui_GUIContainer.call(this,gui,stage,parent,null,null,null,backgroundPatch,{ left : 2 + extraSpacing, right : 2 + extraSpacing, top : 2 + extraSpacing, bottom : extraSpacing + (-1)});
	this.fillSecondarySize = true;
	this.fillPrimarySize = true;
	this.onHover = onHover;
	this.minWidth = minWidth;
	this.onTextUpdate = onUpdate;
	this.shouldShowInfinitySign = shouldShowInfinitySign;
	this.spriteContainer = new PIXI.Sprite(iconTexture);
	if(iconTexture != null) {
		this.addChild(new gui_ContainerHolder(this,stage,this.spriteContainer));
	}
	this.createSecondElement();
};
gui_InfoBox.__name__ = "gui.InfoBox";
gui_InfoBox.__super__ = gui_GUIContainer;
gui_InfoBox.prototype = $extend(gui_GUIContainer.prototype,{
	update: function() {
		if(this.shouldShowInfinitySign() != this.showingInfinitySign) {
			this.removeChild(this.secondElement,false);
			this.createSecondElement();
		}
		gui_GUIContainer.prototype.update.call(this);
	}
	,createSecondElement: function() {
		this.showingInfinitySign = this.shouldShowInfinitySign();
		if(this.showingInfinitySign) {
			this.secondElement = this.addChild(new gui_ContainerHolder(this,this.stage,new PIXI.Sprite(Resources.getTexture("spr_icon_unlimited"))));
		} else {
			var extraSpacingText = this.gui.game.isMobile ? 2 : 0;
			this.secondElement = new gui_TextElement(this,this.stage,null,this.onTextUpdate,null,{ left : 1 + extraSpacingText, right : 1, top : 1, bottom : 0},null,false,true);
			this.addChild(this.secondElement);
		}
	}
	,setAdditionalSprite: function(texture) {
		if(texture == null) {
			if(this.additionalSprite != null) {
				this.additionalSprite.destroy();
			}
			this.additionalSprite = null;
			return;
		}
		if(this.additionalSprite == null) {
			this.additionalSprite = new PIXI.Sprite();
		}
		this.additionalSprite.texture = texture;
		this.spriteContainer.addChild(this.additionalSprite);
	}
	,hasAdditionalSprite: function() {
		return this.additionalSprite != null;
	}
	,handleMouse: function(mouse) {
		if(this.rect.contains(mouse.position)) {
			if(this.onHover != null) {
				this.onHover();
			}
			mouse.claimMouse(this);
			return true;
		}
		return false;
	}
	,updateSize: function() {
		gui_GUIContainer.prototype.updateSize.call(this);
		this.minWidth = this.baseWidth;
	}
	,__class__: gui_InfoBox
});
