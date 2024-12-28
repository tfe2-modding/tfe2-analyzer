var common_Splash = $hxClasses["common.Splash"] = function(stage,logoUrl,logoWidth,logoHeight,width,height,displayFor,onDone) {
	this.stage = stage;
	this.splashSprite = new PIXI.Sprite(PIXI.Texture.from(logoUrl));
	stage.addChild(this.splashSprite);
	this.logoWidth = logoWidth;
	this.logoHeight = logoHeight;
	this.resize(width,height);
	this.displayTimeLeft = displayFor;
	this.onDone = onDone;
};
common_Splash.__name__ = "common.Splash";
common_Splash.prototype = {
	update: function(timeMod) {
		if(this.splashSprite.texture.baseTexture.valid) {
			this.displayTimeLeft -= timeMod;
			if(this.displayTimeLeft <= 0) {
				this.destroy();
				this.onDone();
			}
		}
	}
	,resize: function(width,height) {
		var baseScale = Math.min(width / this.logoWidth,height / this.logoHeight);
		this.splashSprite.scale.x = baseScale;
		this.splashSprite.scale.y = baseScale;
		this.splashSprite.position.set((width / this.logoWidth - baseScale) * this.logoWidth / 2,(height / this.logoHeight - baseScale) * this.logoHeight / 2);
	}
	,destroy: function() {
		this.splashSprite.destroy();
	}
	,__class__: common_Splash
};
