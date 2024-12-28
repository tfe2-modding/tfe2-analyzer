var pathfinder_FlyingPathfinderWaypoint = $hxClasses["pathfinder.FlyingPathfinderWaypoint"] = function(x,y) {
	this.connectedSite = null;
	this.prevWaypoint = null;
	this.seen = 0;
	this.connections = [];
	this.position = 0;
	this.priority = 0;
	this.x = x;
	this.y = y;
};
pathfinder_FlyingPathfinderWaypoint.__name__ = "pathfinder.FlyingPathfinderWaypoint";
pathfinder_FlyingPathfinderWaypoint.__interfaces__ = [polygonal_ds_Prioritizable];
pathfinder_FlyingPathfinderWaypoint.prototype = {
	__class__: pathfinder_FlyingPathfinderWaypoint
};
