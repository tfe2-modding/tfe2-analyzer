var WorldResource = $hxClasses["WorldResource"] = function(game,id,city,world,position,worldPosition,stage,texture) {
	this.stage = stage;
	this.sprite = new PIXI.Sprite(texture);
	stage.addChild(this.sprite);
	Permanent.call(this,game,id,city,world,position,worldPosition);
	this.positionSprites();
};
WorldResource.__name__ = "WorldResource";
WorldResource.__super__ = Permanent;
WorldResource.prototype = $extend(Permanent.prototype,{
	destroy: function() {
		Permanent.prototype.destroy.call(this);
		this.sprite.destroy();
		this.city.simulation.resourcePriorityManager.deprioritize(this);
	}
	,positionSprites: function() {
		Permanent.prototype.positionSprites.call(this);
		this.sprite.position.set(this.position.x,this.position.y);
	}
	,__class__: WorldResource
});
