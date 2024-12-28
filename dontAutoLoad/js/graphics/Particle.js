var graphics_Particle = $hxClasses["graphics.Particle"] = function() {
};
graphics_Particle.__name__ = "graphics.Particle";
graphics_Particle.create = function(stage,textures,position) {
	var inst = graphics_Particle.pool.length == 0 ? new graphics_Particle() : graphics_Particle.pool.pop();
	inst.___internal_pooling_initObject(stage,textures,position);
	return inst;
};
graphics_Particle.prototype = {
	___internal_pooling_initObject: function(stage,textures,position) {
		this.stage = stage;
		this.textures = textures;
		this.frame = 0;
		this.animSpeed = 0.5;
		this.sprite = pooling_PooledSprite.create(textures[0],stage);
		this.sprite.position.set(position.x,position.y);
	}
	,update: function(timeMod) {
		this.frame += this.animSpeed * timeMod;
		if(this.frame >= this.textures.length) {
			var this1 = this.sprite;
			var stage = this.stage;
			this1.visible = false;
			this1.position.set(-100000,-100000);
			pooling_PooledSprite.pool.h[stage.__id__].push(this1);
			this.destroy();
			return true;
		}
		this.sprite.texture = this.textures[this.frame | 0];
		return false;
	}
	,destroy: function() {
		graphics_Particle.pool.push(this);
	}
	,__class__: graphics_Particle
};
