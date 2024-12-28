var progress_CityIntro = $hxClasses["progress.CityIntro"] = function(city) {
	this.city = city;
	city.enableDisplayOnly();
	this.spaceShipSprite = new PIXI.Sprite(Resources.getTexture("spr_explorationship"));
};
progress_CityIntro.__name__ = "progress.CityIntro";
progress_CityIntro.prototype = {
	update: function(timeMod) {
		this.city.gui.stage.visible = false;
		this.city.gui.windowStage.visible = false;
		if(this.spaceShipSprite != null && this.spaceShipSprite.parent == null) {
			this.city.cityMidStage.addChild(this.spaceShipSprite);
			this.spaceShipSprite.position.set(this.city.viewPos.x,this.city.viewPos.y);
		}
	}
	,handleMouse: function(mouse) {
		this.spaceShipSprite.x = mouse.cityPosition.x;
		if(mouse.pressed) {
			this.city.disableDisplayOnlyMode(null);
			this.city.gui.stage.visible = true;
			this.city.gui.windowStage.visible = true;
			this.city.progress.cityIntro = null;
		}
		return true;
	}
	,__class__: progress_CityIntro
};
