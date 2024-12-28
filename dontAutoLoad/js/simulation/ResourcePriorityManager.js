var simulation_ResourcePriorityManager = $hxClasses["simulation.ResourcePriorityManager"] = function(city) {
	this.priorities = [];
	this.city = city;
};
simulation_ResourcePriorityManager.__name__ = "simulation.ResourcePriorityManager";
simulation_ResourcePriorityManager.prototype = {
	prioritize: function(worldResource) {
		if(this.priorities.indexOf(worldResource) == -1) {
			this.priorities.push(worldResource);
		}
		this.invalidatePathfindingAfterPrioritizeChange(worldResource);
	}
	,invalidatePathfindingAfterPrioritizeChange: function(worldResource) {
		if(worldResource.is(worldResources_Rock)) {
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				if(pm.is(buildings_StoneMine)) {
					pm.invalidatePathfindingRelatedInfo();
				}
			}
		}
		if(worldResource.is(worldResources_Forest)) {
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				if(pm.is(buildings_WoodcuttingCentre)) {
					pm.invalidatePathfindingRelatedInfo();
				}
			}
		}
	}
	,hasResourcePrioritiesFor: function(type) {
		return common_ArrayExtensions.any(this.priorities,function(p) {
			return p.is(type);
		});
	}
	,deprioritize: function(worldResource) {
		if(this.priorities.indexOf(worldResource) != -1) {
			this.invalidatePathfindingAfterPrioritizeChange(worldResource);
			HxOverrides.remove(this.priorities,worldResource);
		}
	}
	,isPrioritized: function(worldResource) {
		return this.priorities.indexOf(worldResource) != -1;
	}
	,load: function(queue) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var numberOfStonePriorities = intToRead;
		this.priorities = [];
		var _g = 0;
		var _g1 = numberOfStonePriorities;
		while(_g < _g1) {
			var i = _g++;
			var this1 = this.city.permanentsByID;
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var pm = this1.h[intToRead];
			if(pm != null) {
				this.priorities.push(pm);
			}
		}
	}
	,save: function(queue) {
		var value = this.priorities.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.priorities;
		while(_g < _g1.length) {
			var sp = _g1[_g];
			++_g;
			var value = sp.id;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
		}
	}
	,__class__: simulation_ResourcePriorityManager
};
