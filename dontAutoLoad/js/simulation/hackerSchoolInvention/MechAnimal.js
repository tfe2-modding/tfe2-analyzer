var simulation_hackerSchoolInvention_MechAnimal = $hxClasses["simulation.hackerSchoolInvention.MechAnimal"] = function(simulation,stage) {
	this.tint = 0;
	this.waitTime = 0.0;
	this.targetX = -1;
	var curVariant = random_Random.getInt(simulation_hackerSchoolInvention_MechAnimal.textureOptions.length);
	this.textures = Resources.getTextures(simulation_hackerSchoolInvention_MechAnimal.textureOptions[curVariant],4);
	this.texture = this.textures[0];
	this.relativeX = 5;
	simulation_HackerSchoolInvention.call(this,simulation,stage);
	this.variant = curVariant;
	this.sprite.anchor.x = 0.5;
	this.tint = random_Random.getFloat(255);
	this.lifetime = random_Random.getInt(24,48) * 60 * 2;
};
simulation_hackerSchoolInvention_MechAnimal.__name__ = "simulation.hackerSchoolInvention.MechAnimal";
simulation_hackerSchoolInvention_MechAnimal.__super__ = simulation_HackerSchoolInvention;
simulation_hackerSchoolInvention_MechAnimal.prototype = $extend(simulation_HackerSchoolInvention.prototype,{
	get_followingSprite: function() {
		return "spr_selectedfish";
	}
	,get_followingSpriteOffset: function() {
		return 0;
	}
	,updateDisplay: function() {
		this.sprite.position.set(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + 20 - this.relativeY - 3);
	}
	,destroy: function() {
		simulation_HackerSchoolInvention.prototype.destroy.call(this);
	}
	,update: function(timeMod) {
		var inBuilding = this.inPermanent;
		if(inBuilding == null) {
			return;
		}
		var canGoLeft = inBuilding.leftBuilding != null && inBuilding.leftBuilding.drawer.currentTextureGroupName == inBuilding.drawer.currentTextureGroupName;
		var canGoRight = inBuilding.rightBuilding != null && inBuilding.rightBuilding.drawer.currentTextureGroupName == inBuilding.drawer.currentTextureGroupName;
		if(canGoLeft) {
			var leftGardens = inBuilding.leftBuilding != null && inBuilding.leftBuilding.is(buildings_BotanicalGardens);
			if(leftGardens) {
				var leftGardensCanWalk = leftGardens && !inBuilding.leftBuilding.hasBottomConnectedBuilding;
				if(!leftGardensCanWalk) {
					canGoLeft = false;
				}
			}
		}
		if(canGoRight) {
			var rightGardens = inBuilding.rightBuilding != null && inBuilding.rightBuilding.is(buildings_BotanicalGardens);
			if(rightGardens) {
				var rightGardensCanWalk = rightGardens && !inBuilding.rightBuilding.hasBottomConnectedBuilding;
				if(!rightGardensCanWalk) {
					canGoRight = false;
				}
			}
		}
		if(this.targetX < 0) {
			this.waitTime -= timeMod;
			if(this.waitTime <= 0) {
				var inBuilding1 = this.inPermanent;
				this.targetX = random_Random.getInt(canGoLeft ? -5 : 3 + (Math.floor(this.sprite.width) / 2 | 0),canGoRight ? 25 : 18 - (Math.floor(this.sprite.width) / 2 | 0));
			}
		} else {
			var done = false;
			if(!canGoLeft && this.targetX < 3) {
				this.targetX = 3;
			}
			if(!canGoRight && this.targetX > 17) {
				this.targetX = 17;
			}
			if(this.targetX < this.relativeX) {
				this.relativeX -= 0.5 * timeMod;
				this.sprite.texture = this.textures[(this.relativeX + 100) * 0.4 % this.textures.length | 0];
				this.sprite.scale.x = 1;
				if(this.targetX >= this.relativeX) {
					done = true;
				}
			} else {
				this.relativeX += 0.5 * timeMod;
				this.sprite.texture = this.textures[(this.relativeX + 100) * 0.4 % this.textures.length | 0];
				this.sprite.scale.x = -1;
				if(this.targetX <= this.relativeX) {
					done = true;
				}
			}
			if(canGoLeft) {
				if(this.relativeX < 0) {
					this.relativeX += 20;
					this.targetX += 20;
					this.inPermanent = inBuilding.leftBuilding;
				}
			}
			if(canGoRight) {
				if(this.relativeX >= 20) {
					this.relativeX -= 20;
					this.targetX -= 20;
					this.inPermanent = inBuilding.rightBuilding;
				}
			}
			if(done) {
				this.relativeX = this.targetX;
				this.targetX = -1;
				this.waitTime = random_Random.getInt(20,50);
				this.sprite.texture = this.textures[0];
			}
		}
		simulation_HackerSchoolInvention.prototype.update.call(this,timeMod);
	}
	,windowAddInfo: function(gui) {
		gui.windowAddInfoText(common_Localize.lo("mech_animal"),null,"Arial15");
	}
	,onCityChange: function() {
		if(!this.inPermanent.destroyed) {
			var val = this.relativeX;
			this.relativeX = val < 0 ? 0 : val > 20 ? 20 : val;
			if(this.inPermanent.is(buildings_BotanicalGardens)) {
				var bg = this.inPermanent;
				if(bg.get_mergingDrawer().isConnectedBuilding(bg.bottomBuilding)) {
					this.destroy();
				}
			}
		} else {
			this.destroy();
		}
	}
	,postLoad: function() {
		this.textures = Resources.getTextures(simulation_hackerSchoolInvention_MechAnimal.textureOptions[this.variant],4);
		this.texture = this.textures[0];
	}
	,__class__: simulation_hackerSchoolInvention_MechAnimal
});
