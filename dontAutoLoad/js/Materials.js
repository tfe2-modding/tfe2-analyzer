var Materials = $hxClasses["Materials"] = function(wood,stone,food,machineParts,knowledge,refinedMetal,computerChips,cacao,chocolate,graphene,rocketFuel) {
	if(rocketFuel == null) {
		rocketFuel = 0;
	}
	if(graphene == null) {
		graphene = 0;
	}
	if(chocolate == null) {
		chocolate = 0;
	}
	if(cacao == null) {
		cacao = 0;
	}
	if(computerChips == null) {
		computerChips = 0;
	}
	if(refinedMetal == null) {
		refinedMetal = 0;
	}
	if(knowledge == null) {
		knowledge = 0;
	}
	if(machineParts == null) {
		machineParts = 0;
	}
	if(food == null) {
		food = 0;
	}
	if(stone == null) {
		stone = 0;
	}
	if(wood == null) {
		wood = 0;
	}
	this.set_food(food);
	this.wood = wood;
	this.stone = stone;
	this.machineParts = machineParts;
	this.refinedMetal = refinedMetal;
	this.computerChips = computerChips;
	this.cacao = cacao;
	this.chocolate = chocolate;
	this.graphene = graphene;
	this.rocketFuel = rocketFuel;
	this.knowledge = knowledge;
};
Materials.__name__ = "Materials";
Materials.fromBuildingInfo = function(info) {
	var m = new Materials();
	if(info.food != null) {
		m.set_food(info.food);
	}
	if(info.wood != null) {
		m.wood = info.wood;
	}
	if(info.stone != null) {
		m.stone = info.stone;
	}
	if(info.machineParts != null) {
		m.machineParts = info.machineParts;
	}
	if(info.refinedMetal != null) {
		m.refinedMetal = info.refinedMetal;
	}
	if(info.computerChips != null) {
		m.computerChips = info.computerChips;
	}
	if(info.cacao != null) {
		m.cacao = info.cacao;
	}
	if(info.chocolate != null) {
		m.chocolate = info.chocolate;
	}
	if(info.graphene != null) {
		m.graphene = info.graphene;
	}
	if(info.rocketFuel != null) {
		m.rocketFuel = info.rocketFuel;
	}
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		if(info[currentMaterial] != null) {
			m[currentMaterial] = info[currentMaterial];
		}
	}
	if(info.knowledge != null) {
		m.knowledge = info.knowledge;
	}
	return m;
};
Materials.fromBuildingUpgradesInfo = function(info) {
	var m = new Materials();
	if(info.food != null) {
		m.set_food(info.food);
	}
	if(info.wood != null) {
		m.wood = info.wood;
	}
	if(info.stone != null) {
		m.stone = info.stone;
	}
	if(info.machineParts != null) {
		m.machineParts = info.machineParts;
	}
	if(info.refinedMetal != null) {
		m.refinedMetal = info.refinedMetal;
	}
	if(info.computerChips != null) {
		m.computerChips = info.computerChips;
	}
	if(info.cacao != null) {
		m.cacao = info.cacao;
	}
	if(info.chocolate != null) {
		m.chocolate = info.chocolate;
	}
	if(info.graphene != null) {
		m.graphene = info.graphene;
	}
	if(info.rocketFuel != null) {
		m.rocketFuel = info.rocketFuel;
	}
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		if(info[currentMaterial] != null) {
			m[currentMaterial] = info[currentMaterial];
		}
	}
	if(info.knowledge != null) {
		m.knowledge = info.knowledge;
	}
	return m;
};
Materials.fromCityUpgradesInfo = function(info) {
	var m = new Materials();
	if(info.food != null) {
		m.set_food(info.food);
	}
	if(info.wood != null) {
		m.wood = info.wood;
	}
	if(info.stone != null) {
		m.stone = info.stone;
	}
	if(info.machineParts != null) {
		m.machineParts = info.machineParts;
	}
	if(info.refinedMetal != null) {
		m.refinedMetal = info.refinedMetal;
	}
	if(info.computerChips != null) {
		m.computerChips = info.computerChips;
	}
	if(info.cacao != null) {
		m.cacao = info.cacao;
	}
	if(info.chocolate != null) {
		m.chocolate = info.chocolate;
	}
	if(info.graphene != null) {
		m.graphene = info.graphene;
	}
	if(info.rocketFuel != null) {
		m.rocketFuel = info.rocketFuel;
	}
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		if(info[currentMaterial] != null) {
			m[currentMaterial] = info[currentMaterial];
		}
	}
	if(info.knowledge != null) {
		m.knowledge = info.knowledge;
	}
	return m;
};
Materials.fromPoliciesInfo = function(info) {
	var m = new Materials();
	if(info.food != null) {
		m.set_food(info.food);
	}
	if(info.wood != null) {
		m.wood = info.wood;
	}
	if(info.stone != null) {
		m.stone = info.stone;
	}
	if(info.machineParts != null) {
		m.machineParts = info.machineParts;
	}
	if(info.refinedMetal != null) {
		m.refinedMetal = info.refinedMetal;
	}
	if(info.computerChips != null) {
		m.computerChips = info.computerChips;
	}
	if(info.cacao != null) {
		m.cacao = info.cacao;
	}
	if(info.chocolate != null) {
		m.chocolate = info.chocolate;
	}
	if(info.graphene != null) {
		m.graphene = info.graphene;
	}
	if(info.rocketFuel != null) {
		m.rocketFuel = info.rocketFuel;
	}
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		if(info[currentMaterial] != null) {
			m[currentMaterial] = info[currentMaterial];
		}
	}
	if(info.knowledge != null) {
		m.knowledge = info.knowledge;
	}
	return m;
};
Materials.fromDecorationInfo = function(info) {
	var m = new Materials();
	if(info.food != null) {
		m.set_food(info.food);
	}
	if(info.wood != null) {
		m.wood = info.wood;
	}
	if(info.stone != null) {
		m.stone = info.stone;
	}
	if(info.machineParts != null) {
		m.machineParts = info.machineParts;
	}
	if(info.refinedMetal != null) {
		m.refinedMetal = info.refinedMetal;
	}
	if(info.computerChips != null) {
		m.computerChips = info.computerChips;
	}
	if(info.cacao != null) {
		m.cacao = info.cacao;
	}
	if(info.chocolate != null) {
		m.chocolate = info.chocolate;
	}
	if(info.graphene != null) {
		m.graphene = info.graphene;
	}
	if(info.rocketFuel != null) {
		m.rocketFuel = info.rocketFuel;
	}
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		if(info[currentMaterial] != null) {
			m[currentMaterial] = info[currentMaterial];
		}
	}
	if(info.knowledge != null) {
		m.knowledge = info.knowledge;
	}
	return m;
};
Materials.fromWorldResourceInfo = function(info) {
	var m = new Materials();
	if(info.food != null) {
		m.set_food(info.food);
	}
	if(info.wood != null) {
		m.wood = info.wood;
	}
	if(info.stone != null) {
		m.stone = info.stone;
	}
	if(info.machineParts != null) {
		m.machineParts = info.machineParts;
	}
	if(info.refinedMetal != null) {
		m.refinedMetal = info.refinedMetal;
	}
	if(info.computerChips != null) {
		m.computerChips = info.computerChips;
	}
	if(info.cacao != null) {
		m.cacao = info.cacao;
	}
	if(info.chocolate != null) {
		m.chocolate = info.chocolate;
	}
	if(info.graphene != null) {
		m.graphene = info.graphene;
	}
	if(info.rocketFuel != null) {
		m.rocketFuel = info.rocketFuel;
	}
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		if(info[currentMaterial] != null) {
			m[currentMaterial] = info[currentMaterial];
		}
	}
	if(info.knowledge != null) {
		m.knowledge = info.knowledge;
	}
	return m;
};
Materials.fromBridgeInfo = function(info) {
	var m = new Materials();
	if(info.food != null) {
		m.set_food(info.food);
	}
	if(info.wood != null) {
		m.wood = info.wood;
	}
	if(info.stone != null) {
		m.stone = info.stone;
	}
	if(info.machineParts != null) {
		m.machineParts = info.machineParts;
	}
	if(info.refinedMetal != null) {
		m.refinedMetal = info.refinedMetal;
	}
	if(info.computerChips != null) {
		m.computerChips = info.computerChips;
	}
	if(info.cacao != null) {
		m.cacao = info.cacao;
	}
	if(info.chocolate != null) {
		m.chocolate = info.chocolate;
	}
	if(info.graphene != null) {
		m.graphene = info.graphene;
	}
	if(info.rocketFuel != null) {
		m.rocketFuel = info.rocketFuel;
	}
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		if(info[currentMaterial] != null) {
			m[currentMaterial] = info[currentMaterial];
		}
	}
	if(info.knowledge != null) {
		m.knowledge = info.knowledge;
	}
	return m;
};
Materials.fromStoryMaterials = function(storyMaterials) {
	var m = new Materials();
	if(storyMaterials.food != null) {
		m.set_food(storyMaterials.food);
	}
	if(storyMaterials.wood != null) {
		m.wood = storyMaterials.wood;
	}
	if(storyMaterials.stone != null) {
		m.stone = storyMaterials.stone;
	}
	if(storyMaterials.machineParts != null) {
		m.machineParts = storyMaterials.machineParts;
	}
	if(storyMaterials.refinedMetal != null) {
		m.refinedMetal = storyMaterials.refinedMetal;
	}
	if(storyMaterials.computerChips != null) {
		m.computerChips = storyMaterials.computerChips;
	}
	if(storyMaterials.cacao != null) {
		m.cacao = storyMaterials.cacao;
	}
	if(storyMaterials.chocolate != null) {
		m.chocolate = storyMaterials.chocolate;
	}
	if(storyMaterials.graphene != null) {
		m.graphene = storyMaterials.graphene;
	}
	if(storyMaterials.rocketFuel != null) {
		m.rocketFuel = storyMaterials.rocketFuel;
	}
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		if(storyMaterials[currentMaterial] != null) {
			m[currentMaterial] = storyMaterials[currentMaterial];
		}
	}
	if(storyMaterials.knowledge != null) {
		m.knowledge = storyMaterials.knowledge;
	}
	return m;
};
Materials.prototype = {
	set_food: function(newFood) {
		this.food = newFood;
		var totalAmountOfSpecialFoods = this.cacao + this.chocolate;
		if(newFood < totalAmountOfSpecialFoods) {
			var cacaoDifference = Math.min(this.cacao,totalAmountOfSpecialFoods - newFood);
			this.cacao -= cacaoDifference;
			totalAmountOfSpecialFoods -= cacaoDifference;
			var chocolateDifference = Math.min(this.chocolate,totalAmountOfSpecialFoods - newFood);
			this.chocolate -= chocolateDifference;
			totalAmountOfSpecialFoods -= chocolateDifference;
		}
		return newFood;
	}
	,canAfford: function(cost) {
		if(cost.food > this.food && cost.food > 0) {
			return false;
		}
		if(cost.wood > this.wood && cost.wood > 0) {
			return false;
		}
		if(cost.stone > this.stone && cost.stone > 0) {
			return false;
		}
		if(cost.machineParts > this.machineParts && cost.machineParts > 0) {
			return false;
		}
		if(cost.refinedMetal > this.refinedMetal && cost.refinedMetal > 0) {
			return false;
		}
		if(cost.computerChips > this.computerChips && cost.computerChips > 0) {
			return false;
		}
		if(cost.cacao > this.cacao && cost.cacao > 0) {
			return false;
		}
		if(cost.chocolate > this.chocolate && cost.chocolate > 0) {
			return false;
		}
		if(cost.graphene > this.graphene && cost.graphene > 0) {
			return false;
		}
		if(cost.rocketFuel > this.rocketFuel && cost.rocketFuel > 0) {
			return false;
		}
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			if(cost[currentMaterial] > this[currentMaterial] && cost[currentMaterial] > 0) {
				return false;
			}
		}
		if(cost.knowledge > this.knowledge && cost.knowledge > 0) {
			return false;
		}
		return true;
	}
	,canAffordNumber: function(cost) {
		var maxNum = 1000000000;
		if(cost.food > this.food && cost.food > 0) {
			return 0;
		}
		if(cost.food > 0) {
			var val2 = Math.floor(this.food / cost.food);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		if(cost.wood > this.wood && cost.wood > 0) {
			return 0;
		}
		if(cost.wood > 0) {
			var val2 = Math.floor(this.wood / cost.wood);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		if(cost.stone > this.stone && cost.stone > 0) {
			return 0;
		}
		if(cost.stone > 0) {
			var val2 = Math.floor(this.stone / cost.stone);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		if(cost.machineParts > this.machineParts && cost.machineParts > 0) {
			return 0;
		}
		if(cost.machineParts > 0) {
			var val2 = Math.floor(this.machineParts / cost.machineParts);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		if(cost.refinedMetal > this.refinedMetal && cost.refinedMetal > 0) {
			return 0;
		}
		if(cost.refinedMetal > 0) {
			var val2 = Math.floor(this.refinedMetal / cost.refinedMetal);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		if(cost.computerChips > this.computerChips && cost.computerChips > 0) {
			return 0;
		}
		if(cost.computerChips > 0) {
			var val2 = Math.floor(this.computerChips / cost.computerChips);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		if(cost.cacao > this.cacao && cost.cacao > 0) {
			return 0;
		}
		if(cost.cacao > 0) {
			var val2 = Math.floor(this.cacao / cost.cacao);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		if(cost.chocolate > this.chocolate && cost.chocolate > 0) {
			return 0;
		}
		if(cost.chocolate > 0) {
			var val2 = Math.floor(this.chocolate / cost.chocolate);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		if(cost.graphene > this.graphene && cost.graphene > 0) {
			return 0;
		}
		if(cost.graphene > 0) {
			var val2 = Math.floor(this.graphene / cost.graphene);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		if(cost.rocketFuel > this.rocketFuel && cost.rocketFuel > 0) {
			return 0;
		}
		if(cost.rocketFuel > 0) {
			var val2 = Math.floor(this.rocketFuel / cost.rocketFuel);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			if(cost[currentMaterial] > this[currentMaterial] && cost[currentMaterial] > 0) {
				return 0;
			}
			if(cost[currentMaterial] > 0) {
				var val2 = Math.floor(this[currentMaterial] / cost[currentMaterial]);
				if(val2 < maxNum) {
					maxNum = val2;
				}
			}
		}
		if(cost.knowledge > this.knowledge && cost.knowledge > 0) {
			return 0;
		}
		if(cost.knowledge > 0) {
			var val2 = Math.floor(this.knowledge / cost.knowledge);
			if(val2 < maxNum) {
				maxNum = val2;
			}
		}
		return maxNum;
	}
	,remove: function(cost) {
		var _g = this;
		_g.set_food(_g.food - cost.food);
		this.wood -= cost.wood;
		this.stone -= cost.stone;
		this.machineParts -= cost.machineParts;
		this.refinedMetal -= cost.refinedMetal;
		this.computerChips -= cost.computerChips;
		this.cacao -= cost.cacao;
		this.chocolate -= cost.chocolate;
		this.graphene -= cost.graphene;
		this.rocketFuel -= cost.rocketFuel;
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			this[currentMaterial] -= cost[currentMaterial];
		}
		this.knowledge -= cost.knowledge;
	}
	,add: function(these) {
		if(these == null) {
			return;
		}
		var _g = this;
		_g.set_food(_g.food + these.food);
		this.wood += these.wood;
		this.stone += these.stone;
		this.machineParts += these.machineParts;
		this.refinedMetal += these.refinedMetal;
		this.computerChips += these.computerChips;
		this.cacao += these.cacao;
		this.chocolate += these.chocolate;
		this.graphene += these.graphene;
		this.rocketFuel += these.rocketFuel;
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			this[currentMaterial] += these[currentMaterial];
		}
		this.knowledge += these.knowledge;
	}
	,multiply: function(withNumber) {
		var _g = this;
		_g.set_food(_g.food * withNumber);
		this.wood *= withNumber;
		this.stone *= withNumber;
		this.machineParts *= withNumber;
		this.refinedMetal *= withNumber;
		this.computerChips *= withNumber;
		this.cacao *= withNumber;
		this.chocolate *= withNumber;
		this.graphene *= withNumber;
		this.rocketFuel *= withNumber;
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			this[currentMaterial] *= withNumber;
		}
		this.knowledge *= withNumber;
	}
	,roundAll: function() {
		this.set_food(Math.round(this.food));
		this.wood = Math.round(this.wood);
		this.stone = Math.round(this.stone);
		this.machineParts = Math.round(this.machineParts);
		this.refinedMetal = Math.round(this.refinedMetal);
		this.computerChips = Math.round(this.computerChips);
		this.cacao = Math.round(this.cacao);
		this.chocolate = Math.round(this.chocolate);
		this.graphene = Math.round(this.graphene);
		this.rocketFuel = Math.round(this.rocketFuel);
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			this[currentMaterial] = Math.round(this[currentMaterial]);
		}
		this.knowledge = Math.round(this.knowledge);
	}
	,keepAboveZeroAll: function() {
		this.set_food(Math.max(this.food,0));
		this.wood = Math.max(this.wood,0);
		this.stone = Math.max(this.stone,0);
		this.machineParts = Math.max(this.machineParts,0);
		this.refinedMetal = Math.max(this.refinedMetal,0);
		this.computerChips = Math.max(this.computerChips,0);
		this.cacao = Math.max(this.cacao,0);
		this.chocolate = Math.max(this.chocolate,0);
		this.graphene = Math.max(this.graphene,0);
		this.rocketFuel = Math.max(this.rocketFuel,0);
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			this[currentMaterial] = Math.max(this[currentMaterial],0);
		}
		this.knowledge = Math.max(this.knowledge,0);
	}
	,addToProduction: function(stats) {
		var ind = MaterialsHelper.findMaterialIndex("food");
		stats.materialProduction[ind][0] += this.food;
		var ind = MaterialsHelper.findMaterialIndex("wood");
		stats.materialProduction[ind][0] += this.wood;
		var ind = MaterialsHelper.findMaterialIndex("stone");
		stats.materialProduction[ind][0] += this.stone;
		var ind = MaterialsHelper.findMaterialIndex("machineParts");
		stats.materialProduction[ind][0] += this.machineParts;
		var ind = MaterialsHelper.findMaterialIndex("refinedMetal");
		stats.materialProduction[ind][0] += this.refinedMetal;
		var ind = MaterialsHelper.findMaterialIndex("computerChips");
		stats.materialProduction[ind][0] += this.computerChips;
		var ind = MaterialsHelper.findMaterialIndex("cacao");
		stats.materialProduction[ind][0] += this.cacao;
		var ind = MaterialsHelper.findMaterialIndex("chocolate");
		stats.materialProduction[ind][0] += this.chocolate;
		var ind = MaterialsHelper.findMaterialIndex("graphene");
		stats.materialProduction[ind][0] += this.graphene;
		var ind = MaterialsHelper.findMaterialIndex("rocketFuel");
		stats.materialProduction[ind][0] += this.rocketFuel;
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			var ind = MaterialsHelper.findMaterialIndex(currentMaterial);
			stats.materialProduction[ind][0] += this[currentMaterial];
		}
		var ind = MaterialsHelper.findMaterialIndex("knowledge");
		stats.materialProduction[ind][0] += this.knowledge;
	}
	,addToConsumption: function(stats) {
		var ind = MaterialsHelper.findMaterialIndex("food");
		stats.materialUsed[ind][0] += this.food;
		var ind = MaterialsHelper.findMaterialIndex("wood");
		stats.materialUsed[ind][0] += this.wood;
		var ind = MaterialsHelper.findMaterialIndex("stone");
		stats.materialUsed[ind][0] += this.stone;
		var ind = MaterialsHelper.findMaterialIndex("machineParts");
		stats.materialUsed[ind][0] += this.machineParts;
		var ind = MaterialsHelper.findMaterialIndex("refinedMetal");
		stats.materialUsed[ind][0] += this.refinedMetal;
		var ind = MaterialsHelper.findMaterialIndex("computerChips");
		stats.materialUsed[ind][0] += this.computerChips;
		var ind = MaterialsHelper.findMaterialIndex("cacao");
		stats.materialUsed[ind][0] += this.cacao;
		var ind = MaterialsHelper.findMaterialIndex("chocolate");
		stats.materialUsed[ind][0] += this.chocolate;
		var ind = MaterialsHelper.findMaterialIndex("graphene");
		stats.materialUsed[ind][0] += this.graphene;
		var ind = MaterialsHelper.findMaterialIndex("rocketFuel");
		stats.materialUsed[ind][0] += this.rocketFuel;
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			var ind = MaterialsHelper.findMaterialIndex(currentMaterial);
			stats.materialUsed[ind][0] += this[currentMaterial];
		}
		var ind = MaterialsHelper.findMaterialIndex("knowledge");
		stats.materialUsed[ind][0] += this.knowledge;
	}
	,any: function() {
		if(this.food > 0) {
			return true;
		}
		if(this.wood > 0) {
			return true;
		}
		if(this.stone > 0) {
			return true;
		}
		if(this.machineParts > 0) {
			return true;
		}
		if(this.refinedMetal > 0) {
			return true;
		}
		if(this.computerChips > 0) {
			return true;
		}
		if(this.cacao > 0) {
			return true;
		}
		if(this.chocolate > 0) {
			return true;
		}
		if(this.graphene > 0) {
			return true;
		}
		if(this.rocketFuel > 0) {
			return true;
		}
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			if(this[currentMaterial] > 0) {
				return true;
			}
		}
		if(this.knowledge > 0) {
			return true;
		}
		return false;
	}
	,anyMaterialDifferent: function(mat2) {
		if(this.food != mat2.food) {
			return true;
		}
		if(this.wood != mat2.wood) {
			return true;
		}
		if(this.stone != mat2.stone) {
			return true;
		}
		if(this.machineParts != mat2.machineParts) {
			return true;
		}
		if(this.refinedMetal != mat2.refinedMetal) {
			return true;
		}
		if(this.computerChips != mat2.computerChips) {
			return true;
		}
		if(this.cacao != mat2.cacao) {
			return true;
		}
		if(this.chocolate != mat2.chocolate) {
			return true;
		}
		if(this.graphene != mat2.graphene) {
			return true;
		}
		if(this.rocketFuel != mat2.rocketFuel) {
			return true;
		}
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			if(this[currentMaterial] != mat2[currentMaterial]) {
				return true;
			}
		}
		if(this.knowledge != mat2.knowledge) {
			return true;
		}
		return false;
	}
	,copy: function() {
		var mat2 = new Materials();
		mat2.add(this);
		return mat2;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		this.saveBasics(queue,shouldSaveDefinition);
		var value = MaterialsHelper.modMaterials.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var mat = _g1[_g];
			++_g;
			queue.addString(mat.variableName);
			var value = this[mat.variableName];
			if(queue.size + 8 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setDouble(queue.size,value);
			queue.size += 8;
		}
	}
	,load: function(queue,definition) {
		this.loadBasics(queue,definition);
		if(queue.version >= 31) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var extraMaterialsStored = intToRead;
			var _g = 0;
			var _g1 = extraMaterialsStored;
			while(_g < _g1) {
				var i = _g++;
				var matName = queue.readString();
				var floatToRead = queue.bytes.getDouble(queue.readStart);
				queue.readStart += 8;
				var matAmount = floatToRead;
				this[matName] = matAmount;
			}
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(Materials.saveDefinition);
		}
		var value = this.wood;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.stone;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.food;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.machineParts;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.knowledge;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.refinedMetal;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.computerChips;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.graphene;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.rocketFuel;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.cacao;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.chocolate;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"wood")) {
			this.wood = loadMap.h["wood"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"stone")) {
			this.stone = loadMap.h["stone"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"food")) {
			this.set_food(loadMap.h["food"]);
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"machineParts")) {
			this.machineParts = loadMap.h["machineParts"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"knowledge")) {
			this.knowledge = loadMap.h["knowledge"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"refinedMetal")) {
			this.refinedMetal = loadMap.h["refinedMetal"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"computerChips")) {
			this.computerChips = loadMap.h["computerChips"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"graphene")) {
			this.graphene = loadMap.h["graphene"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"rocketFuel")) {
			this.rocketFuel = loadMap.h["rocketFuel"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"cacao")) {
			this.cacao = loadMap.h["cacao"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"chocolate")) {
			this.chocolate = loadMap.h["chocolate"];
		}
	}
	,__class__: Materials
};
