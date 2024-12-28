var thx_color_Color = $hxClasses["thx.color.Color"] = function() { };
thx_color_Color.__name__ = "thx.color.Color";
thx_color_Color.parse = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) {
		info = thx_color_parse_ColorParser.parseColor(color);
	}
	if(null == info) {
		var rgb = thx_color_Color.namedColors.h[color];
		if(null == rgb) {
			return null;
		} else {
			return thx_color_Rgbx.toRgbxa(rgb);
		}
	}
	try {
		switch(info.name) {
		case "ciexyz":case "xyz":
			return thx_color_Xyz.toRgbxa(thx_color_Xyz.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		case "cmy":
			return thx_color_Cmy.toRgbxa(thx_color_Cmy.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		case "cmyk":
			return thx_color_Cmyk.toRgbxa(thx_color_Cmyk.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,4,false)));
		case "cubehelix":
			return thx_color_CubeHelix.toRgbxa(thx_color_CubeHelix.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		case "gray":case "grey":
			var this1 = thx_color_parse_ColorParser.getFloatChannels(info.channels,1,false)[0];
			return thx_color_Grey.toRgbxa(this1);
		case "hcl":
			var c = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			var this1 = [c[2],c[1],c[0]];
			return thx_color_LCh.toRgbxa(this1);
		case "hsb":case "hsv":
			return thx_color_Hsv.toRgbxa(thx_color_Hsv.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		case "hsl":
			return thx_color_Hsl.toRgbxa(thx_color_Hsl.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		case "hsla":
			return thx_color_Hsla.toRgbxa(thx_color_Hsla.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,4,false)));
		case "hsva":
			return thx_color_Hsva.toRgbxa(thx_color_Hsva.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,4,false)));
		case "hunterlab":
			return thx_color_HunterLab.toRgbxa(thx_color_HunterLab.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,4,false)));
		case "cielab":case "lab":
			return thx_color_Lab.toRgbxa(thx_color_Lab.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		case "cielch":case "lch":
			return thx_color_LCh.toRgbxa(thx_color_LCh.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		case "cieluv":case "luv":
			return thx_color_Luv.toRgbxa(thx_color_Luv.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		case "rgb":
			return thx_color_Rgbx.toRgbxa(thx_color_Rgbx.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,true)));
		case "rgba":
			return thx_color_Rgbxa.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,4,true));
		case "yuv":
			return thx_color_Yuv.toRgbxa(thx_color_Yuv.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		case "yxy":
			return thx_color_Yxy.toRgbxa(thx_color_Yxy.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false)));
		default:
			return null;
		}
	} catch( _g ) {
		return null;
	}
};
var thx_color_CubeHelix = {};
thx_color_CubeHelix.fromFloats = function(arr) {
	if(arr.length < 4) {
		arr = thx_ArrayFloats.resized(arr,3);
		arr.push(1);
	}
	var gamma = arr[3];
	var this1 = [arr[0],arr[1],arr[2],null == gamma ? 1.0 : gamma];
	return this1;
};
thx_color_CubeHelix.toRgbx = function(this1) {
	var h = isNaN(this1[0]) ? 0 : (this1[0] + 120) / 180 * Math.PI;
	var l = Math.pow(this1[2],this1[3]);
	var a = isNaN(this1[1]) ? 0 : this1[1] * l * (1 - l);
	var cosh = Math.cos(h);
	var sinh = Math.sin(h);
	var this1 = [l + a * (-0.14861 * cosh + 1.78277 * sinh),l + a * (-0.29227 * cosh + -0.90649 * sinh),l + a * (1.97294 * cosh)];
	return this1;
};
thx_color_CubeHelix.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_CubeHelix.toRgbx(this1));
};
var thx_color_Grey = {};
thx_color_Grey.toRgbx = function(this1) {
	var this2 = [this1,this1,this1];
	return this2;
};
thx_color_Grey.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_Grey.toRgbx(this1));
};
var thx_color_Hsl = {};
thx_color_Hsl.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_Hsl.toRgb = function(this1) {
	return thx_color_Rgbx.toRgb(thx_color_Hsl.toRgbx(this1));
};
thx_color_Hsl.toRgbx = function(this1) {
	var this2 = [thx_color_Hsl._c(this1[0] + 120,this1[1],this1[2]),thx_color_Hsl._c(this1[0],this1[1],this1[2]),thx_color_Hsl._c(this1[0] - 120,this1[1],this1[2])];
	return this2;
};
thx_color_Hsl.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_Hsl.toRgbx(this1));
};
thx_color_Hsl._c = function(d,s,l) {
	var m2 = l <= 0.5 ? l * (1 + s) : l + s - l * s;
	var m1 = 2 * l - m2;
	d = thx_Floats.wrapCircular(d,360);
	if(d < 60) {
		return m1 + (m2 - m1) * d / 60;
	} else if(d < 180) {
		return m2;
	} else if(d < 240) {
		return m1 + (m2 - m1) * (240 - d) / 60;
	} else {
		return m1;
	}
};
var thx_color_Hsla = {};
thx_color_Hsla.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,4);
	var this1 = [arr[0],arr[1],arr[2],arr[3]];
	return this1;
};
thx_color_Hsla.toRgbxa = function(this1) {
	var this2 = [thx_color_Hsl._c(this1[0] + 120,this1[1],this1[2]),thx_color_Hsl._c(this1[0],this1[1],this1[2]),thx_color_Hsl._c(this1[0] - 120,this1[1],this1[2]),this1[3]];
	return this2;
};
var thx_color_Hsv = {};
thx_color_Hsv.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_Hsv.toRgb = function(this1) {
	return thx_color_Rgbx.toRgb(thx_color_Hsv.toRgbx(this1));
};
thx_color_Hsv.toRgbx = function(this1) {
	if(this1[1] == 0) {
		var this2 = [this1[2],this1[2],this1[2]];
		return this2;
	}
	var r;
	var g;
	var b;
	var h = this1[0] / 60;
	var i = Math.floor(h);
	var f = h - i;
	var p = this1[2] * (1 - this1[1]);
	var q = this1[2] * (1 - f * this1[1]);
	var t = this1[2] * (1 - (1 - f) * this1[1]);
	switch(i) {
	case 0:
		r = this1[2];
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = this1[2];
		b = p;
		break;
	case 2:
		r = p;
		g = this1[2];
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = this1[2];
		break;
	case 4:
		r = t;
		g = p;
		b = this1[2];
		break;
	default:
		r = this1[2];
		g = p;
		b = q;
	}
	var this1 = [r,g,b];
	return this1;
};
thx_color_Hsv.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_Hsv.toRgbx(this1));
};
var thx_color_Hsva = {};
thx_color_Hsva.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,4);
	var this1 = [arr[0],arr[1],arr[2],arr[3]];
	return this1;
};
thx_color_Hsva.toRgbxa = function(this1) {
	if(this1[1] == 0) {
		var this2 = [this1[2],this1[2],this1[2],this1[3]];
		return this2;
	}
	var r;
	var g;
	var b;
	var h = this1[0] / 60;
	var i = Math.floor(h);
	var f = h - i;
	var p = this1[2] * (1 - this1[1]);
	var q = this1[2] * (1 - f * this1[1]);
	var t = this1[2] * (1 - (1 - f) * this1[1]);
	switch(i) {
	case 0:
		r = this1[2];
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = this1[2];
		b = p;
		break;
	case 2:
		r = p;
		g = this1[2];
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = this1[2];
		break;
	case 4:
		r = t;
		g = p;
		b = this1[2];
		break;
	default:
		r = this1[2];
		g = p;
		b = q;
	}
	var this2 = [r,g,b,this1[3]];
	return this2;
};
var thx_color_HunterLab = {};
thx_color_HunterLab.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_HunterLab.toRgbx = function(this1) {
	return thx_color_Xyz.toRgbx(thx_color_HunterLab.toXyz(this1));
};
thx_color_HunterLab.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_HunterLab.toRgbx(this1));
};
thx_color_HunterLab.toXyz = function(this1) {
	var x = this1[1] / 17.5 * (this1[0] / 10.0);
	var l10 = this1[0] / 10.0;
	var y = l10 * l10;
	var z = this1[2] / 7.0 * (this1[0] / 10.0);
	var this1 = [(x + y) / 1.02,y,-(z - y) / 0.847];
	return this1;
};
var thx_color_LCh = {};
thx_color_LCh.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_LCh.toLab = function(this1) {
	var hradi = this1[2] * (Math.PI / 180);
	var a = Math.cos(hradi) * this1[1];
	var b = Math.sin(hradi) * this1[1];
	var this2 = [this1[0],a,b];
	return this2;
};
thx_color_LCh.toRgbx = function(this1) {
	return thx_color_Lab.toRgbx(thx_color_LCh.toLab(this1));
};
thx_color_LCh.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_LCh.toRgbx(this1));
};
var thx_color_Lab = {};
thx_color_Lab.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_Lab.toRgbx = function(this1) {
	return thx_color_Xyz.toRgbx(thx_color_Lab.toXyz(this1));
};
thx_color_Lab.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_Lab.toRgbx(this1));
};
thx_color_Lab.toXyz = function(this1) {
	var f = function(t) {
		if(t > 0.20689655172413793) {
			return Math.pow(t,3);
		} else {
			return 0.12841854934601665 * (t - 0.13793103448275862);
		}
	};
	var x = thx_color_Xyz.whiteReference[0] * f(0.0086206896551724137 * (this1[0] + 16) + 0.002 * this1[1]);
	var y = thx_color_Xyz.whiteReference[1] * f(0.0086206896551724137 * (this1[0] + 16));
	var z = thx_color_Xyz.whiteReference[2] * f(0.0086206896551724137 * (this1[0] + 16) - 0.005 * this1[2]);
	var this1 = [x,y,z];
	return this1;
};
var thx_color_Luv = {};
thx_color_Luv.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_Luv.toRgbx = function(this1) {
	return thx_color_Xyz.toRgbx(thx_color_Luv.toXyz(this1));
};
thx_color_Luv.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_Luv.toRgbx(this1));
};
thx_color_Luv.toXyz = function(this1) {
	var l = this1[0] * 100;
	var u = this1[1] * 100;
	var v = this1[2] * 100;
	var x = 9 * u / (9 * u - 16 * v + 12);
	var y = 4 * v / (9 * u - 16 * v + 12);
	var uPrime = (l == 0 ? 0 : u / (13 * l)) + thx_color_Xyz.get_u(thx_color_Xyz.whiteReference) * 100;
	var vPrime = (l == 0 ? 0 : v / (13 * l)) + thx_color_Xyz.get_v(thx_color_Xyz.whiteReference) * 100;
	var Y = l > 8 ? thx_color_Xyz.whiteReference[1] * 100 * Math.pow((l + 16) / 116,3) : thx_color_Xyz.whiteReference[1] * 100 * l * Math.pow(0.10344827586206896,3);
	var X = Y * 9 * uPrime / (4 * vPrime);
	var Z = Y * (12 - 3 * uPrime - 20 * vPrime) / (4 * vPrime);
	var this1 = [X / 100,Y / 100,Z / 100];
	return this1;
};
var thx_color_Rgb = {};
thx_color_Rgb.toString = function(this1) {
	return thx_color_Rgb.toHex(this1);
};
thx_color_Rgb.toHex = function(this1,prefix) {
	if(prefix == null) {
		prefix = "#";
	}
	return "" + prefix + StringTools.hex(thx_color_Rgb.get_red(this1),2) + StringTools.hex(thx_color_Rgb.get_green(this1),2) + StringTools.hex(thx_color_Rgb.get_blue(this1),2);
};
thx_color_Rgb.toHsv = function(this1) {
	return thx_color_Rgbx.toHsv(thx_color_Rgb.toRgbx(this1));
};
thx_color_Rgb.toRgbx = function(this1) {
	return thx_color_Rgbx.fromInts([thx_color_Rgb.get_red(this1),thx_color_Rgb.get_green(this1),thx_color_Rgb.get_blue(this1)]);
};
thx_color_Rgb.toInt = function(this1) {
	return this1;
};
thx_color_Rgb.get_red = function(this1) {
	return this1 >> 16 & 255;
};
thx_color_Rgb.get_green = function(this1) {
	return this1 >> 8 & 255;
};
thx_color_Rgb.get_blue = function(this1) {
	return this1 & 255;
};
var thx_color_Rgbx = {};
thx_color_Rgbx.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_Rgbx.fromInts = function(arr) {
	arr = thx_ArrayInts.resized(arr,3);
	var this1 = [arr[0] / 255.0,arr[1] / 255.0,arr[2] / 255.0];
	return this1;
};
thx_color_Rgbx.withAlpha = function(this1,alpha) {
	var this2 = this1.concat([alpha]);
	return this2;
};
thx_color_Rgbx.toHsv = function(this1) {
	var min = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	var max = Math.max(Math.max(this1[0],this1[1]),this1[2]);
	var delta = max - min;
	var h;
	var s;
	var v = max;
	if(delta != 0) {
		s = delta / max;
	} else {
		s = 0;
		h = -1;
		var this2 = [h,s,v];
		return this2;
	}
	if(this1[0] == max) {
		h = (this1[1] - this1[2]) / delta;
	} else if(this1[1] == max) {
		h = 2 + (this1[2] - this1[0]) / delta;
	} else {
		h = 4 + (this1[0] - this1[1]) / delta;
	}
	h *= 60;
	if(h < 0) {
		h += 360;
	}
	var this1 = [h,s,v];
	return this1;
};
thx_color_Rgbx.toRgb = function(this1) {
	var this2 = (Math.round(this1[0] * 255) & 255) << 16 | (Math.round(this1[1] * 255) & 255) << 8 | Math.round(this1[2] * 255) & 255;
	return this2;
};
thx_color_Rgbx.toRgbxa = function(this1) {
	return thx_color_Rgbx.withAlpha(this1,1.0);
};
var thx_color_Rgbxa = {};
thx_color_Rgbxa.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,4);
	var this1 = [arr[0],arr[1],arr[2],arr[3]];
	return this1;
};
thx_color_Rgbxa.toRgb = function(this1) {
	return thx_color_Rgbx.toRgb(thx_color_Rgbxa.toRgbx(this1));
};
thx_color_Rgbxa.toRgbx = function(this1) {
	var this2 = this1.slice(0,3);
	return this2;
};
var thx_color_Xyz = {};
thx_color_Xyz.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_Xyz.toRgbx = function(this1) {
	var x = this1[0];
	var y = this1[1];
	var z = this1[2];
	var r = x * 3.2406 + y * -1.5372 + z * -0.4986;
	var g = x * -0.9689 + y * 1.8758 + z * 0.0415;
	var b = x * 0.0557 + y * -0.2040 + z * 1.0570;
	r = r > 0.0031308 ? 1.055 * Math.pow(r,0.41666666666666669) - 0.055 : 12.92 * r;
	g = g > 0.0031308 ? 1.055 * Math.pow(g,0.41666666666666669) - 0.055 : 12.92 * g;
	b = b > 0.0031308 ? 1.055 * Math.pow(b,0.41666666666666669) - 0.055 : 12.92 * b;
	var this1 = [r,g,b];
	return this1;
};
thx_color_Xyz.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_Xyz.toRgbx(this1));
};
thx_color_Xyz.get_u = function(this1) {
	try {
		return 4 * this1[0] / (this1[0] + 15 * this1[1] + 3 * this1[2]);
	} catch( _g ) {
		return 0;
	}
};
thx_color_Xyz.get_v = function(this1) {
	try {
		return 9 * this1[1] / (this1[0] + 15 * this1[1] + 3 * this1[2]);
	} catch( _g ) {
		return 0;
	}
};
var thx_color_Yuv = {};
thx_color_Yuv.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_Yuv.toRgbx = function(this1) {
	var r = this1[0] + 1.139837398373983740 * this1[2];
	var g = this1[0] - 0.3946517043589703515 * this1[1] - 0.5805986066674976801 * this1[2];
	var b = this1[0] + 2.032110091743119266 * this1[1];
	var this1 = [r,g,b];
	return this1;
};
thx_color_Yuv.toRgbxa = function(this1) {
	return thx_color_Rgbx.toRgbxa(thx_color_Yuv.toRgbx(this1));
};
var thx_color_Yxy = {};
thx_color_Yxy.fromFloats = function(arr) {
	arr = thx_ArrayFloats.resized(arr,3);
	var this1 = [arr[0],arr[1],arr[2]];
	return this1;
};
thx_color_Yxy.toRgbxa = function(this1) {
	return thx_color_Xyz.toRgbxa(thx_color_Yxy.toXyz(this1));
};
thx_color_Yxy.toXyz = function(this1) {
	var this2 = [this1[1] * (this1[0] / this1[2]),this1[0],(1 - this1[1] - this1[2]) * (this1[0] / this1[2])];
	return this2;
};
