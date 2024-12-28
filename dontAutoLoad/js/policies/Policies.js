var policies_Policies = $hxClasses["policies.Policies"] = function(city) {
	this.city = city;
	this.policies = [];
	this.vars = new policies_PolicyVars();
};
policies_Policies.__name__ = "policies.Policies";
policies_Policies.prototype = {
	addPolicy: function(policy) {
		this.policies.push(policy);
		policy.addToCity(this.city);
	}
	,removePolicy: function(policy) {
		HxOverrides.remove(this.policies,policy);
		policy.destroy();
	}
	,save: function(queue) {
		var value = this.policies.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.policies;
		while(_g < _g1.length) {
			var policy = _g1[_g];
			++_g;
			var c = js_Boot.getClass(policy);
			queue.addString(c.__name__);
			policy.save(queue);
		}
	}
	,load: function(queue) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var len = intToRead;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			var name = queue.readString();
			var poli = Type.createInstance($hxClasses[name],[]);
			poli.load(queue);
			this.addPolicy(poli);
		}
	}
	,__class__: policies_Policies
};
