var simulation_winter_Snow = $hxClasses["simulation.winter.Snow"] = function(city) {
	this.hasCreated = false;
	this.city = city;
	this.snowSprites = [];
};
simulation_winter_Snow.__name__ = "simulation.winter.Snow";
simulation_winter_Snow.prototype = {
	update: function(timeMod) {
		if(this.hasCreated) {
			return;
		}
		this.hasCreated = true;
		var cityEdges = this.city.getCityEdges();
		var snowTextures = Resources.getTexturesByWidth("spr_snow",20);
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var world = _g1[_g];
			++_g;
			if(world.rect.height == 0) {
				continue;
			}
			var _g2 = 0;
			var _g3 = world.permanents.length;
			while(_g2 < _g3) {
				var xx = _g2++;
				var snowSprite = new PIXI.Sprite(random_Random.fromArray(snowTextures));
				snowSprite.position.set(world.rect.x + xx * 20,world.rect.y - 20 + 17);
				this.city.furtherForegroundStage.addChild(snowSprite);
			}
		}
	}
	,__class__: simulation_winter_Snow
};
