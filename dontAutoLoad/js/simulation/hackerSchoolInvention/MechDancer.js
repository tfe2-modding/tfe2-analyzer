var simulation_hackerSchoolInvention_MechDancer = $hxClasses["simulation.hackerSchoolInvention.MechDancer"] = function(simulation,stage) {
	this.tint = 0;
	this.waitTime = 0.0;
	this.targetX = -1;
	this.texture = Resources.getTexture("spr_mechdancer");
	this.relativeX = 7;
	simulation_HackerSchoolInvention.call(this,simulation,stage);
	this.tint = random_Random.getFloat(255);
	this.hairSprite = PIXI.Sprite.from(Resources.getTexture("spr_mechdancer_hair"));
	this.hairSprite.position.set(0,0);
	var this1 = [this.tint,0.7,1];
	var tmp = thx_color_Hsv.toRgb(this1);
	this.hairSprite.tint = common_ColorExtensions.toHexInt(tmp);
	stage.addChild(this.hairSprite);
	var tme = simulation.time.timeSinceStart / 60 % 24;
	if(tme > 10) {
		tme -= 24;
	}
	this.lifetime = 60 * (7 - tme) / 0.5;
	this.lifetime += random_Random.getInt(-120,120);
};
simulation_hackerSchoolInvention_MechDancer.__name__ = "simulation.hackerSchoolInvention.MechDancer";
simulation_hackerSchoolInvention_MechDancer.__super__ = simulation_HackerSchoolInvention;
simulation_hackerSchoolInvention_MechDancer.prototype = $extend(simulation_HackerSchoolInvention.prototype,{
	get_followingSprite: function() {
		return "spr_selectedhuman";
	}
	,get_followingSpriteOffset: function() {
		return 1;
	}
	,updateDisplay: function() {
		this.hairSprite.position.set(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + 20 - this.relativeY - 6);
		simulation_HackerSchoolInvention.prototype.updateDisplay.call(this);
	}
	,destroy: function() {
		this.hairSprite.destroy();
		simulation_HackerSchoolInvention.prototype.destroy.call(this);
	}
	,update: function(timeMod) {
		if(this.targetX < 0) {
			this.waitTime -= timeMod;
			if(this.waitTime <= 0) {
				this.targetX = random_Random.getInt(5,18);
			}
		} else {
			var done = false;
			if(this.targetX < this.relativeX) {
				this.relativeX -= timeMod;
				if(this.targetX >= this.relativeX) {
					done = true;
				}
			} else {
				this.relativeX += timeMod;
				if(this.targetX <= this.relativeX) {
					done = true;
				}
			}
			if(done) {
				this.relativeX = this.targetX;
				this.targetX = -1;
				this.waitTime = random_Random.getInt(2,5);
			}
		}
		this.tint += timeMod * 2;
		var this1 = [this.tint,0.7,1];
		var tmp = thx_color_Hsv.toRgb(this1);
		this.hairSprite.tint = common_ColorExtensions.toHexInt(tmp);
		if(this.tint >= 360) {
			this.tint = 0;
		}
		simulation_HackerSchoolInvention.prototype.update.call(this,timeMod);
	}
	,windowAddInfo: function(gui) {
		gui.windowAddInfoText(common_Localize.lo("mech_dancer"),null,"Arial15");
	}
	,__class__: simulation_hackerSchoolInvention_MechDancer
});
