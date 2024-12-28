var simulation_hackerSchoolInvention_KnowledgeRobot = $hxClasses["simulation.hackerSchoolInvention.KnowledgeRobot"] = function(simulation,stage) {
	this.tint = 0;
	this.waitTime = 0.0;
	this.targetX = -1;
	this.variant = random_Random.getInt(3);
	this.texture = Resources.getTexturesByWidth("spr_knowledgerobot",3)[this.variant];
	this.relativeX = 5;
	simulation_HackerSchoolInvention.call(this,simulation,stage);
	this.sprite.anchor.x = 0.5;
	this.tint = random_Random.getFloat(255);
	this.lifetime = random_Random.getInt(24,48) * 60 * 3;
};
simulation_hackerSchoolInvention_KnowledgeRobot.__name__ = "simulation.hackerSchoolInvention.KnowledgeRobot";
simulation_hackerSchoolInvention_KnowledgeRobot.__super__ = simulation_HackerSchoolInvention;
simulation_hackerSchoolInvention_KnowledgeRobot.prototype = $extend(simulation_HackerSchoolInvention.prototype,{
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
				if(this.targetX >= this.relativeX) {
					done = true;
				}
			} else {
				this.relativeX += 0.5 * timeMod;
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
				var city = this.simulation.city;
				var knowledgeProduced = city.simulation.boostManager.currentGlobalBoostAmount * 0.2;
				this.resourcesCollected += knowledgeProduced;
				city.materials.knowledge += knowledgeProduced;
				city.simulation.stats.materialProduction[10][0] += knowledgeProduced;
			}
		}
		simulation_HackerSchoolInvention.prototype.update.call(this,timeMod);
	}
	,windowAddInfo: function(gui) {
		var _gthis = this;
		gui.windowAddInfoText(common_Localize.lo("knowledge_gathering_robot"),null,"Arial15");
		gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[Math.floor(_gthis.resourcesCollected)]);
		});
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
	,__class__: simulation_hackerSchoolInvention_KnowledgeRobot
});
