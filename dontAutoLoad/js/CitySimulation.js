var CitySimulation = $hxClasses["CitySimulation"] = function(city,foregroundStage,inBuildingStage,inBuildingStageNonParticle) {
	this.recentlyPassedFavoriteCitizens = [];
	this.favoriteCitizens = [];
	this.rockets = null;
	this.winter = null;
	this.infrequentUpdateStart = 0;
	this.adultTextures = [];
	this.childrenTextures = [];
	this.citizens = [];
	this.city = city;
	this.foregroundStage = foregroundStage;
	this.inBuildingStageNonParticle = inBuildingStageNonParticle;
	this.inBuildingStage = inBuildingStage;
	this.time = new CityTime(city,this);
	this.childrenTextures = Resources.getTexturesByWidth("spr_children",2).slice();
	this.adultTextures = Resources.getTexturesByWidth("spr_humans",2).slice();
	this.childrenTextures.push(Resources.getTexture("spr_dracula_child"));
	this.adultTextures.push(Resources.getTexture("spr_dracula_adult"));
	this.childrenTextures.push(Resources.getTexture("spr_waldo_child"));
	this.adultTextures.push(Resources.getTexture("spr_waldo_adult"));
	this.jobAssigner = new simulation_JobAssigner(city,this);
	this.houseAssigner = new simulation_HouseAssigner(city,this);
	this.schoolAssigner = new simulation_SchoolAssigner(city,this);
	this.pathfinder = new pathfinder_PathfinderManager(city);
	this.permanentFinder = new pathfinder_PermanentFinder(city);
	this.routeFinder = new pathfinder_RouteFinder(city);
	this.flyingPathfinder = new pathfinder_FlyingPathfinder(city);
	this.happiness = new simulation_Happiness(city,this);
	this.babyMaker = new simulation_BabyMaker(city,this);
	this.stats = new simulation_Stats(city,this);
	this.bonuses = new simulation_BonusResults();
	this.flyingSaucers = [];
	this.trainsByBuildingLeft = new haxe_ds_ObjectMap();
	this.trainsByBuildingRight = new haxe_ds_ObjectMap();
	this.trains = [];
	this.citizenSpawners = [];
	this.rocketsGoingDown = [];
	this.eating = new simulation_Eating(this);
	this.resourcePriorityManager = new simulation_ResourcePriorityManager(city);
	this.fishes = new simulation_FishManager(this);
	this.frogs = new simulation_FrogManager(this);
	this.animals = new simulation_AnimalManager(this);
	this.rockets = new simulation_Rockets(city);
	this.buildingUpgradesToUpdate = [];
	if(!Game.isLoading) {
		this.initPossibleHobbies();
	} else {
		this.possibleCitizenHobbies = [];
	}
	this.boostManager = new simulation_BoostManager(this);
	this.festivalManager = new simulation_festival_FestivalManager(city,this);
	this.citizenUpdater = new simulation_CitizenUpdater(this);
	this.operatingCost = new simulation_OperatingCost(city);
	if(city.progress.story.storyName == "snowWorld" || city.progress.story.storyName == "displayCitySnow") {
		this.winter = new simulation_winter_Winter(city);
	}
	this.hackerSchoolBonuses = new simulation_HackerSchoolBonuses(this);
};
CitySimulation.__name__ = "CitySimulation";
CitySimulation.prototype = {
	recalculateOperatingCosts: function() {
		this.operatingCost.recalculate();
	}
	,stop: function() {
		this.pathfinder.terminate();
	}
	,initPossibleHobbies: function() {
		this.possibleCitizenHobbies = [{ hobbyClass : simulation_citizenSpecialActions_ClimbIntoTree, minimumCitizenAmount : 1},{ hobbyClass : simulation_citizenSpecialActions_MoveToEdge, minimumCitizenAmount : 2},{ hobbyClass : simulation_citizenSpecialActions_WatchStars, minimumCitizenAmount : 5},{ hobbyClass : simulation_citizenSpecialActions_Protester, minimumCitizenAmount : 6},{ hobbyClass : simulation_citizenSpecialActions_Protester2, minimumCitizenAmount : 12},{ hobbyClass : simulation_citizenSpecialActions_Protester3, minimumCitizenAmount : 18},{ hobbyClass : simulation_citizenSpecialActions_Protester4, minimumCitizenAmount : 24},{ hobbyClass : simulation_citizenSpecialActions_DanceOnBall, minimumCitizenAmount : 35},{ hobbyClass : simulation_citizenSpecialActions_ClimbOntoRuins, minimumCitizenAmount : 80}];
	}
	,update: function(timeMod) {
		var previousHour = ((this.time.timeSinceStart | 0) / 60 | 0) % 24;
		this.time.update(timeMod);
		if(previousHour >= 23 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 < 1) {
			this.stats.midnightUpdate();
		}
		this.stats.update(timeMod);
		this.permanentFinder.preUpdate();
		this.pathfinder.distributePaths();
		var i = this.flyingSaucers.length;
		while(--i >= 0) this.flyingSaucers[i].update(timeMod);
		var i = this.trains.length;
		while(--i >= 0) this.trains[i].update(timeMod);
		var i = this.citizenSpawners.length;
		while(--i >= 0) this.citizenSpawners[i].update(timeMod);
		var i = this.rocketsGoingDown.length;
		while(--i >= 0) this.rocketsGoingDown[i].update(timeMod);
		this.festivalManager.update(timeMod);
		if(this.citizens.length > 0) {
			if(this.festivalManager.hasFestival()) {
				this.festivalManager.updateFestivalCitizens(timeMod);
			} else {
				this.citizenUpdater.update(timeMod);
			}
			if(previousHour < 12 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 >= 12) {
				var _g = 0;
				var _g1 = this.citizens;
				while(_g < _g1.length) {
					var citizen = _g1[_g];
					++_g;
					citizen.midDayUpdate();
				}
			}
			var val1 = this.citizens.length;
			var val2 = Math.ceil(this.infrequentUpdateStart + this.citizens.length / 60);
			var i = val2 < val1 ? val2 : val1;
			var minNumber = Math.ceil(this.infrequentUpdateStart);
			while(--i >= minNumber) this.citizens[i].infrequentUpdate();
			this.infrequentUpdateStart += this.citizens.length / 60;
			if(this.infrequentUpdateStart >= this.citizens.length) {
				this.infrequentUpdateStart = 0;
			}
		}
		this.fishes.update(timeMod);
		this.frogs.update(timeMod);
		this.animals.update(timeMod);
		this.rockets.update(timeMod);
		this.babyMaker.update(timeMod);
		this.pathfinder.update(timeMod);
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var permanent = _g1[_g];
			++_g;
			permanent.update(timeMod);
		}
		var _g = 0;
		var _g1 = this.buildingUpgradesToUpdate;
		while(_g < _g1.length) {
			var bu = _g1[_g];
			++_g;
			bu.update(timeMod);
		}
		this.boostManager.update(timeMod);
		this.operatingCost.update(timeMod);
		if(this.winter != null) {
			this.winter.update(timeMod);
		}
		this.hackerSchoolBonuses.update(timeMod);
	}
	,lateUpdate: function() {
		if(this.citizens.length < 5000) {
			this.houseAssigner.limitHouseAssignments = 400;
		} else if(this.citizens.length < 10000) {
			this.houseAssigner.limitHouseAssignments = 200;
		} else {
			this.houseAssigner.limitHouseAssignments = 100;
		}
		var timeMod = this.prevTimeMod;
		this.jobAssigner.assignJobs();
		this.schoolAssigner.assignSchools();
		this.houseAssigner.assignHouses();
		this.happiness.update(timeMod);
		this.eating.update(timeMod);
	}
	,updateWhilePaused: function() {
		this.stats.update(0);
		this.boostManager.update(0);
		this.prevTimeMod = 0;
		var _g = 0;
		var _g1 = this.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			citizen.actuallyUpdateDraw();
		}
		if(this.winter != null) {
			this.winter.update(0);
		}
		this.hackerSchoolBonuses.update(0);
	}
	,recomputeCull: function() {
		var _g = 0;
		var _g1 = this.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			citizen.updateCull();
		}
	}
	,createCitizen: function(onWorld,age,startInPermanent,startX) {
		if(age == null) {
			age = 0;
		}
		var _gthis = this;
		if(startX == null) {
			startX = startInPermanent == null ? random_Random.getInt(onWorld.rect.width - 2) : random_Random.getInt(20);
		}
		var newCitizen = new Citizen(this.city,this,this.foregroundStage,this.inBuildingStage,this.inBuildingStageNonParticle,this.adultTextures,this.childrenTextures,onWorld,startX,age,startInPermanent);
		this.citizens.push(newCitizen);
		var isPossibleHobby = function(hobby) {
			return _gthis.citizens.length >= hobby.minimumCitizenAmount;
		};
		if(this.possibleCitizenHobbies.length > 0 && common_ArrayExtensions.any(this.possibleCitizenHobbies,isPossibleHobby) && (this.city.progress.story.storyName != "cityofthekey" || this.citizens.length > 100)) {
			var _g = [];
			var _g1 = 0;
			var _g2 = this.possibleCitizenHobbies;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(isPossibleHobby(v)) {
					_g.push(v);
				}
			}
			var hobby = random_Random.fromArray(_g);
			newCitizen.setHobby(Type.createInstance(hobby.hobbyClass,[newCitizen]));
			HxOverrides.remove(this.possibleCitizenHobbies,hobby);
		}
		return newCitizen;
	}
	,updatePathfinder: function(invalidate,invalidateRelatedTo) {
		this.city.onCityChange();
		if(invalidate) {
			this.pathfinder.invalidateAllPaths();
			var _g = 0;
			var _g1 = this.citizens;
			while(_g < _g1.length) {
				var citizen = _g1[_g];
				++_g;
				if(citizen.path != null && (citizen.pathOnlyRelatedTo == null || invalidateRelatedTo == null || invalidateRelatedTo == citizen.pathOnlyRelatedTo)) {
					var resetCanViewSelfInBuilding = false;
					if(resetCanViewSelfInBuilding == null) {
						resetCanViewSelfInBuilding = true;
					}
					if(citizen.recyclePathArray) {
						pooling_Int32ArrayPool.returnToPool(citizen.path);
						citizen.recyclePathArray = false;
					}
					citizen.path = null;
					citizen.nextPathPos = -1;
					citizen.pathEnd = -1;
					citizen.currentPathAction = -2;
					if(resetCanViewSelfInBuilding) {
						if(!citizen.canViewSelfInBuilding) {
							citizen.delayCanViewSelfInBuilding = true;
						}
						citizen.canViewSelfInBuilding = true;
					}
					citizen.verticalPathProgress = 0;
					citizen.pathEndFunction = null;
					citizen.requestingPathGoal = null;
					citizen.pathOnlyRelatedTo = null;
					citizen.pathWalkSpeed = 1;
					citizen.pathCanBeReconsidered = true;
					if(citizen.sprite.alpha > 0 && citizen.sprite.alpha < 1) {
						citizen.sprite.alpha = 1;
					}
					citizen.actuallyUpdateDraw();
				}
			}
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var permanent = _g1[_g];
				++_g;
				permanent.invalidatePathfindingRelatedInfo();
			}
			this.permanentFinder.invalidatePathfindingRelatedInfo();
			this.permanentFinder.requestQueryLimiting(true);
		}
		this.permanentFinder.clearPFCache();
		var i = this.trains.length;
		while(--i >= 0) this.trains[i].onCityChange();
		this.city.miscCityElements.onCityChange();
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var permanent = _g1[_g];
			++_g;
			permanent.onCityChange();
		}
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var permanent = _g1[_g];
			++_g;
			permanent.onCityChangePost();
		}
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var world = _g1[_g];
			++_g;
			world.onCityChange();
		}
		var _g = 0;
		var _g1 = this.fishes.fishes;
		while(_g < _g1.length) {
			var fish = _g1[_g];
			++_g;
			if(fish.inPermanent != invalidateRelatedTo) {
				fish.pushBackIntoPermanent();
			}
		}
		var i = this.animals.animals.length;
		while(--i >= 0) this.animals.animals[i].pushBackIntoPermanentOrDestroy();
		var i = this.trains.length;
		while(--i >= 0) this.trains[i].onCityChangePart2();
		simulation_TrainColorer.colorAllTrains(this.city);
		this.hackerSchoolBonuses.onCityChange();
		this.pathfinder.sendPathfindingInfo();
		this.recalculateOperatingCosts();
	}
	,handleMouse: function(mouse) {
		var hasSpecial = this.city.specialAction != null && this.city.specialAction.get_specialActionID() == "FollowCitizenAction";
		if(this.city.game.keyboard.down[17] || hasSpecial) {
			switch(mouse.claimMouse(this,null,false)._hx_index) {
			case 0:
				return true;
			case 1:
				var nearestCitizen = null;
				var nearestFish = null;
				var nearestFrog = null;
				var nearestAnimal = null;
				var nearestInvention = null;
				var currentDist = 10.0;
				if(this.city.game.isMobile) {
					currentDist = 25.0;
				}
				var _g = 0;
				var _g1 = this.citizens;
				while(_g < _g1.length) {
					var citizen = _g1[_g];
					++_g;
					var cityPos = citizen.getCityPosition();
					var xDist = cityPos.x + 1 - mouse.get_cityX();
					var yDist = cityPos.y - 3 - mouse.get_cityY();
					var distanceToMouse = Math.sqrt(xDist * xDist + yDist * yDist);
					if(distanceToMouse < currentDist) {
						currentDist = distanceToMouse;
						nearestCitizen = citizen;
					}
				}
				var _g = 0;
				var _g1 = this.fishes.fishes;
				while(_g < _g1.length) {
					var fish = _g1[_g];
					++_g;
					var cityPos = fish.getCityPosition();
					var xDist = cityPos.x - mouse.get_cityX();
					var yDist = cityPos.y - mouse.get_cityY();
					var distanceToMouse = Math.sqrt(xDist * xDist + yDist * yDist);
					if(distanceToMouse < currentDist) {
						currentDist = distanceToMouse;
						nearestCitizen = null;
						nearestFish = fish;
					}
				}
				var _g = 0;
				var _g1 = this.frogs.frogs;
				while(_g < _g1.length) {
					var frog = _g1[_g];
					++_g;
					var cityPos = frog.getCityPosition();
					var xDist = cityPos.x - mouse.get_cityX();
					var yDist = cityPos.y - mouse.get_cityY();
					var distanceToMouse = Math.sqrt(xDist * xDist + yDist * yDist);
					if(distanceToMouse < currentDist) {
						currentDist = distanceToMouse;
						nearestCitizen = null;
						nearestFrog = frog;
					}
				}
				var _g = 0;
				var _g1 = this.animals.animals;
				while(_g < _g1.length) {
					var animal = _g1[_g];
					++_g;
					var cityPos = animal.getCityPosition();
					var xDist = cityPos.x - mouse.get_cityX();
					var yDist = cityPos.y - animal.sprite.height / 2 - mouse.get_cityY();
					var distanceToMouse = Math.sqrt(xDist * xDist + yDist * yDist);
					if(distanceToMouse < currentDist) {
						currentDist = distanceToMouse;
						nearestCitizen = null;
						nearestAnimal = animal;
					}
				}
				var _g = 0;
				var _g1 = this.hackerSchoolBonuses.inventions;
				while(_g < _g1.length) {
					var invention = _g1[_g];
					++_g;
					var cityPos = invention.getCityPosition();
					var xDist = cityPos.x - mouse.get_cityX();
					var yDist = cityPos.y - invention.sprite.height / 2 - mouse.get_cityY();
					var distanceToMouse = Math.sqrt(xDist * xDist + yDist * yDist);
					if(distanceToMouse - 2 <= currentDist) {
						currentDist = distanceToMouse;
						nearestCitizen = null;
						nearestInvention = invention;
					}
				}
				if(nearestFish != null) {
					nearestFish.onClick();
					this.city.game.audio.playSound(this.city.game.audio.followCitizenSound);
					if(this.city.specialAction != null) {
						this.city.specialAction.deactivate(true);
					}
				} else if(nearestFrog != null) {
					nearestFrog.onClick();
					this.city.game.audio.playSound(this.city.game.audio.followCitizenSound);
					if(this.city.specialAction != null) {
						this.city.specialAction.deactivate(true);
					}
				} else if(nearestInvention != null) {
					nearestInvention.onClick();
					this.city.game.audio.playSound(this.city.game.audio.followCitizenSound);
					if(this.city.specialAction != null) {
						this.city.specialAction.deactivate(true);
					}
				} else if(nearestAnimal != null) {
					nearestAnimal.onClick();
					this.city.game.audio.playSound(this.city.game.audio.followCitizenSound);
					if(this.city.specialAction != null) {
						this.city.specialAction.deactivate(true);
					}
				} else if(nearestCitizen != null) {
					nearestCitizen.onClick();
					this.city.game.audio.playSound(this.city.game.audio.followCitizenSound);
					if(this.city.specialAction != null) {
						this.city.specialAction.deactivate(true);
					}
				}
				return true;
			case 2:
				return hasSpecial;
			}
		}
		return false;
	}
	,save: function(queue) {
		this.time.save(queue);
		var value = this.citizenSpawners.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		Lambda.iter(this.citizenSpawners,function(s) {
			s.save(queue);
		});
		queue.addString(Citizen.saveDefinition);
		var value = this.citizens.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.citizens;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			var value = c.onWorld.id;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes = tmp;
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
			c.save(queue,false);
			var value1 = c.inPermanent != null ? c.inPermanent.id : -1;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes1 = queue.bytes;
				var tmp1 = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes = tmp1;
				queue.bytes.blit(0,oldBytes1,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value1);
			queue.size += 4;
			var value2 = c.job == null ? -1 : c.job.id;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes2 = queue.bytes;
				var tmp2 = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes = tmp2;
				queue.bytes.blit(0,oldBytes2,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value2);
			queue.size += 4;
			var value3 = c.home == null ? -1 : c.home.id;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes3 = queue.bytes;
				var tmp3 = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes = tmp3;
				queue.bytes.blit(0,oldBytes3,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value3);
			queue.size += 4;
			var value4 = c.school == null ? -1 : c.school.id;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes4 = queue.bytes;
				var tmp4 = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes = tmp4;
				queue.bytes.blit(0,oldBytes4,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value4);
			queue.size += 4;
		}
		this.happiness.save(queue);
		this.bonuses.save(queue);
		this.jobAssigner.save(queue);
		this.eating.save(queue);
		this.stats.save(queue);
		var _g = 0;
		var _g1 = this.citizens.length;
		while(_g < _g1) {
			var i = _g++;
			var citizen = this.citizens[i];
			citizen.tempId = i;
			if(citizen.hobby != null) {
				if(queue.size + 4 > queue.bytes.length) {
					var oldBytes = queue.bytes;
					var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
					queue.bytes = tmp;
					queue.bytes.blit(0,oldBytes,0,queue.size);
				}
				queue.bytes.setInt32(queue.size,i);
				queue.size += 4;
				var c = js_Boot.getClass(citizen.hobby);
				queue.addString(c.__name__);
			}
		}
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,-1);
		queue.size += 4;
		this.babyMaker.save(queue);
		this.resourcePriorityManager.save(queue);
		this.boostManager.save(queue);
		this.houseAssigner.save(queue);
		this.fishes.save(queue);
		this.frogs.save(queue);
		this.animals.save(queue);
		this.festivalManager.save(queue);
		this.operatingCost.save(queue);
		var value = this.rocketsGoingDown.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		Lambda.iter(this.rocketsGoingDown,function(r) {
			r.save(queue);
		});
		this.rockets.save(queue);
		this.updateFavoriteCitizens();
		var value = this.favoriteCitizens.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		if(this.favoriteCitizens.length > 0) {
			var _g = 0;
			var _g1 = this.favoriteCitizens;
			while(_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				var value = f.tempId;
				if(queue.size + 4 > queue.bytes.length) {
					var oldBytes = queue.bytes;
					var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
					queue.bytes = tmp;
					queue.bytes.blit(0,oldBytes,0,queue.size);
				}
				queue.bytes.setInt32(queue.size,value);
				queue.size += 4;
			}
		}
		var value = this.recentlyPassedFavoriteCitizens.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.recentlyPassedFavoriteCitizens;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			queue.addString(r);
		}
		this.hackerSchoolBonuses.save(queue);
	}
	,load: function(queue) {
		this.time.load(queue);
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var spawnerNumber = intToRead;
		var _g = 0;
		var _g1 = spawnerNumber;
		while(_g < _g1) {
			var i = _g++;
			this.citizenSpawners.push(simulation_SpawnFlyingSaucer.fromLoad(queue,this.city.simulation,this.city.farForegroundStage));
		}
		var citizenDefinition = queue.readString();
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var num = intToRead;
		var _g = 0;
		var _g1 = num;
		while(_g < _g1) {
			var i = _g++;
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var worldId = [intToRead];
			var world = null;
			if(queue.version >= 44) {
				world = Lambda.find(this.city.worlds,(function(worldId) {
					return function(w) {
						return w.id == worldId[0];
					};
				})(worldId));
			} else {
				world = this.city.worlds[worldId[0]];
			}
			var c = this.createCitizen(world);
			c.load(queue,citizenDefinition);
			var intToRead1 = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var inPermanentInt = intToRead1;
			if(inPermanentInt != -1) {
				c.inPermanent = this.city.findPermanentByID(inPermanentInt);
			}
			var intToRead2 = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var jobInt = intToRead2;
			if(jobInt != -1) {
				c.job = this.city.findPermanentByID(jobInt);
				if(c.job != null && c.job.is(buildings_Work)) {
					c.job.workers.push(c);
				} else {
					c.job = null;
					if(c.get_age() > 16) {
						this.jobAssigner.citizensWithoutJob.push(c);
					}
					if(c.currentAction == 0) {
						c.currentAction = 2;
					}
				}
			} else if(c.get_age() > 16) {
				this.jobAssigner.citizensWithoutJob.push(c);
			}
			var intToRead3 = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var homeInt = intToRead3;
			if(homeInt != -1) {
				c.home = this.city.findPermanentByID(homeInt);
				if(c.home != null && c.home.is(buildings_House)) {
					c.home.residents.push(c);
				} else {
					c.home = null;
				}
			}
			var intToRead4 = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var schoolInt = intToRead4;
			if(schoolInt != -1) {
				c.school = this.city.findPermanentByID(schoolInt);
				if(c.school != null && c.school.is(buildings_School)) {
					c.school.students.push(c);
				} else {
					c.school = null;
				}
			}
			c.afterLoadingInPermanent();
		}
		this.jobAssigner.buildingsHaveWork = true;
		this.houseAssigner.shouldUpdateHouses = true;
		this.schoolAssigner.schoolsShouldBeUpdated = true;
		this.happiness.load(queue);
		this.bonuses.load(queue);
		this.jobAssigner.load(queue);
		this.eating.load(queue);
		if(queue.version >= 2) {
			this.stats.load(queue);
		}
		if(queue.version >= 3) {
			this.initPossibleHobbies();
			var i;
			while(true) {
				var intToRead = queue.bytes.getInt32(queue.readStart);
				queue.readStart += 4;
				i = intToRead;
				if(!(i != -1)) {
					break;
				}
				var name = queue.readString();
				var cls = [$hxClasses[name]];
				this.citizens[i].setHobby(Type.createInstance(cls[0],[this.citizens[i]]));
				HxOverrides.remove(this.possibleCitizenHobbies,Lambda.find(this.possibleCitizenHobbies,(function(cls) {
					return function(h) {
						return h.hobbyClass == cls[0];
					};
				})(cls)));
			}
		}
		if(queue.version >= 9) {
			this.babyMaker.load(queue);
		}
		if(queue.version >= 10) {
			this.resourcePriorityManager.load(queue);
		}
		if(queue.version >= 16) {
			this.boostManager.load(queue);
		}
		if(queue.version >= 17) {
			this.houseAssigner.load(queue);
		}
		if(queue.version >= 19) {
			this.fishes.load(queue);
		}
		if(queue.version >= 45) {
			this.frogs.load(queue);
		}
		if(queue.version >= 52) {
			this.animals.load(queue);
		}
		if(queue.version >= 21) {
			this.festivalManager.load(queue);
		}
		if(queue.version >= 37) {
			this.operatingCost.load(queue);
		}
		if(queue.version >= 49) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var rgdNumber = intToRead;
			var _g = 0;
			var _g1 = rgdNumber;
			while(_g < _g1) {
				var i = _g++;
				this.rocketsGoingDown.push(simulation_RocketGoingDown.fromLoad(queue,this.city.simulation,this.city.farForegroundStage));
			}
		}
		if(queue.version >= 50) {
			this.rockets.load(queue);
		}
		if(queue.version >= 58) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var len = intToRead;
			var _g = 0;
			var _g1 = len;
			while(_g < _g1) {
				var i = _g++;
				var tmp = this.favoriteCitizens;
				var tmp1 = this.city.simulation.citizens;
				var intToRead = queue.bytes.getInt32(queue.readStart);
				queue.readStart += 4;
				tmp.push(tmp1[intToRead]);
			}
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var len2 = intToRead;
			var _g = 0;
			var _g1 = len2;
			while(_g < _g1) {
				var i = _g++;
				this.recentlyPassedFavoriteCitizens.push(queue.readString());
			}
		}
		if(queue.version >= 65) {
			this.hackerSchoolBonuses.load(queue);
		}
		buildings_PioneersHut.allUpgradesDoPermanentEffects(this.city,this.bonuses.chosenEarlyGameUpgrades);
		this.time.lastLoadTime = this.time.timeSinceStart;
	}
	,updateFavoriteCitizens: function() {
		var i = this.favoriteCitizens.length;
		while(--i >= 0) {
			var citizen = this.favoriteCitizens[i];
			if(citizen.hasDied) {
				this.favoriteCitizens.splice(i,1);
				this.recentlyPassedFavoriteCitizens.push(citizen.nameIndex < Resources.citizenNames.length ? Resources.citizenNames[citizen.nameIndex] : common_StringExtensions.firstToUpper(common_Localize.lo("citizen")));
				if(this.recentlyPassedFavoriteCitizens.length > 50) {
					this.recentlyPassedFavoriteCitizens.splice(0,1);
				}
			}
		}
	}
	,afterLoad: function() {
		this.festivalManager.afterLoad();
		var _g = 0;
		var _g1 = this.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			citizen.afterLoad();
		}
		this.rockets.afterLoad();
	}
	,uncull: function() {
		var _g = 0;
		var _g1 = this.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			citizen.uncull();
		}
	}
	,__class__: CitySimulation
};
