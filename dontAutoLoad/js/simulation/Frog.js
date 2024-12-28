var simulation_Frog = $hxClasses["simulation.Frog"] = function(city,stage,onWorld,relativeX) {
	this.destroyed = false;
	this.relativeY = 0;
	this.grav = 0;
	this.relativeX = 10;
	this.dir = 1;
	this.city = city;
	this.stage = stage;
	this.onWorld = onWorld;
	this.relativeX = relativeX;
	this.textures = Resources.getTexturesByWidth("spr_frog",7);
	this.sprite = new PIXI.Sprite(this.textures[0]);
	this.sprite.anchor.set(0.5,1);
	this.dir = random_Random.getInt(2) * -2 + 1;
	stage.addChild(this.sprite);
	this.updateDisplay();
};
simulation_Frog.__name__ = "simulation.Frog";
simulation_Frog.prototype = {
	destroy: function() {
		this.sprite.destroy();
		this.destroyed = true;
	}
	,onClick: function() {
		gui_FollowingFrog.createWindow(this.city,this);
	}
	,update: function(timeMod) {
		if(this.relativeY > 0) {
			this.relativeY += this.grav * (timeMod / 0.6666);
			this.grav -= 0.1 * (timeMod / 0.6666);
			if(this.relativeY < 0) {
				this.relativeY = 0;
				this.grav = 0;
			}
			this.relativeX += this.dir * timeMod;
		} else {
			if(this.dir == 1) {
				if(this.relativeX > this.onWorld.rect.width - 40) {
					this.dir = -1;
				}
			} else if(this.relativeX < 40) {
				this.dir = 1;
			}
			if(random_Random.getFloat(1) < 0.05 * (timeMod / 0.666)) {
				this.grav = random_Random.getFloat(1.2,1.5);
				this.relativeY += 0.1;
			}
		}
		this.updateDisplay();
		if(this.city.simulation.time.timeSinceStart / 60 % 24 > 6 && this.city.simulation.time.timeSinceStart / 60 % 24 < 12) {
			this.sprite.alpha = Math.max(0,1.0 - (this.city.simulation.time.timeSinceStart / 60 % 24 - 6.0));
		}
	}
	,getCityPosition: function() {
		return new common_FPoint(this.onWorld.rect.x + this.relativeX,this.onWorld.rect.y - this.relativeY - 3.5);
	}
	,updateDisplay: function() {
		this.sprite.position.x = this.onWorld.rect.x + this.relativeX;
		this.sprite.position.y = this.onWorld.rect.y - this.relativeY;
		this.sprite.scale.x = this.dir;
		this.sprite.texture = this.textures[this.relativeY > 0 ? 1 : 0];
	}
	,save: function(queue) {
		this.saveBasics(queue);
	}
	,load: function(queue) {
		if(queue.version >= 46) {
			this.loadBasics(queue);
		}
		this.updateDisplay();
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_Frog.saveDefinition);
		}
		var value = this.relativeX;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"relativeX")) {
			this.relativeX = loadMap.h["relativeX"];
		}
	}
	,__class__: simulation_Frog
};
