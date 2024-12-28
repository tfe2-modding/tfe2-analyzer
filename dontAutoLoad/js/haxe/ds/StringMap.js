var haxe_ds_StringMap = $hxClasses["haxe.ds.StringMap"] = function() {
	this.h = Object.create(null);
};
haxe_ds_StringMap.__name__ = "haxe.ds.StringMap";
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.keysIterator = function(h) {
	var keys = Object.keys(h);
	var len = keys.length;
	var idx = 0;
	return { hasNext : function() {
		return idx < len;
	}, next : function() {
		idx += 1;
		return keys[idx - 1];
	}};
};
haxe_ds_StringMap.valueIterator = function(h) {
	var keys = Object.keys(h);
	var len = keys.length;
	var idx = 0;
	return { hasNext : function() {
		return idx < len;
	}, next : function() {
		idx += 1;
		return h[keys[idx - 1]];
	}};
};
haxe_ds_StringMap.prototype = {
	iterator: function() {
		return haxe_ds_StringMap.valueIterator(this.h);
	}
	,__class__: haxe_ds_StringMap
};
