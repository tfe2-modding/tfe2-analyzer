var common_PleaseRotateDevice = $hxClasses["common.PleaseRotateDevice"] = function(stage) {
	this.text2 = null;
	this.stage = stage;
	this.subStage1 = new PIXI.Container();
	stage.addChild(this.subStage1);
	this.subStage2 = new PIXI.Container();
	stage.addChild(this.subStage2);
	this.logoSprite = new PIXI.Sprite(Resources.getTexture("spr_title"));
	this.subStage2.addChild(this.logoSprite);
	this.graphics = new PIXI.Graphics();
	this.subStage1.addChild(this.graphics);
	if(jsFunctions.orientationLockSupported()) {
		this.text = new graphics_BitmapText("Please tap anywhere to continue.",{ font : "Arial18", tint : 16777215});
		this.text2 = new graphics_BitmapText("(if this has no effect, please rotate your device manually)",{ font : "Arial16", tint : 12632256});
		this.text.get_anchor().set(0.5,1);
		this.text2.get_anchor().set(0.5,1);
	} else {
		this.text = new graphics_BitmapText("Please rotate your device to continue.",{ font : "Arial18", tint : 16777215});
		this.text.get_anchor().set(0.5,1);
	}
	this.text.set_align("center");
	if(this.text2 != null) {
		this.text2.set_align("center");
		this.subStage1.addChild(this.text2);
	}
	this.subStage1.addChild(this.text);
};
common_PleaseRotateDevice.__name__ = "common.PleaseRotateDevice";
common_PleaseRotateDevice.prototype = {
	update: function(width,height,scaling) {
		this.subStage1.scale.x = this.subStage1.scale.y = scaling;
		var val1 = Math.floor(width * scaling / this.logoSprite.width);
		var subStage2Scale = 1 > val1 ? 1 : val1;
		this.subStage2.scale.x = this.subStage2.scale.y = subStage2Scale;
		this.logoSprite.anchor.set(0.5,0);
		this.logoSprite.position.set(width / subStage2Scale * scaling / 2,20);
		this.graphics.clear();
		this.graphics.beginFill(2626656,1).drawRect(0,0,width,height);
		this.text.set_maxWidth(width - 20);
		if(this.text2 != null) {
			this.text2.set_maxWidth(width - 20);
			this.text2.position.set(width / 2,height - 20);
			this.text.position.set(width / 2,height - 20 - this.text2.get_textHeight() - 10);
		} else {
			this.text.position.set(width / 2,height - 20);
		}
	}
	,destroy: function() {
		this.subStage1.destroy();
		this.subStage2.destroy();
	}
	,__class__: common_PleaseRotateDevice
};
