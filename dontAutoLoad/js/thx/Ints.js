var thx_Ints = $hxClasses["thx.Ints"] = function() { };
thx_Ints.__name__ = "thx.Ints";
thx_Ints.parse = function(s,base) {
	if(null == base) {
		if(s.substring(0,2) == "0x") {
			base = 16;
		} else {
			base = 10;
		}
	}
	var v = parseInt(s,base);
	if(isNaN(v)) {
		return null;
	} else {
		return v;
	}
};
var thx_color_Cmy = {};
thx_color_Cmy.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_Cmy.toRgbx = function(this1) {
	var this2 = [1 - this1[0],1 - this1[1],1 - this1[2]];
	return this2;
};
thx_color_Cmy.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_Cmy.toRgbx(this1));
};
var thx_color_Cmyk = {};
thx_color_Cmyk.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,4);
	var this1 = [arr[0],arr[1],arr[2],arr[3]];
	return this1;
};
thx_color_Cmyk.toRgbx = function(this1) {
	var this2 = [(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])];
	return this2;
};
thx_color_Cmyk.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_Cmyk.toRgbx(this1));
};
