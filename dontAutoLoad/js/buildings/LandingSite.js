var buildings_LandingSite = $hxClasses["buildings.LandingSite"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.saucerType = 0;
	this.timesUsedStopOver = 0;
	this.timesUsedTo = 0;
	this.timesUsed = 0;
	this.landingSiteGroup = 0;
	this.currentlyLandedSaucer = null;
	this.hasFlyingSaucer = true;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	city.landingSites.push(this);
	this.doorX = 15;
	this.connectedWaypoint = null;
	this.flyingSaucerSprite = Resources.makeSprite("spr_flyingsaucer");
	this.flyingSaucerSprite.position.set(position.x,position.y);
	city.aboveCitizensInBuildingStage.addChild(this.flyingSaucerSprite);
};
buildings_LandingSite.__name__ = "buildings.LandingSite";
buildings_LandingSite.__super__ = Building;
buildings_LandingSite.prototype = $extend(Building.prototype,{
	get_typeID: function() {
		return 2;
	}
	,get_saucherTexture: function() {
		switch(this.saucerType) {
		case 0:
			return "spr_flyingsaucer";
		case 1:
			return "spr_flyingsaucer_alt";
		case 2:
			return "spr_flowercraft";
		case 3:
			return "spr_flyingsaucer_cube";
		case 4:
			return "spr_flyingsaucer_deepblue";
		case 5:
			return "spr_flyingsaucer_shade";
		default:
			return "spr_flyingsaucer";
		}
	}
	,get_mainTexture: function() {
		switch(this.saucerType) {
		case 0:
			return buildings_LandingSite.spriteName;
		case 1:
			return "spr_landingplace_alt";
		case 4:
			return "spr_landingplace_deepblue";
		default:
			return buildings_LandingSite.spriteName;
		}
	}
	,postLoad: function() {
		var tmp = this.get_saucherTexture();
		this.flyingSaucerSprite.texture = Resources.getTexture(tmp);
		this.drawer.changeMainTexture(this.get_mainTexture());
	}
	,positionSprites: function() {
		Building.prototype.positionSprites.call(this);
		if(this.flyingSaucerSprite != null) {
			this.flyingSaucerSprite.position.set(this.position.x,this.position.y);
		}
	}
	,update: function(timeMod) {
		Building.prototype.update.call(this,timeMod);
		if(this.timeUntilCanGetNewFlyingSaucer > 0) {
			this.timeUntilCanGetNewFlyingSaucer -= timeMod;
		} else if(this.gettingNewFlyingSaucerStage > 0) {
			this.gettingNewFlyingSaucerStage -= timeMod;
			this.flyingSaucerSprite.position.set(this.position.x,this.position.y - Math.max(0,this.gettingNewFlyingSaucerStage * 0.25));
			this.flyingSaucerSprite.alpha = 1 - this.gettingNewFlyingSaucerStage / 16;
			if(this.gettingNewFlyingSaucerStage <= 0) {
				this.hasFlyingSaucer = true;
			}
		}
	}
	,tryDestroy: function(warnIfNot) {
		if(warnIfNot == null) {
			warnIfNot = true;
		}
		if(this.city.progress.story.storyName == "cityofthekey" && (this.position.x == 100 || this.position.x == -100)) {
			if(warnIfNot) {
				this.city.gui.showSimpleWindow(common_Localize.lo("secret_society_forbidden"),null,true,true);
			}
			return false;
		}
		return Building.prototype.tryDestroy.call(this,warnIfNot);
	}
	,destroy: function() {
		HxOverrides.remove(this.city.landingSites,this);
		this.flyingSaucerSprite.destroy();
		var i = this.city.simulation.flyingSaucers.length;
		while(--i >= 0) if(this.city.simulation.flyingSaucers[i].destination == this) {
			this.city.simulation.flyingSaucers[i].cancel();
		}
		Building.prototype.destroy.call(this);
	}
	,addFlyingSaucer: function() {
		if(!this.hasFlyingSaucer) {
			this.hasFlyingSaucer = true;
			this.flyingSaucerSprite.alpha = 1;
			this.flyingSaucerSprite.position.set(this.position.x,this.position.y);
		}
	}
	,removeFlyingSaucer: function() {
		if(this.hasFlyingSaucer) {
			this.hasFlyingSaucer = false;
			this.flyingSaucerSprite.alpha = 0;
			this.gettingNewFlyingSaucerStage = 16;
			this.timeUntilCanGetNewFlyingSaucer = 30;
		}
	}
	,estimatedFlyingDistanceTo: function(site) {
		return (Math.abs(site.position.x - this.position.x) + Math.abs(site.position.y - this.position.y)) / 3;
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		Building.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			var val2 = _gthis.timesUsed - _gthis.timesUsedStopOver;
			return common_Localize.lo("transported_from",[val2 > 0 ? val2 : 0]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("transported_to",[_gthis.timesUsedTo]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("used_as_stopover",[_gthis.timesUsedStopOver]);
		});
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		if(Settings.hasSecretCode("hangar")) {
			gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.saucerType;
			},function(t) {
				_gthis.saucerType = t;
				var tmp = _gthis.get_saucherTexture();
				_gthis.flyingSaucerSprite.texture = Resources.getTexture(tmp);
				_gthis.drawer.changeMainTexture(_gthis.get_mainTexture());
			},function() {
				return 6;
			},common_Localize.lo("change_space_ship"));
		}
		Building.prototype.createWindowAddBottomButtons.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_LandingSite.saveDefinition);
		}
		var value = this.timesUsed;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.timesUsedTo;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.timesUsedStopOver;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.saucerType;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsed")) {
			this.timesUsed = loadMap.h["timesUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsedTo")) {
			this.timesUsedTo = loadMap.h["timesUsedTo"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsedStopOver")) {
			this.timesUsedStopOver = loadMap.h["timesUsedStopOver"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"saucerType")) {
			this.saucerType = loadMap.h["saucerType"];
		}
		this.postLoad();
	}
	,__class__: buildings_LandingSite
});
