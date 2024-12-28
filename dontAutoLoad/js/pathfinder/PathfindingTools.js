var pathfinder_PathfindingTools = $hxClasses["pathfinder.PathfindingTools"] = function() { };
pathfinder_PathfindingTools.__name__ = "pathfinder.PathfindingTools";
pathfinder_PathfindingTools.findNearestBestBuildingStack = function(citizen,ratingFunc) {
	var citizenPosition = citizen.get_worldX();
	var bestRating = -Infinity;
	var bestStack = null;
	var bestDistance = Infinity;
	var _g = 0;
	var _g1 = citizen.onWorld.permanents.length;
	while(_g < _g1) {
		var i = _g++;
		var stack = citizen.onWorld.permanents[i];
		var rating = ratingFunc(stack);
		var distance = Math.abs(citizenPosition - i * 20);
		if(rating > bestRating || rating == bestRating && distance < bestDistance) {
			bestStack = i;
			bestDistance = distance;
			bestRating = rating;
		}
	}
	return bestStack;
};
