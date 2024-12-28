var gui_CheckboxButton = $hxClasses["gui.CheckboxButton"] = function(gui,stage,parent,action,isChecked,isActive,onHover,buttonSpriteName,buttonSpriteNameChecked) {
	if(buttonSpriteNameChecked == null) {
		buttonSpriteNameChecked = "spr_button_checked";
	}
	if(buttonSpriteName == null) {
		buttonSpriteName = "spr_button";
	}
	gui_Button.call(this,gui,stage,parent,action,isActive);
	var buttonTextures = Resources.getTextures(buttonSpriteName,3);
	var buttonTexturesChecked = Resources.getTextures(buttonSpriteNameChecked,3);
	this.buttonPatch = new gui_NinePatch(buttonTextures[0],2,20,20);
	this.buttonPatch.texture = buttonTextures[1];
	this.buttonPatch.updateTextures(false);
	this.buttonPatch.texture = buttonTextures[2];
	this.buttonPatch.updateTextures(false);
	this.buttonPatch.texture = buttonTexturesChecked[0];
	this.buttonPatch.updateTextures(false);
	this.buttonPatch.texture = buttonTexturesChecked[1];
	this.buttonPatch.updateTextures(false);
	this.buttonPatch.texture = buttonTexturesChecked[2];
	this.buttonPatch.updateTextures(false);
	this.buttonPatch.setTextureSet(0);
	stage.addChild(this.buttonPatch);
	this.container = new gui_GUIContainer(gui,stage,this);
	this.rect = new common_Rectangle(0,0,2,2);
	this.isChecked = isChecked;
};
gui_CheckboxButton.__name__ = "gui.CheckboxButton";
gui_CheckboxButton.createSettingButton = function(gui,stage,parent,onClick,isChecked,text) {
	var containerButton = new gui_CheckboxButton(gui,stage,parent,onClick,isChecked);
	var infoContainer = containerButton.container;
	infoContainer.padding.top = 3;
	infoContainer.padding.left = 3;
	infoContainer.padding.right = 3;
	infoContainer.padding.bottom = 1;
	infoContainer.fillSecondarySize = true;
	if(Main.isMobile) {
		infoContainer.padding.top += 2;
		infoContainer.padding.bottom += 2;
	}
	var checkboxTextures = Resources.getTextures("spr_checkbox",2);
	var spr = new PIXI.Sprite(checkboxTextures[1]);
	var spriteContainerHolder = new gui_ContainerHolder(infoContainer,gui.innerWindowStage,spr,{ left : 0, right : 3, top : 0, bottom : 0},function() {
		var checkboxTextures1 = checkboxTextures;
		var spriteContainerHolder = isChecked() ? 0 : 1;
		spr.texture = checkboxTextures1[spriteContainerHolder];
	});
	infoContainer.addChild(spriteContainerHolder);
	infoContainer.addChild(new gui_TextElement(infoContainer,gui.innerWindowStage,text));
	parent.addChild(containerButton);
};
gui_CheckboxButton.__super__ = gui_Button;
gui_CheckboxButton.prototype = $extend(gui_Button.prototype,{
	updatePosition: function(newPosition) {
		gui_Button.prototype.updatePosition.call(this,newPosition);
		this.buttonPatch.position.set(newPosition.x,newPosition.y);
		this.buttonPatch.updateSprites();
		this.container.updatePosition(newPosition);
	}
	,updateSize: function() {
		if(this.container != null) {
			this.rect.width = this.container.rect.width;
			this.rect.height = this.container.rect.height;
			this.updateSizeDisplay();
			if(this.parent != null) {
				this.parent.updateSize();
			}
			this.container.minWidth = this.container.baseWidth;
		}
	}
	,updateSizeDisplay: function() {
		if(this.container != null) {
			this.buttonPatch.npWidth = this.rect.width;
			this.buttonPatch.npHeight = this.rect.height;
			this.buttonPatch.updateSprites();
		}
	}
	,handleMouse: function(mouse) {
		var _gthis = this;
		var checked = this.isChecked();
		return gui_Button.prototype.doHandleMouse.call(this,mouse,function() {
			_gthis.buttonPatch.setTextureSet(checked ? 4 : 1);
		},function() {
			_gthis.buttonPatch.setTextureSet(checked ? 5 : 2);
		});
	}
	,update: function() {
		this.container.update();
		if(this.mouseOut) {
			this.buttonPatch.setTextureSet(this.isChecked() ? 3 : 0);
		}
		if(this.isActive()) {
			this.buttonPatch.setTextureSet(this.isChecked() ? 5 : 2);
		}
		gui_Button.prototype.update.call(this);
	}
	,destroy: function() {
		gui_Button.prototype.destroy.call(this);
		this.container.destroy();
		this.buttonPatch.destroy();
	}
	,__class__: gui_CheckboxButton
});
