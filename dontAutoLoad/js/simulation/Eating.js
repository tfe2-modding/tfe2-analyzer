var simulation_Eating = $hxClasses["simulation.Eating"] = function(simulation) {
	this.foodRationing = false;
	this.currentFoodSaveByHerbsPct = 0;
	this.herbsCap = 0;
	this.foodShortage = 0;
	this.totalConsumedFoodPerDay = -1;
	this.simulation = simulation;
};
simulation_Eating.__name__ = "simulation.Eating";
simulation_Eating.prototype = {
	update: function(timeMod) {
		var time = this.simulation.time.timeSinceStart / 60 % 24;
		if(this.totalConsumedFoodPerDay != 0) {
			this.currentFoodSaveByHerbsPct = Math.min(1,this.herbsCap / this.totalConsumedFoodPerDay);
		} else {
			this.currentFoodSaveByHerbsPct = 0;
		}
		var foodSavedByHerbs = 0.2 * Math.min(this.totalConsumedFoodPerDay,this.herbsCap);
		this.totalConsumedFoodPerDay = this.simulation.citizens.length - this.simulation.stats.children * 0.5;
		this.totalConsumedFoodPerDay -= foodSavedByHerbs;
		if(this.foodRationing) {
			this.totalConsumedFoodPerDay *= 0.5;
		}
		if(time >= 7 && time < 20) {
			var partOfDay = this.simulation.time.minutesPerTick * timeMod / 60 / (20 - 7);
			var wantsToConsumeFood = Math.max(0,this.totalConsumedFoodPerDay * partOfDay);
			var consumedFoodNow = Math.min(this.simulation.city.materials.food,wantsToConsumeFood);
			var city = this.simulation.city;
			var _g = city.materials;
			_g.set_food(_g.food - consumedFoodNow);
			city.simulation.stats.materialUsed[0][0] += consumedFoodNow;
			this.foodShortage += wantsToConsumeFood - consumedFoodNow;
			this.foodShortage = Math.min(this.foodShortage,Math.ceil(this.totalConsumedFoodPerDay / 2));
		}
		if(this.foodShortage > 0 && this.simulation.city.materials.food > 0.1) {
			var reduceShortageBy = Math.min(this.simulation.city.materials.food,this.foodShortage);
			this.foodShortage -= reduceShortageBy;
			var city = this.simulation.city;
			var _g = city.materials;
			_g.set_food(_g.food - reduceShortageBy);
			city.simulation.stats.materialUsed[0][0] += reduceShortageBy;
			if(this.simulation.city.materials.food > 0) {
				this.foodShortage = 0;
			}
		}
	}
	,getFoodText: function() {
		var reductionText = "";
		if(this.foodRationing) {
			reductionText = common_Localize.lo("rationing_halves_this") + " ";
		}
		return common_Localize.lo("food_description_1") + "\n" + common_Localize.lo("food_description_2") + " " + reductionText + (this.currentFoodSaveByHerbsPct < 0.0001 ? "" : common_Localize.lo("food_description_3",[Math.round(this.currentFoodSaveByHerbsPct * 0.2 * 100),20]) + " ") + (this.totalConsumedFoodPerDay == -1 ? "" : common_Localize.lo("food_description_4",[this.totalConsumedFoodPerDay | 0]));
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_Eating.saveDefinition);
		}
		var value = this.foodShortage;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"foodShortage")) {
			this.foodShortage = loadMap.h["foodShortage"];
		}
	}
	,__class__: simulation_Eating
};
