var random_Random = $hxClasses["random.Random"] = function() { };
random_Random.__name__ = "random.Random";
random_Random.getFloat = function(val0,val1) {
	var min = 0;
	var max = 1;
	if(val0 != null && val1 != null) {
		min = val0;
		max = val1;
	} else if(val0 != null) {
		max = val0;
	}
	return Math.random() * (max - min) + min;
};
random_Random.getInt = function(val0,val1) {
	var min = 0;
	var max = 2147483647;
	if(val0 != null && val1 != null) {
		min = val0;
		max = val1;
	} else if(val0 != null) {
		max = val0;
	}
	return Math.floor(Math.random() * (max - min)) + min;
};
random_Random.fromArray = function(arr) {
	if(arr.length == 0) {
		throw haxe_Exception.thrown("You can't get a random item from an empty array!");
	}
	return arr[random_Random.getInt(arr.length)];
};
