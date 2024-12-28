var common_ArrayExtensions = $hxClasses["common.ArrayExtensions"] = function() { };
common_ArrayExtensions.__name__ = "common.ArrayExtensions";
common_ArrayExtensions.whereMax = function(array,whereTrue,fn) {
	if(fn == null) {
		fn = function(val) {
			return val;
		};
	}
	var arrayMaxVal = -Infinity;
	var arrayMaxItem = null;
	var _g = 0;
	while(_g < array.length) {
		var item = array[_g];
		++_g;
		if(!whereTrue(item)) {
			continue;
		}
		var val = fn(item);
		if(val > arrayMaxVal) {
			arrayMaxItem = item;
			arrayMaxVal = val;
		}
	}
	return arrayMaxItem;
};
common_ArrayExtensions.whereMaxWithMax = function(array,whereTrue,fn,absoluteMax) {
	if(fn == null) {
		fn = function(val) {
			return val;
		};
	}
	var arrayMaxVal = -Infinity;
	var arrayMaxItem = null;
	var _g = 0;
	while(_g < array.length) {
		var item = array[_g];
		++_g;
		if(!whereTrue(item)) {
			continue;
		}
		var val = fn(item);
		if(val > arrayMaxVal) {
			arrayMaxItem = item;
			arrayMaxVal = val;
			if(val > absoluteMax) {
				return arrayMaxItem;
			}
		}
	}
	return arrayMaxItem;
};
common_ArrayExtensions.whereMin = function(array,whereTrue,fn) {
	if(fn == null) {
		fn = function(val) {
			return val;
		};
	}
	var arrayMaxVal = Infinity;
	var arrayMaxItem = null;
	var _g = 0;
	while(_g < array.length) {
		var item = array[_g];
		++_g;
		if(!whereTrue(item)) {
			continue;
		}
		var val = fn(item);
		if(val < arrayMaxVal) {
			arrayMaxItem = item;
			arrayMaxVal = val;
		}
	}
	return arrayMaxItem;
};
common_ArrayExtensions.max = function(array,fn) {
	if(fn == null) {
		fn = function(val) {
			return val;
		};
	}
	var arrayMaxVal = -Infinity;
	var arrayMaxItem = null;
	var _g = 0;
	while(_g < array.length) {
		var item = array[_g];
		++_g;
		var val = fn(item);
		if(val > arrayMaxVal) {
			arrayMaxItem = item;
			arrayMaxVal = val;
		}
	}
	return arrayMaxItem;
};
common_ArrayExtensions.min = function(array,fn) {
	if(fn == null) {
		fn = function(val) {
			return val;
		};
	}
	var arrayMinVal = Infinity;
	var arrayMinItem = null;
	var _g = 0;
	while(_g < array.length) {
		var item = array[_g];
		++_g;
		var val = fn(item);
		if(val < arrayMinVal) {
			arrayMinItem = item;
			arrayMinVal = val;
		}
	}
	return arrayMinItem;
};
common_ArrayExtensions.sum = function(array,fn) {
	if(fn == null) {
		fn = function(val) {
			return val;
		};
	}
	var total = 0;
	var _g = 0;
	while(_g < array.length) {
		var val = array[_g];
		++_g;
		total += fn(val);
	}
	return total;
};
common_ArrayExtensions.count = function(array,fn) {
	var total = 0;
	var _g = 0;
	while(_g < array.length) {
		var val = array[_g];
		++_g;
		total += fn(val) ? 1 : 0;
	}
	return total;
};
common_ArrayExtensions.sumFPoint = function(array,fn) {
	if(fn == null) {
		fn = function(val) {
			return val;
		};
	}
	var total = new common_FPoint(0,0);
	var _g = 0;
	while(_g < array.length) {
		var val = array[_g];
		++_g;
		var otherPoint = fn(val);
		total = new common_FPoint(total.x + otherPoint.x,total.y + otherPoint.y);
	}
	return total;
};
common_ArrayExtensions.isum = function(array,fn) {
	if(fn == null) {
		fn = function(val) {
			return val;
		};
	}
	var total = 0;
	var _g = 0;
	while(_g < array.length) {
		var val = array[_g];
		++_g;
		total += fn(val);
	}
	return total;
};
common_ArrayExtensions.any = function(array,fn) {
	var _g = 0;
	while(_g < array.length) {
		var val = array[_g];
		++_g;
		if(fn(val)) {
			return true;
		}
	}
	return false;
};
common_ArrayExtensions.all = function(array,fn) {
	var _g = 0;
	while(_g < array.length) {
		var val = array[_g];
		++_g;
		if(!fn(val)) {
			return false;
		}
	}
	return true;
};
common_ArrayExtensions.findRandom = function(array,query) {
	var i = random_Random.getInt(array.length);
	var orig = i;
	while(i < array.length) {
		var item = array[i];
		if(query(item)) {
			return item;
		}
		++i;
	}
	i = 0;
	while(i < orig) {
		var item = array[i];
		if(query(item)) {
			return item;
		}
		++i;
	}
	return null;
};
