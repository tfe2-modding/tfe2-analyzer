var graphics_Stars = $hxClasses["graphics.Stars"] = function(stage,city) {
	this.maxStarY = 800;
	this.maxStarX = 800;
	this.stage = stage;
	this.city = city;
	this.sprites = [];
	this.cloudsAlpha = 0;
	this.resize();
};
graphics_Stars.__name__ = "graphics.Stars";
graphics_Stars.prototype = {
	get_requiredNumberOfStars: function() {
		return this.maxStarX * this.maxStarY / 1000 | 0;
	}
	,resize: function() {
		var xScale = 1.0;
		var yScale = 1.0;
		if(this.city.get_displayWidth() > this.maxStarX) {
			xScale = this.city.get_displayWidth() / this.maxStarX;
			this.maxStarX = this.city.get_displayWidth();
		}
		if(this.city.get_displayHeight() > this.maxStarY) {
			yScale = this.city.get_displayHeight() / this.maxStarY;
			this.maxStarY = this.city.get_displayHeight();
		}
		if(xScale != 1.0 || yScale != 1.0) {
			var _g = 0;
			var _g1 = this.sprites;
			while(_g < _g1.length) {
				var spr = _g1[_g];
				++_g;
				spr.position.x *= xScale;
				spr.position.y *= yScale;
			}
		}
		var _g = this.sprites.length;
		var _g1 = this.get_requiredNumberOfStars();
		while(_g < _g1) {
			var i = _g++;
			var posX = random_Random.getInt(this.maxStarX);
			var posY = random_Random.getInt(this.maxStarY);
			var spr = Resources.makeSprite("spr_pixel");
			var this1 = [random_Random.getFloat(360),random_Random.getFloat(0,1),random_Random.getFloat(0.9,1)];
			spr.tint = thx_color_Rgb.toInt(thx_color_Hsl.toRgb(this1));
			spr.position.set(random_Random.getInt(this.maxStarX),random_Random.getInt(this.maxStarY));
			spr.alpha = random_Random.getFloat(0.2,0.6);
			this.sprites.push(spr);
			this.stage.addChild(spr);
		}
	}
	,update: function() {
		var time = this.city.simulation.time.timeSinceStart / 60 % 24;
		if(time >= 23 || time < 4) {
			this.stage.alpha = 1;
		} else if(time >= 4 && time < 6.) {
			this.stage.alpha = 1 - (time - 4) / 2;
		} else if(time >= 21. && time < 23) {
			this.stage.alpha = 1 - (23 - time) / 2;
		} else {
			this.stage.alpha = 0;
		}
		if(time >= 21. || time < 4) {
			this.cloudsAlpha = 1;
		} else if(time >= 4 && time < 6.) {
			this.cloudsAlpha = 1 - (time - 4) / 2;
		} else if(time >= 19.5 && time < 21.5) {
			this.cloudsAlpha = 1 - (23 - time - 1.5) / 2;
		} else {
			this.cloudsAlpha = 0;
		}
		var val = (0.76923076923076916 - this.cloudsAlpha) * 1.3;
		this.cloudsAlpha = val < 0 ? 0 : val > 1 ? 1 : val;
		this.stage.visible = this.stage.alpha != 0;
	}
	,__class__: graphics_Stars
};
