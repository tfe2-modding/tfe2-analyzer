var pathfinder_DirectConnectionFinder = $hxClasses["pathfinder.DirectConnectionFinder"] = function() { };
pathfinder_DirectConnectionFinder.__name__ = "pathfinder.DirectConnectionFinder";
pathfinder_DirectConnectionFinder.find = function(city,fromBuilding,isGoal,ignoreBuilding) {
	var queue = new polygonal_ds_ArrayedQueue();
	if(queue.capacity == queue.mSize) {
		queue.grow();
	}
	queue.mData[(queue.mSize++ + queue.mFront) % queue.capacity] = fromBuilding;
	var permanentFinder = city.simulation.permanentFinder;
	if(permanentFinder.buildingAdjacent == null) {
		permanentFinder.preProcessQuery();
	}
	var pfSeen = permanentFinder.pfSeen;
	permanentFinder.pfSeenStart += 3;
	if(permanentFinder.pfSeenStart > 100000) {
		permanentFinder.pfSeenStart = 1;
	}
	pfSeen[fromBuilding.tempId] = city.simulation.permanentFinder.pfSeenStart;
	while(queue.mSize > 0) {
		var x = queue.mData[queue.mFront++];
		if(queue.mFront == queue.capacity) {
			queue.mFront = 0;
		}
		queue.mSize--;
		var bld = x;
		if(isGoal(bld)) {
			return bld;
		}
		var bld2 = bld.leftBuilding;
		if(bld2 != null) {
			if(!ignoreBuilding(bld2)) {
				if(pfSeen[bld2.tempId] != city.simulation.permanentFinder.pfSeenStart) {
					if(queue.capacity == queue.mSize) {
						queue.grow();
					}
					queue.mData[(queue.mSize++ + queue.mFront) % queue.capacity] = bld2;
					pfSeen[bld2.tempId] = city.simulation.permanentFinder.pfSeenStart;
				}
			}
		}
		var bld21 = bld.rightBuilding;
		if(bld21 != null) {
			if(!ignoreBuilding(bld21)) {
				if(pfSeen[bld21.tempId] != city.simulation.permanentFinder.pfSeenStart) {
					if(queue.capacity == queue.mSize) {
						queue.grow();
					}
					queue.mData[(queue.mSize++ + queue.mFront) % queue.capacity] = bld21;
					pfSeen[bld21.tempId] = city.simulation.permanentFinder.pfSeenStart;
				}
			}
		}
		var bld22 = bld.topBuilding;
		if(bld22 != null) {
			if(!ignoreBuilding(bld22)) {
				if(pfSeen[bld22.tempId] != city.simulation.permanentFinder.pfSeenStart) {
					if(queue.capacity == queue.mSize) {
						queue.grow();
					}
					queue.mData[(queue.mSize++ + queue.mFront) % queue.capacity] = bld22;
					pfSeen[bld22.tempId] = city.simulation.permanentFinder.pfSeenStart;
				}
			}
		}
		var bld23 = bld.bottomBuilding;
		if(bld23 != null) {
			if(!ignoreBuilding(bld23)) {
				if(pfSeen[bld23.tempId] != city.simulation.permanentFinder.pfSeenStart) {
					if(queue.capacity == queue.mSize) {
						queue.grow();
					}
					queue.mData[(queue.mSize++ + queue.mFront) % queue.capacity] = bld23;
					pfSeen[bld23.tempId] = city.simulation.permanentFinder.pfSeenStart;
				}
			}
		}
	}
	return null;
};
