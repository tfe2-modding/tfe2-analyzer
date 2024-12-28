var common_MathExtensions = $hxClasses["common.MathExtensions"] = function() { };
common_MathExtensions.__name__ = "common.MathExtensions";
common_MathExtensions.largeNumberFormat = function(cls,n) {
	if(n > 1e8) {
		return "" + common_MathExtensions.floatFormat(Math,n / 1e6,0) + "m";
	}
	if(n > 1e6) {
		return "" + common_MathExtensions.floatFormat(Math,n / 1e6,1) + "m";
	}
	if(n > 1e4) {
		return "" + common_MathExtensions.floatFormat(Math,n / 1e3,0) + "k";
	}
	if(n > 1e3) {
		return "" + common_MathExtensions.floatFormat(Math,n / 1e3,1) + "k";
	}
	return "" + n;
};
common_MathExtensions.largeNumberFormatAlt = function(cls,n) {
	if(n > 1e6) {
		return "" + common_MathExtensions.floatFormat(Math,n / 1e6,1) + "m";
	}
	if(n > 1e5) {
		return "" + common_MathExtensions.floatFormat(Math,n / 1e3,0) + "k";
	}
	return "" + n;
};
common_MathExtensions.floatFormat = function(cls,n,prec) {
	if(prec == 0) {
		return Std.string(Math.floor(n));
	}
	n = Math.round(n * Math.pow(10,prec));
	var str = "" + n;
	var len = str.length;
	if(len <= prec) {
		while(len < prec) {
			str = "0" + str;
			++len;
		}
		return "0." + str;
	} else {
		return HxOverrides.substr(str,0,str.length - prec) + "." + HxOverrides.substr(str,str.length - prec,null);
	}
};
