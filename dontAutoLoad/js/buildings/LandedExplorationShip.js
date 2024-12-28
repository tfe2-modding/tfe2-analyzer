var buildings_LandedExplorationShip = $hxClasses["buildings.LandedExplorationShip"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.mirrored = false;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.doorX = 4;
};
buildings_LandedExplorationShip.__name__ = "buildings.LandedExplorationShip";
buildings_LandedExplorationShip.__super__ = buildings_House;
buildings_LandedExplorationShip.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [];
	}
	,get_baseAttractiveness: function() {
		return 50;
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(3);
		var mirrorMult = this.mirrored ? -1 : 1;
		var mirrorAdd = this.mirrored ? 20 : 0;
		if(citizen.relativeX * mirrorMult > (mirrorAdd + 11 * mirrorMult) * mirrorMult) {
			citizen.setRelativeX(11);
		}
		if(citizen.relativeX * mirrorMult <= (mirrorAdd + mirrorMult) * mirrorMult) {
			citizen.setRelativeX(2);
		}
		if(r == 1) {
			citizen.moveAndWait(random_Random.getInt(mirrorAdd + mirrorMult * 4,mirrorAdd + mirrorMult * 5),random_Random.getInt(30,60),null,false,false);
		} else if(r == 2) {
			citizen.moveAndWait(random_Random.getInt(mirrorAdd + mirrorMult * 9,mirrorAdd + mirrorMult * 12),random_Random.getInt(30,60),null,false,false);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(90,120);
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,postLoad: function() {
		if(this.mirrored) {
			this.mirror();
			this.mirrored = true;
		}
	}
	,mirror: function() {
		this.mirrored = !this.mirrored;
		this.drawer.mirror();
		if(this.mirrored) {
			this.doorX = 14;
		} else {
			this.doorX = 4;
		}
	}
	,createWindowAddBottomButtons: function() {
		gui_windowParts_FullSizeTextButton.create(this.city.gui,$bind(this,this.mirror),this.city.gui.windowInner,function() {
			return common_Localize.lo("mirror");
		},this.city.gui.innerWindowStage);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		buildings_House.prototype.createWindowAddBottomButtons.call(this);
	}
	,addWindowInfoLines: function() {
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("used_as_house");
		});
		buildings_House.prototype.addWindowInfoLines.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_LandedExplorationShip.saveDefinition);
		}
		var value = this.mirrored;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
	}
	,load: function(queue,definition) {
		buildings_House.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mirrored")) {
			this.mirrored = loadMap.h["mirrored"];
		}
		this.postLoad();
	}
	,__class__: buildings_LandedExplorationShip
});
