var buildings_buildingDrawers_DecorationBuildingDrawer = $hxClasses["buildings.buildingDrawers.DecorationBuildingDrawer"] = function(building,stage,bgStage,textureName) {
	this.subImage = 0;
	buildings_buildingDrawers_BuildingDrawer.call(this,building,stage,bgStage,textureName);
	this.sprite = new PIXI.Sprite();
	stage.cacheableChildren.push(this.sprite);
	stage.isInvalid = true;
	this.positionSprites();
};
buildings_buildingDrawers_DecorationBuildingDrawer.__name__ = "buildings.buildingDrawers.DecorationBuildingDrawer";
buildings_buildingDrawers_DecorationBuildingDrawer.__super__ = buildings_buildingDrawers_BuildingDrawer;
buildings_buildingDrawers_DecorationBuildingDrawer.prototype = $extend(buildings_buildingDrawers_BuildingDrawer.prototype,{
	positionSprites: function() {
		this.sprite.position.set(this.building.position.x,this.building.position.y);
		var mainSpriteRect = new common_Rectangle(this.subImage * 22,0,20,20);
		this.sprite.texture = Resources.getTexture(this.currentTextureName,mainSpriteRect);
		this.stage.isInvalid = true;
	}
	,getSubImageNumber: function() {
		return Math.round(Resources.getTexture(this.currentTextureName).width + 2) / 22 | 0;
	}
	,mirror: function() {
		this.sprite.anchor.x = 1 - this.sprite.anchor.x;
		this.sprite.scale.x = -this.sprite.scale.x;
		this.stage.isInvalid = true;
	}
	,changeMainTexture: function(textureName) {
		buildings_buildingDrawers_BuildingDrawer.prototype.changeMainTexture.call(this,textureName);
		this.positionSprites();
	}
	,changeSubImage: function(img) {
		this.subImage = img;
		this.positionSprites();
	}
	,setTint: function(tint) {
		this.sprite.tint = tint;
		this.stage.isInvalid = true;
	}
	,destroy: function() {
		buildings_buildingDrawers_BuildingDrawer.prototype.destroy.call(this);
		var _this = this.stage;
		var child = this.sprite;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
	}
	,__class__: buildings_buildingDrawers_DecorationBuildingDrawer
});
