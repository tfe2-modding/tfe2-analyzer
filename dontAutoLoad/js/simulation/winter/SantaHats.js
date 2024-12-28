var simulation_winter_SantaHats = $hxClasses["simulation.winter.SantaHats"] = function(city) {
	this.city = city;
};
simulation_winter_SantaHats.__name__ = "simulation.winter.SantaHats";
simulation_winter_SantaHats.prototype = {
	update: function(timeMod) {
		var santaHatTextures = Resources.getTexturesByWidth("spr_santahat",4);
		var _g = 0;
		var _g1 = this.city.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen.inPermanent == null || citizen.inPermanent.is(WorldResource)) {
				if(citizen.accessorySprite == null) {
					citizen.accessorySprite = new PIXI.Sprite(santaHatTextures[citizen.nameIndex % santaHatTextures.length]);
					citizen.accessorySprite.anchor.set(0.5,0);
					citizen.accessorySprite.position.set(1,-citizen.actualSpriteHeight);
					citizen.sprite.addChild(citizen.accessorySprite);
				}
				if(citizen.path != null) {
					if(citizen.currentPathAction == 4) {
						if(citizen.currentPathActionTimerXY < citizen.relativeX) {
							citizen.accessorySprite.scale.x = 1;
						} else {
							citizen.accessorySprite.scale.x = -1;
						}
					} else if(citizen.currentPathAction == 5) {
						if(citizen.currentPathActionPermanent != null && citizen.currentPathActionPermanent.position.x + (citizen.currentPathActionPermanent.isBuilding ? citizen.currentPathActionPermanent.doorX : 0) < citizen.relativeX) {
							citizen.accessorySprite.scale.x = 1;
						} else {
							citizen.accessorySprite.scale.x = -1;
						}
					}
				}
			} else if(citizen.accessorySprite != null && !citizen.inPermanent.is(buildings_HighTechNightClub)) {
				citizen.accessorySprite.destroy();
				citizen.accessorySprite = null;
			}
		}
	}
	,__class__: simulation_winter_SantaHats
};
