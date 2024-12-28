var polygonal_ds_tools_GrowthRate = $hxClasses["polygonal.ds.tools.GrowthRate"] = function() { };
polygonal_ds_tools_GrowthRate.__name__ = "polygonal.ds.tools.GrowthRate";
polygonal_ds_tools_GrowthRate.compute = function(rate,capacity) {
	if(rate > 0) {
		capacity += rate;
	} else {
		switch(rate) {
		case -3:
			capacity <<= 1;
			break;
		case -2:
			capacity = (capacity * 3 >> 1) + 1;
			break;
		case -1:
			var newSize = capacity + 1;
			capacity = (newSize >> 3) + (newSize < 9 ? 3 : 6);
			capacity += newSize;
			break;
		case 0:
			throw haxe_Exception.thrown("out of space");
		}
	}
	return capacity;
};
