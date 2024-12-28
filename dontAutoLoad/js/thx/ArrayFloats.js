var thx_ArrayFloats = $hxClasses["thx.ArrayFloats"] = function() { };
thx_ArrayFloats.__name__ = "thx.ArrayFloats";
thx_ArrayFloats.resize = function(array,length,fill) {
	if(fill == null) {
		fill = 0.0;
	}
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayFloats.resized = function(array,length,fill) {
	if(fill == null) {
		fill = 0.0;
	}
	array = array.slice();
	return thx_ArrayFloats.resize(array,length,fill);
};
