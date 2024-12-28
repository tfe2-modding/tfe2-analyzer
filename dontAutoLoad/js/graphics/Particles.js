var graphics_Particles = $hxClasses["graphics.Particles"] = function(stage,city) {
	this.stage = stage;
	this.particles = [];
	this.city = city;
};
graphics_Particles.__name__ = "graphics.Particles";
graphics_Particles.prototype = {
	update: function(timeMod) {
		var i = this.particles.length;
		while(--i >= 0) if(this.particles[i].update(timeMod)) {
			this.particles[i] = this.particles[this.particles.length - 1];
			this.particles.pop();
		}
	}
	,addParticle: function(textures,position,onlyIfInView) {
		if(onlyIfInView == null) {
			onlyIfInView = true;
		}
		if(onlyIfInView) {
			var cityCullX = this.city.viewPos.x - this.city.get_displayWidth() * 0.5 - 20;
			var cityCullY = this.city.viewPos.y - this.city.get_displayHeight() * 0.5 - 20;
			var cityCullX2 = cityCullX + this.city.get_displayWidth() + 40;
			var cityCullY2 = cityCullY + this.city.get_displayHeight() + 40;
			if(!(position.x > cityCullX && position.y > cityCullY && position.x < cityCullX2 && position.y < cityCullY2)) {
				return null;
			}
		}
		var newParticle = graphics_Particle.create(this.stage,textures,position);
		this.particles.push(newParticle);
		return newParticle;
	}
	,__class__: graphics_Particles
};
