var pathfinder_PermanentPrioritizable = $hxClasses["pathfinder.PermanentPrioritizable"] = function() {
	this.dontCheckElevators = false;
};
pathfinder_PermanentPrioritizable.__name__ = "pathfinder.PermanentPrioritizable";
pathfinder_PermanentPrioritizable.__interfaces__ = [polygonal_ds_Prioritizable];
pathfinder_PermanentPrioritizable.create = function(priority,permanent) {
	var inst = pathfinder_PermanentPrioritizable.pool.length == 0 ? new pathfinder_PermanentPrioritizable() : pathfinder_PermanentPrioritizable.pool.pop();
	inst.___internal_pooling_initObject(priority,permanent);
	return inst;
};
pathfinder_PermanentPrioritizable.prototype = {
	___internal_pooling_initObject: function(priority,permanent) {
		this.priority = priority;
		this.permanent = permanent;
		this.dontCheckElevators = false;
	}
	,destroy: function() {
		pathfinder_PermanentPrioritizable.pool.push(this);
	}
	,__class__: pathfinder_PermanentPrioritizable
};
