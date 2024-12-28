var graphics_GroundDecoration = $hxClasses["graphics.GroundDecoration"] = function(stage,position,textureName,subImage) {
	this.stage = stage;
	this.position = position;
	this.textureName = textureName;
	this.textures = Resources.getTexturesByWidth(textureName,20);
	if(subImage == null) {
		subImage = random_Random.getInt(this.textures.length);
	}
	this.sprite = new PIXI.Sprite(this.textures[subImage]);
	this.subImage = subImage;
	this.sprite.position.set(position.x,position.y);
	stage.addChild(this.sprite);
};
graphics_GroundDecoration.__name__ = "graphics.GroundDecoration";
graphics_GroundDecoration.prototype = {
	destroy: function() {
		this.sprite.destroy();
	}
	,__class__: graphics_GroundDecoration
};
