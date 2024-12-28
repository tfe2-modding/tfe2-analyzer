var simulation_HackerSchoolInvention = $hxClasses["simulation.HackerSchoolInvention"] = function(simulation,stage) {
	this.lifetime = 11520.;
	this.variant = 0;
	this.resourcesCollected = 0;
	this.relativeY = 0;
	this.relativeX = 0;
	this.destroyed = false;
	this.inPermanent = null;
	this.simulation = simulation;
	this.stage = stage;
	var c = js_Boot.getClass(this);
	this.className = c.__name__;
	this.sprite = new PIXI.Sprite(this.texture);
	this.sprite.anchor.set(0,1);
	stage.addChild(this.sprite);
};
simulation_HackerSchoolInvention.__name__ = "simulation.HackerSchoolInvention";
simulation_HackerSchoolInvention.prototype = {
	get_followingSprite: function() {
		return "spr_selectedrobot";
	}
	,get_followingSpriteOffset: function() {
		return 0;
	}
	,update: function(timeMod) {
		this.lifetime -= timeMod;
		if(this.lifetime < 0) {
			this.destroy();
			return;
		} else if(this.lifetime < 20) {
			this.sprite.alpha = this.lifetime / 20;
		}
		this.updateDisplay();
	}
	,save: function(queue) {
		this.saveBasics(queue);
		var value = this.inPermanent.id;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue) {
		this.loadBasics(queue);
		var this1 = this.simulation.city.permanentsByID;
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		this.inPermanent = this1.h[intToRead];
		this.postLoad();
		this.updateDisplay();
	}
	,updateDisplay: function() {
		this.sprite.position.set(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + 20 - this.relativeY - 1);
	}
	,destroy: function() {
		this.sprite.destroy();
		HxOverrides.remove(this.simulation.hackerSchoolBonuses.inventions,this);
		this.destroyed = true;
	}
	,getCityPosition: function() {
		return new common_FPoint(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + 20 - this.relativeY - 1);
	}
	,onClick: function() {
		gui_FollowingInvention.createWindow(this.simulation.city,this);
	}
	,windowAddInfo: function(gui) {
	}
	,onCityChange: function() {
	}
	,postLoad: function() {
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_HackerSchoolInvention.saveDefinition);
		}
		var value = this.relativeX;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.relativeY;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.resourcesCollected;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.variant;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.lifetime;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"relativeY")) {
			this.relativeY = loadMap.h["relativeY"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"resourcesCollected")) {
			this.resourcesCollected = loadMap.h["resourcesCollected"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"variant")) {
			this.variant = loadMap.h["variant"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lifetime")) {
			this.lifetime = loadMap.h["lifetime"];
		}
		this.postLoad();
	}
	,__class__: simulation_HackerSchoolInvention
};
