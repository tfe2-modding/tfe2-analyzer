var buildings_buildingBehaviours_ParkFestivalEntertainment = $hxClasses["buildings.buildingBehaviours.ParkFestivalEntertainment"] = function(park,bgStage) {
	this.park = park;
	this.podiumSprite = null;
	this.bgStage = bgStage;
};
buildings_buildingBehaviours_ParkFestivalEntertainment.__name__ = "buildings.buildingBehaviours.ParkFestivalEntertainment";
buildings_buildingBehaviours_ParkFestivalEntertainment.prototype = {
	doFestivalWork: function(festival,citizen,timeMod,currentMainTexture,citizenID) {
		var shouldShowBGSprite = true;
		var bgSpriteXPos = 3;
		if(this.park.leftBuilding != null) {
			if(shouldShowBGSprite && this.park.leftBuilding.is(buildings_Park)) {
				shouldShowBGSprite = false;
			}
			if(shouldShowBGSprite && this.park.leftBuilding.is(buildings_BotanicalGardens)) {
				shouldShowBGSprite = false;
				if(this.park.leftBuilding.bottomBuilding != null && this.park.leftBuilding.bottomBuilding.is(buildings_BotanicalGardens)) {
					if(currentMainTexture == 0) {
						bgSpriteXPos = -3;
					}
					shouldShowBGSprite = true;
				}
			}
		}
		if(shouldShowBGSprite) {
			if(this.podiumSprite == null) {
				this.podiumSprite = new PIXI.Sprite(Resources.getTexture("spr_festival_podium_small"));
				this.bgStage.addChild(this.podiumSprite);
			}
			this.podiumSprite.position.set(this.park.position.x + bgSpriteXPos,this.park.position.y + 20 - this.podiumSprite.height - 1);
			var myXPos = citizenID == 0 ? bgSpriteXPos + 3 : bgSpriteXPos;
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(myXPos - citizen.relativeX) < spd) {
				citizen.relativeX = myXPos;
			} else {
				var num = myXPos - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
			if(citizen.relativeX >= myXPos && citizen.relativeX <= myXPos + 1) {
				citizen.setRelativePos(myXPos,4);
			}
		} else {
			if(this.podiumSprite != null) {
				this.podiumSprite.destroy();
				this.podiumSprite = null;
			}
			citizen.moveAndWait(random_Random.getInt(0,17),random_Random.getInt(60,90),null,false,false);
		}
	}
	,beEntertainedFestival: function(festival,citizen,timeMod) {
		if(this.podiumSprite == null) {
			buildings_buildingBehaviours_ParkWalk.beEntertainedPark(this.park.leftBuilding,this.park.rightBuilding,citizen);
		} else {
			var xMin = Math.ceil(this.podiumSprite.position.x + this.podiumSprite.width - this.park.position.x);
			var xMax = this.park.rightBuilding != null && (this.park.rightBuilding.is(buildings_Park) || this.park.rightBuilding.is(buildings_BotanicalGardens));
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(xMin,xMax ? 19 : 16),random_Random.getInt(100,180),null,modifyWithHappiness,slowMove);
		}
	}
	,destroy: function() {
		if(this.podiumSprite != null) {
			this.podiumSprite.destroy();
		}
	}
	,stop: function() {
	}
	,__class__: buildings_buildingBehaviours_ParkFestivalEntertainment
};
