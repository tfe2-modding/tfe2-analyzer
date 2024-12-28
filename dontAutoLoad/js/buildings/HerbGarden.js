var buildings_HerbGarden = $hxClasses["buildings.HerbGarden"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.herbSprite = null;
	this.currentTexture = 0;
	this.herbCapPerWorker = 50;
	this.herbTextures = Resources.getTexturesByWidth(this.get_myHerbTextures(),20);
	this.currentTexture = random_Random.getInt(this.herbTextures.length / 2 | 0) * 2;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.drawer.changeTextureGroup("spr_restaurant");
	this.herbSprite = new PIXI.Sprite(this.herbTextures[this.currentTexture]);
	this.herbSprite.position.set(position.x,position.y);
	bgStage.cacheableChildren.push(this.herbSprite);
	bgStage.isInvalid = true;
};
buildings_HerbGarden.__name__ = "buildings.HerbGarden";
buildings_HerbGarden.__interfaces__ = [buildings_IMedicalBuilding];
buildings_HerbGarden.__super__ = buildings_Work;
buildings_HerbGarden.prototype = $extend(buildings_Work.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawerDifferentForType;
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_CulinaryHerbs,buildingUpgrades_MedicalHerbs];
	}
	,get_medicalQuality: function() {
		return 100;
	}
	,get_medicalCapacity: function() {
		if(((this.buildingMode) instanceof buildingUpgrades_MedicalHerbs)) {
			return 100;
		} else {
			return 0;
		}
	}
	,get_medicalTypeLimit: function() {
		return 0.2;
	}
	,get_medicalTypeID: function() {
		return 1;
	}
	,get_myHerbTextures: function() {
		return "spr_herbgarden_plants";
	}
	,postLoad: function() {
		this.herbSprite.texture = this.herbTextures[this.currentTexture];
		this.bgStage.isInvalid = true;
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		if(citizen.relativeY < 5 && this.workers.indexOf(citizen) == 1) {
			citizen.changeFloor();
			return;
		}
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(30,60),null,modifyWithHappiness,slowMove);
	}
	,getHerbCapacity: function() {
		return this.herbCapPerWorker * this.workers.length;
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.herbSprite != null) {
			this.herbSprite.position.set(this.position.x,this.position.y);
			this.bgStage.isInvalid = true;
		}
	}
	,changePlantsTexture: function(tex) {
		this.currentTexture = tex;
		if(this.herbSprite != null) {
			this.herbSprite.texture = this.herbTextures[this.currentTexture];
			this.bgStage.isInvalid = true;
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		var _this = this.bgStage;
		var child = this.herbSprite;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("herb_reduction",[Math.round(_gthis.city.simulation.eating.currentFoodSaveByHerbsPct * 0.2 * 100),20]) + "\n" + common_Localize.lo("herb_medical_happiness",[Math.round(100 * (_gthis.city.simulation.happiness.healthCapacityByType[1] / _gthis.city.simulation.citizens.length))]);
		});
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.currentTexture;
		},$bind(this,this.changePlantsTexture),function() {
			return _gthis.herbTextures.length;
		},common_Localize.lo("change_herb_plants"),null,2);
		buildings_Work.prototype.createWindowAddBottomButtons.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_HerbGarden.saveDefinition);
		}
		var value = this.currentTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(queue.version < 32) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentTexture")) {
			this.currentTexture = loadMap.h["currentTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_HerbGarden
});
