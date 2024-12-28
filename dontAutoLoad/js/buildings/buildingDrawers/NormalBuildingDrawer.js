var buildings_buildingDrawers_NormalBuildingDrawer = $hxClasses["buildings.buildingDrawers.NormalBuildingDrawer"] = function(building,stage,bgStage,textureName) {
	buildings_buildingDrawers_BuildingDrawer.call(this,building,stage,bgStage,textureName);
	this.bgSprite = Resources.makeSprite(this.currentTextureName,new common_Rectangle(44,0,20,20));
	bgStage.cacheableChildren.push(this.bgSprite);
	bgStage.isInvalid = true;
	this.sprite = new PIXI.Sprite();
	stage.cacheableChildren.push(this.sprite);
	stage.isInvalid = true;
	this.positionSprites();
};
buildings_buildingDrawers_NormalBuildingDrawer.__name__ = "buildings.buildingDrawers.NormalBuildingDrawer";
buildings_buildingDrawers_NormalBuildingDrawer.__super__ = buildings_buildingDrawers_BuildingDrawer;
buildings_buildingDrawers_NormalBuildingDrawer.prototype = $extend(buildings_buildingDrawers_BuildingDrawer.prototype,{
	positionSprites: function() {
		this.sprite.position.set(this.building.position.x,this.building.position.y);
		this.bgSprite.position.set(this.building.position.x,this.building.position.y);
		var mainSpriteRect = new common_Rectangle(0,0,20,20);
		if(this.building.worldPosition.y == 0) {
			mainSpriteRect.x += 22;
		}
		this.sprite.texture = Resources.getTexture(this.currentTextureName,mainSpriteRect);
		this.stage.isInvalid = true;
		this.bgStage.isInvalid = true;
	}
	,mirror: function() {
		this.bgSprite.anchor.x = 1 - this.bgSprite.anchor.x;
		this.bgSprite.scale.x = -this.bgSprite.scale.x;
		this.sprite.anchor.x = 1 - this.sprite.anchor.x;
		this.sprite.scale.x = -this.sprite.scale.x;
		this.bgStage.isInvalid = true;
		this.stage.isInvalid = true;
	}
	,changeMainTexture: function(textureName) {
		if(this.currentTextureName == textureName) {
			return;
		}
		buildings_buildingDrawers_BuildingDrawer.prototype.changeMainTexture.call(this,textureName);
		this.bgSprite.texture = Resources.getTexture(this.currentTextureName,new common_Rectangle(44,0,20,20));
		this.bgStage.isInvalid = true;
		this.positionSprites();
	}
	,destroy: function() {
		buildings_buildingDrawers_BuildingDrawer.prototype.destroy.call(this);
		var _this = this.bgStage;
		var child = this.bgSprite;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.sprite;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
	}
	,getBackgroundTexture: function() {
		return this.bgSprite.texture;
	}
	,setTint: function(tint,bgTint) {
		if(bgTint == null) {
			bgTint = -1;
		}
		if(bgTint == -1) {
			bgTint = tint;
		}
		this.sprite.tint = tint;
		this.bgSprite.tint = bgTint;
		this.stage.isInvalid = true;
		this.bgStage.isInvalid = true;
	}
	,__class__: buildings_buildingDrawers_NormalBuildingDrawer
});
