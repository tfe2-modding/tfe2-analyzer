var buildings_LandingSiteTunnel = $hxClasses["buildings.LandingSiteTunnel"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.bgSpr = null;
	buildings_LandingSite.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.bgSpr = Resources.makeSprite("spr_landingpadtunnel_bg");
	this.bgSpr.position.set(position.x,position.y);
	bgStage.addChild(this.bgSpr);
};
buildings_LandingSiteTunnel.__name__ = "buildings.LandingSiteTunnel";
buildings_LandingSiteTunnel.__super__ = buildings_LandingSite;
buildings_LandingSiteTunnel.prototype = $extend(buildings_LandingSite.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AllDirMergingBuildingDrawer;
	}
	,get_mainTexture: function() {
		var _g = this.saucerType;
		return buildings_LandingSiteTunnel.spriteName;
	}
	,positionSprites: function() {
		buildings_LandingSite.prototype.positionSprites.call(this);
		this.bgSpr.position.set(this.position.x,this.position.y);
	}
	,destroy: function() {
		buildings_LandingSite.prototype.destroy.call(this);
		if(this.bgSpr != null) {
			this.bgSpr.destroy();
			this.bgSpr = null;
		}
	}
	,__class__: buildings_LandingSiteTunnel
});
