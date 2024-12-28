var thx_ArrayInts = $hxClasses["thx.ArrayInts"] = function() { };
thx_ArrayInts.__name__ = "thx.ArrayInts";
thx_ArrayInts.resize = function(array,length,fill) {
	if(fill == null) {
		fill = 0;
	}
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayInts.resized = function(array,length,fill) {
	if(fill == null) {
		fill = 0;
	}
	array = array.slice();
	return thx_ArrayInts.resize(array,length,fill);
};
