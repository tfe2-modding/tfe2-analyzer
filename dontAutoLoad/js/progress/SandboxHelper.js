var progress_SandboxHelper = $hxClasses["progress.SandboxHelper"] = function(city) {
	this.everPlayedWithUnlimitedResources = false;
	this.unlimitedResources = false;
	this.city = city;
	if(!Game.isLoading) {
		common_Achievements.setEnabled(true);
	}
};
progress_SandboxHelper.__name__ = "progress.SandboxHelper";
progress_SandboxHelper.prototype = {
	postLoad: function() {
		common_Achievements.setEnabled(!this.everPlayedWithUnlimitedResources);
	}
	,update: function(timeMod) {
		if(this.unlimitedResources) {
			if(this.city.materials.food < 10000000) {
				this.city.materials.set_food(10000000);
			}
			if(this.city.materials.wood < 10000000) {
				this.city.materials.wood = 10000000;
			}
			if(this.city.materials.stone < 10000000) {
				this.city.materials.stone = 10000000;
			}
			if(this.city.materials.machineParts < 10000000) {
				this.city.materials.machineParts = 10000000;
			}
			if(this.city.materials.refinedMetal < 10000000) {
				this.city.materials.refinedMetal = 10000000;
			}
			if(this.city.materials.computerChips < 10000000) {
				this.city.materials.computerChips = 10000000;
			}
			if(this.city.materials.cacao < 10000000 && false) {
				this.city.materials.cacao = 10000000;
			}
			if(this.city.materials.chocolate < 10000000 && false) {
				this.city.materials.chocolate = 10000000;
			}
			if(this.city.materials.graphene < 10000000) {
				this.city.materials.graphene = 10000000;
			}
			if(this.city.materials.rocketFuel < 10000000) {
				this.city.materials.rocketFuel = 10000000;
			}
			var _g = 0;
			var _g1 = MaterialsHelper.modMaterials;
			while(_g < _g1.length) {
				var modMaterial = _g1[_g];
				++_g;
				var currentMaterial = modMaterial.variableName;
				if(this.city.materials[currentMaterial] < 10000000 && currentMaterial != "cacao" && currentMaterial != "chocolate") {
					this.city.materials[currentMaterial] = 10000000;
				}
			}
			if(this.city.materials.knowledge < 10000000) {
				this.city.materials.knowledge = 10000000;
			}
		}
	}
	,enableUnlimitedResources: function() {
		if(this.unlimitedResources) {
			return;
		}
		this.unlimitedResources = true;
		this.everPlayedWithUnlimitedResources = true;
		common_Achievements.setEnabled(false);
		var _g = this.city.materials;
		_g.set_food(_g.food + 10000000);
		this.city.materials.wood += 10000000;
		this.city.materials.stone += 10000000;
		this.city.materials.machineParts += 10000000;
		this.city.materials.refinedMetal += 10000000;
		this.city.materials.computerChips += 10000000;
		this.city.materials.graphene += 10000000;
		this.city.materials.rocketFuel += 10000000;
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			if(currentMaterial != "cacao" && currentMaterial != "chocolate") {
				this.city.materials[currentMaterial] += 10000000;
			}
		}
		this.city.materials.knowledge += 10000000;
	}
	,disableUnlimitedResources: function() {
		if(!this.unlimitedResources) {
			return;
		}
		this.unlimitedResources = false;
		var _g = this.city.materials;
		_g.set_food(_g.food - 10000000);
		if(this.city.materials.food < 0) {
			this.city.materials.set_food(0);
		}
		this.city.materials.wood -= 10000000;
		if(this.city.materials.wood < 0) {
			this.city.materials.wood = 0;
		}
		this.city.materials.stone -= 10000000;
		if(this.city.materials.stone < 0) {
			this.city.materials.stone = 0;
		}
		this.city.materials.machineParts -= 10000000;
		if(this.city.materials.machineParts < 0) {
			this.city.materials.machineParts = 0;
		}
		this.city.materials.refinedMetal -= 10000000;
		if(this.city.materials.refinedMetal < 0) {
			this.city.materials.refinedMetal = 0;
		}
		this.city.materials.computerChips -= 10000000;
		if(this.city.materials.computerChips < 0) {
			this.city.materials.computerChips = 0;
		}
		this.city.materials.graphene -= 10000000;
		if(this.city.materials.graphene < 0) {
			this.city.materials.graphene = 0;
		}
		this.city.materials.rocketFuel -= 10000000;
		if(this.city.materials.rocketFuel < 0) {
			this.city.materials.rocketFuel = 0;
		}
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			if(currentMaterial != "cacao" && currentMaterial != "chocolate") {
				this.city.materials[currentMaterial] -= 10000000;
				if(this.city.materials[currentMaterial] < 0) {
					this.city.materials[currentMaterial] = 0;
				}
			}
		}
		this.city.materials.knowledge -= 10000000;
		if(this.city.materials.knowledge < 0) {
			this.city.materials.knowledge = 0;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(progress_SandboxHelper.saveDefinition);
		}
		var value = this.unlimitedResources;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.everPlayedWithUnlimitedResources;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"unlimitedResources")) {
			this.unlimitedResources = loadMap.h["unlimitedResources"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"everPlayedWithUnlimitedResources")) {
			this.everPlayedWithUnlimitedResources = loadMap.h["everPlayedWithUnlimitedResources"];
		}
		this.postLoad();
	}
	,__class__: progress_SandboxHelper
};
