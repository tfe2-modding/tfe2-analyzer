var thx_Floats = $hxClasses["thx.Floats"] = function() { };
thx_Floats.__name__ = "thx.Floats";
thx_Floats.canParse = function(s) {
	if(!(thx_Floats.pattern_parse.match(s) || thx_Floats.pattern_inf.match(s))) {
		return thx_Floats.pattern_neg_inf.match(s);
	} else {
		return true;
	}
};
thx_Floats.parse = function(s) {
	if(s.substring(0,1) == "+") {
		s = s.substring(1);
	}
	if(thx_Floats.pattern_inf.match(s)) {
		return Infinity;
	} else if(thx_Floats.pattern_neg_inf.match(s)) {
		return -Infinity;
	} else {
		return parseFloat(s);
	}
};
thx_Floats.wrapCircular = function(v,max) {
	v %= max;
	if(v < 0) {
		v += max;
	}
	return v;
};
