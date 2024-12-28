var common_ColorExtensions = $hxClasses["common.ColorExtensions"] = function() { };
common_ColorExtensions.__name__ = "common.ColorExtensions";
common_ColorExtensions.toHexInt = function(col) {
	return thx_color_Rgb.get_red(col) * 65536 + thx_color_Rgb.get_green(col) * 256 + thx_color_Rgb.get_blue(col);
};
common_ColorExtensions.parse = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) {
		info = thx_color_parse_ColorParser.parseColor(color);
	}
	if(null == info) {
		return null;
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
