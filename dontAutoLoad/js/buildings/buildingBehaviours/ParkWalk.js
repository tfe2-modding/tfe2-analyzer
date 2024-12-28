var buildings_buildingBehaviours_ParkWalk = $hxClasses["buildings.buildingBehaviours.ParkWalk"] = function() { };
buildings_buildingBehaviours_ParkWalk.__name__ = "buildings.buildingBehaviours.ParkWalk";
buildings_buildingBehaviours_ParkWalk.beEntertainedPark = function(leftBuilding,rightBuilding,citizen) {
	var leftGardensSkipBuilding = false;
	var rightGardensSkipBuilding = false;
	if(leftBuilding != null && leftBuilding.is(buildings_ParkPod)) {
		leftBuilding = leftBuilding.leftBuilding;
		leftGardensSkipBuilding = true;
	}
	if(rightBuilding != null && rightBuilding.is(buildings_ParkPod)) {
		rightBuilding = rightBuilding.rightBuilding;
		rightGardensSkipBuilding = true;
	}
	var leftGardens = leftBuilding != null && leftBuilding.is(buildings_BotanicalGardens);
	var rightGardens = rightBuilding != null && rightBuilding.is(buildings_BotanicalGardens);
	var leftGardensCanWalk = leftGardens && (leftBuilding.bottomBuilding == null || !leftBuilding.bottomBuilding.is(buildings_BotanicalGardens));
	var rightGardensCanWalk = rightGardens && (rightBuilding.bottomBuilding == null || !rightBuilding.bottomBuilding.is(buildings_BotanicalGardens));
	if(!leftGardens) {
		if(leftBuilding != null) {
			if(leftBuilding.is(buildings_Park)) {
				leftGardens = true;
				leftGardensCanWalk = true;
			}
		}
	}
	if(!rightGardens) {
		if(rightBuilding != null) {
			if(rightBuilding.is(buildings_Park)) {
				rightGardens = true;
				rightGardensCanWalk = true;
			}
		}
	}
	var doingSomething = false;
	var goTo = random_Random.getInt(1 + (leftGardens ? 1 : 0) + (rightGardens ? 1 : 0));
	if(leftGardens && goTo == 0) {
		if(leftGardensSkipBuilding) {
			if(leftGardensCanWalk) {
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[10].length > 0 ? pool[10].splice(pool[10].length - 1,1)[0] : new Int32Array(10);
				arr[0] = 12;
				arr[1] = 50;
				arr[2] = 2;
				arr[3] = 0;
				arr[4] = 2;
				arr[5] = 0;
				arr[6] = 4;
				arr[7] = random_Random.getInt(0,18);
				arr[8] = 8;
				arr[9] = random_Random.getInt(100,180);
				citizen.setPath(arr,0,8,true);
				doingSomething = true;
			}
		} else if(leftGardensCanWalk) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 2;
			arr[3] = 0;
			arr[4] = 4;
			arr[5] = random_Random.getInt(0,18);
			arr[6] = 8;
			arr[7] = random_Random.getInt(100,180);
			citizen.setPath(arr,0,8,true);
			doingSomething = true;
		} else if(random_Random.getInt(2) == 0) {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(-3,-3),random_Random.getInt(70,90),null,modifyWithHappiness,slowMove);
			doingSomething = true;
		}
	} else if(rightGardens && goTo == 1) {
		if(rightGardensSkipBuilding) {
			if(rightGardensCanWalk) {
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[10].length > 0 ? pool[10].splice(pool[10].length - 1,1)[0] : new Int32Array(10);
				arr[0] = 12;
				arr[1] = 50;
				arr[2] = 3;
				arr[3] = 0;
				arr[4] = 3;
				arr[5] = 0;
				arr[6] = 4;
				arr[7] = random_Random.getInt(0,18);
				arr[8] = 8;
				arr[9] = random_Random.getInt(100,180);
				citizen.setPath(arr,0,8,true);
				doingSomething = true;
			}
		} else if(rightGardensCanWalk) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 3;
			arr[3] = 0;
			arr[4] = 4;
			arr[5] = random_Random.getInt(0,18);
			arr[6] = 8;
			arr[7] = random_Random.getInt(100,180);
			citizen.setPath(arr,0,8,true);
			doingSomething = true;
		} else if(random_Random.getInt(2) == 0) {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(21,21),random_Random.getInt(70,90),null,modifyWithHappiness,slowMove);
			doingSomething = true;
		}
	}
	if(!doingSomething) {
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(leftGardens ? 0 : 3,rightGardens ? 18 : 15),random_Random.getInt(100,180),null,modifyWithHappiness,slowMove);
	}
};
buildings_buildingBehaviours_ParkWalk.beEntertainedRooftopPark = function(leftBuilding,rightBuilding,citizen) {
	var leftGardens = leftBuilding != null && leftBuilding.is(buildings_RooftopPark);
	var rightGardens = rightBuilding != null && rightBuilding.is(buildings_RooftopPark);
	var doingSomething = false;
	if(leftGardens && citizen.relativeX < 1) {
		if(citizen.inPermanent != null) {
			citizen.inPermanent.onCitizenLeave(citizen,leftBuilding);
		}
		citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
		citizen.inPermanent = leftBuilding;
		citizen.hasBuildingInited = false;
		citizen.setRelativeX(citizen.relativeX + 20);
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(3,15),random_Random.getInt(100,180),null,modifyWithHappiness,slowMove);
		return;
	}
	if(rightGardens && citizen.relativeX > 19) {
		if(citizen.inPermanent != null) {
			citizen.inPermanent.onCitizenLeave(citizen,rightBuilding);
		}
		citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
		citizen.inPermanent = rightBuilding;
		citizen.hasBuildingInited = false;
		citizen.setRelativeX(citizen.relativeX - 20);
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(3,15),random_Random.getInt(100,180),null,modifyWithHappiness,slowMove);
		return;
	}
	var goTo = random_Random.getInt(1 + (leftGardens ? 1 : 0) + (rightGardens ? 1 : 0));
	if(leftGardens && goTo == 0) {
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(slowMove) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 4;
			arr[3] = 0;
			citizen.setPath(arr,0,4,true);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = 0;
			citizen.setPath(arr,0,2,true);
		}
		citizen.pathEndFunction = null;
		citizen.pathOnlyRelatedTo = citizen.inPermanent;
		doingSomething = true;
	} else if(rightGardens && goTo == 1) {
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(slowMove) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 4;
			arr[3] = 20;
			citizen.setPath(arr,0,4,true);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = 20;
			citizen.setPath(arr,0,2,true);
		}
		citizen.pathEndFunction = null;
		citizen.pathOnlyRelatedTo = citizen.inPermanent;
		doingSomething = true;
	}
	if(!doingSomething) {
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(0,19),random_Random.getInt(100,180),null,modifyWithHappiness,slowMove);
	}
};
buildings_buildingBehaviours_ParkWalk.beEntertainedFlowerSchool = function(leftBuilding,rightBuilding,citizen) {
	var leftGardensSkipBuilding = false;
	var rightGardensSkipBuilding = false;
	var leftGardens = leftBuilding != null && leftBuilding.is(buildings_BotanicalGardens);
	var rightGardens = rightBuilding != null && rightBuilding.is(buildings_BotanicalGardens);
	var leftGardensCanWalk = leftGardens && (leftBuilding.bottomBuilding == null || !leftBuilding.bottomBuilding.is(buildings_BotanicalGardens));
	var rightGardensCanWalk = rightGardens && (rightBuilding.bottomBuilding == null || !rightBuilding.bottomBuilding.is(buildings_BotanicalGardens));
	if(!leftGardens) {
		if(leftBuilding != null) {
			if(leftBuilding.is(buildings_Park)) {
				leftGardens = true;
				leftGardensCanWalk = true;
			}
			if(leftBuilding.is(buildings_HippieSchool)) {
				leftGardens = true;
				leftGardensCanWalk = true;
			}
		}
	}
	if(!rightGardens) {
		if(rightBuilding != null) {
			if(rightBuilding.is(buildings_Park)) {
				rightGardens = true;
				rightGardensCanWalk = true;
			}
			if(rightBuilding.is(buildings_HippieSchool)) {
				rightGardens = true;
				rightGardensCanWalk = true;
			}
		}
	}
	var doingSomething = false;
	var goTo = random_Random.getInt(1 + (leftGardens ? 1 : 0) + (rightGardens ? 1 : 0));
	if(leftGardens && goTo == 0) {
		if(leftGardensSkipBuilding) {
			if(leftGardensCanWalk) {
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[10].length > 0 ? pool[10].splice(pool[10].length - 1,1)[0] : new Int32Array(10);
				arr[0] = 12;
				arr[1] = 50;
				arr[2] = 2;
				arr[3] = 0;
				arr[4] = 2;
				arr[5] = 0;
				arr[6] = 4;
				arr[7] = random_Random.getInt(0,18);
				arr[8] = 8;
				arr[9] = random_Random.getInt(100,180);
				citizen.setPath(arr,0,8,true);
				doingSomething = true;
			}
		} else if(leftGardensCanWalk) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 2;
			arr[3] = 0;
			arr[4] = 4;
			arr[5] = random_Random.getInt(0,18);
			arr[6] = 8;
			arr[7] = random_Random.getInt(100,180);
			citizen.setPath(arr,0,8,true);
			doingSomething = true;
		} else if(random_Random.getInt(2) == 0) {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(-3,-3),random_Random.getInt(70,90),null,modifyWithHappiness,slowMove);
			doingSomething = true;
		}
	} else if(rightGardens && goTo == 1) {
		if(rightGardensSkipBuilding) {
			if(rightGardensCanWalk) {
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[10].length > 0 ? pool[10].splice(pool[10].length - 1,1)[0] : new Int32Array(10);
				arr[0] = 12;
				arr[1] = 50;
				arr[2] = 3;
				arr[3] = 0;
				arr[4] = 3;
				arr[5] = 0;
				arr[6] = 4;
				arr[7] = random_Random.getInt(0,18);
				arr[8] = 8;
				arr[9] = random_Random.getInt(100,180);
				citizen.setPath(arr,0,8,true);
				doingSomething = true;
			}
		} else if(rightGardensCanWalk) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 3;
			arr[3] = 0;
			arr[4] = 4;
			arr[5] = random_Random.getInt(0,18);
			arr[6] = 8;
			arr[7] = random_Random.getInt(100,180);
			citizen.setPath(arr,0,8,true);
			doingSomething = true;
		} else if(random_Random.getInt(2) == 0) {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(21,21),random_Random.getInt(70,90),null,modifyWithHappiness,slowMove);
			doingSomething = true;
		}
	}
	if(!doingSomething) {
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(leftGardens ? 0 : 3,rightGardens ? 18 : 15),random_Random.getInt(100,180),null,modifyWithHappiness,slowMove);
	}
};
