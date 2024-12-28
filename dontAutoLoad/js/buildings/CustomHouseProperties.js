var buildings_CustomHouseProperties = $hxClasses["buildings.CustomHouseProperties"] = function() {
	this.mergeWithSimilar = false;
	this.bonuses = [];
	this.costModifiers = [];
	this.customCapacity = 4;
	this.customAttractiveness = 50;
	this.interiorOption2Mirror = false;
	this.interiorOption2 = 0;
	this.interiorSprite2 = "";
	this.interiorOption1Mirror = false;
	this.interiorOption1 = 0;
	this.interiorSprite1 = "";
	this.windowColor = 15790320;
	this.mainColor = 12633284;
	this.mainType = "0";
};
buildings_CustomHouseProperties.__name__ = "buildings.CustomHouseProperties";
buildings_CustomHouseProperties.prototype = {
	get_dna: function() {
		return this.mainType + " " + this.mainColor + " " + this.windowColor + " " + this.interiorSprite1 + " " + this.interiorOption1 + " " + this.interiorSprite2 + " " + this.interiorOption2 + " " + this.customAttractiveness + " " + this.customCapacity + " " + Std.string(this.interiorOption1Mirror) + " " + Std.string(this.interiorOption2Mirror) + " " + this.costModifiers.join(",") + " " + this.bonuses.join(",") + " " + Std.string(this.mergeWithSimilar);
	}
	,equals: function(otherProps) {
		return this.get_dna() == otherProps.get_dna();
	}
	,copy: function() {
		var props = new buildings_CustomHouseProperties();
		props.mainType = this.mainType;
		props.mainColor = this.mainColor;
		props.windowColor = this.windowColor;
		props.interiorSprite1 = this.interiorSprite1;
		props.interiorOption1 = this.interiorOption1;
		props.interiorSprite2 = this.interiorSprite2;
		props.interiorOption2 = this.interiorOption2;
		props.customAttractiveness = this.customAttractiveness;
		props.customCapacity = this.customCapacity;
		props.interiorOption1Mirror = this.interiorOption1Mirror;
		props.interiorOption2Mirror = this.interiorOption2Mirror;
		props.costModifiers = this.costModifiers.slice();
		props.bonuses = this.bonuses.slice();
		props.mergeWithSimilar = this.mergeWithSimilar;
		return props;
	}
	,getCost: function(city) {
		var totalCostPoints = 8.0;
		var foodDistributionPoints = 0;
		var woodDistributionPoints = 2;
		var stoneDistributionPoints = 2;
		var machinePartsDistributionPoints = 0;
		var refinedMetalDistributionPoints = 0;
		var computerChipsDistributionPoints = 0;
		var grapheneDistributionPoints = 0.0;
		if(this.bonuses.indexOf(0) != -1) {
			totalCostPoints += 10;
			++foodDistributionPoints;
		}
		if(this.bonuses.indexOf(1) != -1) {
			totalCostPoints += 8;
			++woodDistributionPoints;
		}
		if(this.bonuses.indexOf(2) != -1) {
			totalCostPoints += 4;
			++refinedMetalDistributionPoints;
		}
		if(this.bonuses.indexOf(3) != -1) {
			totalCostPoints += 100;
		}
		if(this.bonuses.indexOf(4) != -1) {
			totalCostPoints += 2;
			++woodDistributionPoints;
		}
		if(this.bonuses.indexOf(5) != -1) {
			totalCostPoints += 5;
			++refinedMetalDistributionPoints;
		}
		if(this.bonuses.indexOf(6) != -1) {
			totalCostPoints += 10;
			++computerChipsDistributionPoints;
		}
		if(this.customAttractiveness < 50) {
			totalCostPoints *= this.customAttractiveness / 50;
		} else {
			totalCostPoints *= Math.pow(this.customAttractiveness,3.6) / Math.pow(50,3.6);
		}
		if(this.customCapacity < 4) {
			totalCostPoints *= this.customCapacity / 4 * 0.5 + Math.pow(this.customCapacity,2.3) / Math.pow(4,2.3) * 0.5;
		} else if(this.customAttractiveness < 40) {
			totalCostPoints *= this.customCapacity / 4;
		} else {
			totalCostPoints *= Math.pow(this.customCapacity,2.3) / Math.pow(4,2.3);
		}
		if(this.bonuses.length >= 2) {
			totalCostPoints *= 1.3;
			grapheneDistributionPoints += 0.35;
		}
		if(this.customAttractiveness >= 65) {
			++machinePartsDistributionPoints;
		}
		if(this.customAttractiveness >= 75 && this.customCapacity > 2 || this.customAttractiveness >= 85) {
			++refinedMetalDistributionPoints;
			stoneDistributionPoints = 0;
		}
		if(this.customAttractiveness >= 90) {
			++computerChipsDistributionPoints;
			--woodDistributionPoints;
		}
		if(this.customAttractiveness >= 95) {
			++computerChipsDistributionPoints;
		}
		if(this.customCapacity >= 6 && this.customAttractiveness >= 50) {
			++refinedMetalDistributionPoints;
		}
		if(this.costModifiers.indexOf(0) != -1) {
			foodDistributionPoints += 2;
			--totalCostPoints;
		}
		if(this.costModifiers.indexOf(1) != -1) {
			woodDistributionPoints += 2;
			var val2 = stoneDistributionPoints - 1;
			stoneDistributionPoints = val2 > 0 ? val2 : 0;
			--totalCostPoints;
		}
		if(this.costModifiers.indexOf(2) != -1) {
			stoneDistributionPoints += 2;
			var val2 = woodDistributionPoints - 1;
			woodDistributionPoints = val2 > 0 ? val2 : 0;
			--totalCostPoints;
		}
		if(this.costModifiers.indexOf(3) != -1) {
			machinePartsDistributionPoints += 2;
			totalCostPoints -= 3.3333333333333335;
		}
		if(this.costModifiers.indexOf(4) != -1) {
			refinedMetalDistributionPoints += 2;
			totalCostPoints -= 7;
		}
		if(this.costModifiers.indexOf(5) != -1) {
			computerChipsDistributionPoints += 2;
			totalCostPoints -= 30;
		}
		if(this.customCapacity >= 5 && city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("communalHousing") != -1) {
			totalCostPoints -= Math.ceil(totalCostPoints / 10);
		}
		totalCostPoints = Math.max(1,totalCostPoints);
		var totalDistributionPoints = foodDistributionPoints + woodDistributionPoints + stoneDistributionPoints + machinePartsDistributionPoints + refinedMetalDistributionPoints + computerChipsDistributionPoints + grapheneDistributionPoints;
		var costMaterials = new Materials();
		costMaterials.set_food(Math.ceil(totalCostPoints * (foodDistributionPoints / totalDistributionPoints)));
		costMaterials.stone = Math.ceil(totalCostPoints * (stoneDistributionPoints / totalDistributionPoints));
		costMaterials.wood = Math.ceil(totalCostPoints * (woodDistributionPoints / totalDistributionPoints));
		costMaterials.machineParts = Math.ceil(0.3 * totalCostPoints * (machinePartsDistributionPoints / totalDistributionPoints));
		costMaterials.refinedMetal = Math.ceil(0.14285714285714285 * totalCostPoints * (refinedMetalDistributionPoints / totalDistributionPoints));
		costMaterials.computerChips = Math.ceil(0.033333333333333333 * totalCostPoints * (computerChipsDistributionPoints / totalDistributionPoints));
		costMaterials.graphene = Math.ceil(0.1 * totalCostPoints * (grapheneDistributionPoints / totalDistributionPoints));
		if(this.costModifiers.indexOf(0) != -1) {
			var _g = costMaterials;
			_g.set_food(_g.food + 1);
		}
		if(this.costModifiers.indexOf(1) != -1) {
			costMaterials.wood += 1;
		}
		if(this.costModifiers.indexOf(2) != -1) {
			costMaterials.stone += 1;
		}
		if(this.costModifiers.indexOf(3) != -1) {
			costMaterials.machineParts += 1;
		}
		if(this.costModifiers.indexOf(4) != -1) {
			costMaterials.refinedMetal += 1;
		}
		if(this.costModifiers.indexOf(5) != -1) {
			costMaterials.computerChips += 1;
		}
		if(this.bonuses.indexOf(3) != -1) {
			costMaterials.computerChips = Math.max(16,costMaterials.computerChips);
			costMaterials.machineParts = Math.max(20,costMaterials.machineParts);
		}
		return costMaterials;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(buildings_CustomHouseProperties.saveDefinition);
		}
		queue.addString(this.mainType);
		var value = this.mainColor;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.windowColor;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		queue.addString(this.interiorSprite1);
		var value = this.interiorOption1;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.interiorOption1Mirror;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		queue.addString(this.interiorSprite2);
		var value = this.interiorOption2;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.interiorOption2Mirror;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.customAttractiveness;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.customCapacity;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		queue.addString(haxe_Serializer.run(this.costModifiers));
		queue.addString(haxe_Serializer.run(this.bonuses));
		var value = this.mergeWithSimilar;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mainType")) {
			this.mainType = loadMap.h["mainType"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mainColor")) {
			this.mainColor = loadMap.h["mainColor"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"windowColor")) {
			this.windowColor = loadMap.h["windowColor"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"interiorSprite1")) {
			this.interiorSprite1 = loadMap.h["interiorSprite1"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"interiorOption1")) {
			this.interiorOption1 = loadMap.h["interiorOption1"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"interiorOption1Mirror")) {
			this.interiorOption1Mirror = loadMap.h["interiorOption1Mirror"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"interiorSprite2")) {
			this.interiorSprite2 = loadMap.h["interiorSprite2"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"interiorOption2")) {
			this.interiorOption2 = loadMap.h["interiorOption2"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"interiorOption2Mirror")) {
			this.interiorOption2Mirror = loadMap.h["interiorOption2Mirror"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"customAttractiveness")) {
			this.customAttractiveness = loadMap.h["customAttractiveness"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"customCapacity")) {
			this.customCapacity = loadMap.h["customCapacity"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"costModifiers")) {
			this.costModifiers = loadMap.h["costModifiers"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"bonuses")) {
			this.bonuses = loadMap.h["bonuses"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mergeWithSimilar")) {
			this.mergeWithSimilar = loadMap.h["mergeWithSimilar"];
		}
	}
	,__class__: buildings_CustomHouseProperties
};
