var progress_worldGenerators_RandomMiniWorlds = $hxClasses["progress.worldGenerators.RandomMiniWorlds"] = function() { };
progress_worldGenerators_RandomMiniWorlds.__name__ = "progress.worldGenerators.RandomMiniWorlds";
progress_worldGenerators_RandomMiniWorlds.doGenerate = function(generatorArgs,city,storyInfo,cityStage,cityMidStage,cityBgStage) {
	var numberOfWorldsMin = generatorArgs.numberOfWorldsMin;
	var numberOfWorldsMax = generatorArgs.numberOfWorldsMax;
	var minX = generatorArgs.minX;
	var minY = generatorArgs.minY;
	var maxX = generatorArgs.maxX;
	var maxY = generatorArgs.maxY;
	var minWidth = generatorArgs.minWidth;
	var maxWidth = generatorArgs.maxWidth;
	var minHeight = generatorArgs.minHeight;
	var maxHeight = generatorArgs.maxHeight;
	var heightVariation = generatorArgs.heightVariation;
	var allAddedWorlds = [];
	var _g = 0;
	var _g1 = random_Random.getInt(numberOfWorldsMin,numberOfWorldsMax);
	while(_g < _g1) {
		var i = _g++;
		var tries = 0;
		while(++tries < 10000) {
			var xx = random_Random.getInt(minX / 20 | 0,(maxX / 20 | 0) + 1) * 20;
			var yy = random_Random.getInt(minY / 20 | 0,(maxY / 20 | 0) + 1) * 20;
			var ww = random_Random.getInt(minWidth / 20 | 0,(maxWidth / 20 | 0) + 1) * 20;
			var val = Math.round(((ww - minWidth) / (maxWidth - minWidth) * (maxHeight - minHeight) + minHeight + random_Random.getInt(heightVariation)) / 20);
			var hh = (val < 1 ? 1 : val > 100 ? 100 : val) * 20;
			var canCreateWorld = true;
			var _g2 = 0;
			var _g3 = city.worlds;
			while(_g2 < _g3.length) {
				var otherWorld = _g3[_g2];
				++_g2;
				if(otherWorld.rect.intersects(new common_Rectangle(xx - 20,yy - 40,ww + 41,hh + 61))) {
					canCreateWorld = false;
					break;
				}
			}
			if(!canCreateWorld) {
				continue;
			}
			var newWorld = new World(city.game,city,cityStage,cityMidStage,cityBgStage,new common_Rectangle(xx,yy,ww,hh),random_Random.getInt(1000000));
			city.worlds.push(newWorld);
			allAddedWorlds.push(newWorld);
			break;
		}
		if(tries >= 1000) {
			console.log("FloatingSpaceCities/progress/worldGenerators/RandomMiniWorlds.hx:48:","world not generated; max # of tries exceeded - RandomMiniWorlds.doGenerate with args:");
			console.log("FloatingSpaceCities/progress/worldGenerators/RandomMiniWorlds.hx:49:",generatorArgs);
		}
	}
	var buildOnWorlds = allAddedWorlds.slice();
	var createPermanents = [];
	var alienRuinsMade = 0;
	var _g = 0;
	var _g1 = generatorArgs.initialBuildings;
	while(_g < _g1.length) {
		var initialBuilding = _g1[_g];
		++_g;
		var _g2 = 0;
		var _g3 = random_Random.getInt(initialBuilding.numberMin,initialBuilding.numberMax);
		while(_g2 < _g3) {
			var i = _g2++;
			var name = "buildings." + Std.string(initialBuilding.className);
			createPermanents.push($hxClasses[name]);
		}
	}
	var _g = 0;
	var _g1 = generatorArgs.initialWorldResources;
	while(_g < _g1.length) {
		var initialWR = _g1[_g];
		++_g;
		var _g2 = 0;
		var _g3 = random_Random.getInt(initialWR.numberMin,initialWR.numberMax);
		while(_g2 < _g3) {
			var i = _g2++;
			var name = "worldResources." + Std.string(initialWR.className);
			createPermanents.push($hxClasses[name]);
		}
	}
	var handledAllBuildings = false;
	var _g = 0;
	while(_g < createPermanents.length) {
		var pm = createPermanents[_g];
		++_g;
		var pmIsAlienRuins = pm.__name__.indexOf("AlienRuins") != -1;
		var pmIsBuilding = pm.__name__.indexOf("buildings.") != -1;
		if(!handledAllBuildings && !pmIsBuilding) {
			if(generatorArgs.rememberWorldSpreadBetweenBuildingsAndWorldResources) {
				buildOnWorlds = allAddedWorlds.slice();
			}
			handledAllBuildings = true;
		}
		var buildOptions = [];
		var tries = 0;
		while(++tries <= 2) {
			var worldArrayToUse = allAddedWorlds;
			if(generatorArgs.spreadBuildingsEvenlyBetweenWorlds && pmIsBuilding || generatorArgs.spreadWorldResourcesEvenlyBetweenWorlds && !pmIsBuilding) {
				worldArrayToUse = buildOnWorlds;
			}
			var _g1 = 0;
			while(_g1 < worldArrayToUse.length) {
				var world = worldArrayToUse[_g1];
				++_g1;
				var pmPositionsFree = 0;
				var _g2 = 0;
				var _g3 = world.permanents.length;
				while(_g2 < _g3) {
					var xx = _g2++;
					var pmStack = world.permanents[xx];
					if(pmStack.length == 0) {
						++pmPositionsFree;
					}
				}
				if(pmIsBuilding || (!generatorArgs.avoidGeneratingOverfullWorlds || world.permanents.length > 1 && pmPositionsFree > 1)) {
					var _g4 = 0;
					var _g5 = world.permanents.length;
					while(_g4 < _g5) {
						var xx1 = _g4++;
						var pmStack1 = world.permanents[xx1];
						if(pmStack1.length == 0) {
							buildOptions.push({ world : world, xPos : xx1});
						}
					}
				}
			}
			if(buildOptions.length == 0) {
				buildOnWorlds = allAddedWorlds.slice();
			} else {
				break;
			}
		}
		if(buildOptions.length > 0) {
			var chosenOption = random_Random.fromArray(buildOptions);
			HxOverrides.remove(buildOnWorlds,chosenOption.world);
			if(pmIsBuilding) {
				chosenOption.world.build(pm,chosenOption.xPos);
			} else {
				chosenOption.world.createWorldResource(pm,chosenOption.xPos);
			}
		}
	}
};
