var gui_ResumeGameControl = $hxClasses["gui.ResumeGameControl"] = function(gui,stage,city,onDestroy) {
	this.playSpriteTint = 0;
	this.infoButton = null;
	var _gthis = this;
	this.gui = gui;
	this.stage = stage;
	this.city = city;
	this.container = new gui_GUIContainer(gui,stage,null,new common_Point(0,0),new common_FPoint(0.5,0.5));
	this.updatePosition();
	this.onDestroy = onDestroy;
	this.initUI(gui,function() {
		city.set_pauseGame(false);
		_gthis.destroyControl();
	});
};
gui_ResumeGameControl.__name__ = "gui.ResumeGameControl";
gui_ResumeGameControl.prototype = {
	updatePosition: function() {
		this.container.updatePosition(new common_Point(this.gui.game.rect.width / 2 | 0,this.gui.game.rect.height / 2 | 0));
	}
	,handleMouse: function(mouse) {
		switch(mouse.claimMouse(this)._hx_index) {
		case 0:
			this.infoButton.buttonPatch.setTextureSet(2);
			this.infoButton.mouseOut = false;
			break;
		case 1:
			this.city.set_pauseGame(false);
			this.destroyControl();
			break;
		default:
		}
		return true;
	}
	,update: function(timeMod) {
		if(!this.city.pauseGame) {
			this.destroyControl();
		} else {
			this.container.update();
		}
		var val = 0.6 * Math.sin(this.playSpriteTint / 10) + 0.5;
		var intensity = Math.floor(200 * (val < 0 ? 0 : val > 1 ? 1 : val));
		this.playSprite.tint = 256 * intensity;
		this.playSpriteTint += timeMod;
	}
	,destroyControl: function() {
		if(this.infoButton == null) {
			return;
		}
		this.infoButton.destroy();
		this.whiteGraphics.destroy();
		this.infoButton = null;
		this.onDestroy();
	}
	,initUI: function(gui,doUnpause) {
		this.whiteGraphics = new PIXI.Graphics();
		this.whiteGraphics.beginFill(16777215,0.2);
		this.whiteGraphics.drawRect(0,0,gui.game.rect.width,gui.game.rect.height);
		this.whiteGraphics.endFill();
		this.stage.addChild(this.whiteGraphics);
		this.infoButton = new gui_ContainerButton(gui,this.stage,this.container,doUnpause,null,null,"spr_button");
		this.infoButton.container.direction = gui_GUIContainerDirection.Vertical;
		this.infoButton.container.fillSecondarySize = true;
		var extraSpacing = gui.game.isMobile ? 3 : 0;
		var extraSpacingText = gui.game.isMobile ? 2 : 0;
		this.infoButton.container.padding = { left : 4 + extraSpacing, right : extraSpacing + 5, top : extraSpacing + 4, bottom : extraSpacing + 3};
		this.infoButton.container.updateSize();
		this.playSprite = new PIXI.Sprite(Resources.getTexture("spr_icon_play_big"));
		var spriteContainerHolder = new gui_ContainerHolder(this.infoButton.container,this.stage,this.playSprite,{ left : 0, right : 0, top : 2, bottom : 2});
		this.infoButton.container.addChild(spriteContainerHolder);
		this.textElem = new gui_TextElement(this.infoButton.container,this.stage,common_Localize.lo("resume"),null,"Arial16",{ left : 1 + extraSpacingText, right : 0, top : 2, bottom : 0});
		var textElem2 = new gui_TextElement(this.infoButton.container,this.stage,"(" + common_Localize.lo("tap_anywhere") + ")",null,"Arial10",{ left : 1 + extraSpacingText, right : 0, top : 2, bottom : 0});
		var val1 = this.textElem.rect.width;
		var val2 = textElem2.rect.width;
		spriteContainerHolder.padding.left = ((val2 > val1 ? val2 : val1) - spriteContainerHolder.rect.width) / 2 | 0;
		this.infoButton.container.addChild(this.textElem);
		this.infoButton.container.addChild(textElem2);
		if(this.textElem.rect.width > textElem2.rect.width) {
			textElem2.padding.left = (this.textElem.rect.width - textElem2.rect.width) / 2 | 0;
		} else {
			this.textElem.padding.left = (textElem2.rect.width - this.textElem.rect.width) / 2 | 0;
		}
		this.infoButton.container.minWidth = 200;
		this.container.insertChild(this.infoButton,0);
	}
	,__class__: gui_ResumeGameControl
};
