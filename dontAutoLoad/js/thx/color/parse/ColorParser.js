var thx_color_parse_ColorParser = $hxClasses["thx.color.parse.ColorParser"] = function() {
	this.pattern_color = new EReg("^\\s*([^(]+)\\s*\\(([^)]*)\\)\\s*$","i");
	this.pattern_channel = new EReg("^\\s*(-?\\d*.\\d+|-?\\d+)(%|deg|rad)?\\s*$","i");
};
thx_color_parse_ColorParser.__name__ = "thx.color.parse.ColorParser";
thx_color_parse_ColorParser.parseColor = function(s) {
	return thx_color_parse_ColorParser.parser.processColor(s);
};
thx_color_parse_ColorParser.parseHex = function(s) {
	return thx_color_parse_ColorParser.parser.processHex(s);
};
thx_color_parse_ColorParser.getFloatChannels = function(channels,length,useInt8) {
	if(length != channels.length) {
		throw haxe_Exception.thrown("invalid number of channels, expected " + length + " but it is " + channels.length);
	}
	var useInt81 = useInt8;
	var f = function(channel) {
		return thx_color_parse_ColorParser.getFloatChannel(channel,useInt81);
	};
	var result = new Array(channels.length);
	var _g = 0;
	var _g1 = channels.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = f(channels[i]);
	}
	return result;
};
thx_color_parse_ColorParser.getFloatChannel = function(channel,useInt8) {
	if(useInt8 == null) {
		useInt8 = true;
	}
	switch(channel._hx_index) {
	case 0:
		var v = channel.value;
		return v / 100;
	case 1:
		var v = channel.value;
		return v;
	case 2:
		var v = channel.value;
		return v;
	case 3:
		var _g = channel.value;
		var v = _g;
		if(useInt8) {
			return v / 255;
		} else {
			var v = _g;
			return v;
		}
		break;
	case 4:
		var v = channel.value;
		return v;
	case 5:
		var v = channel.value;
		if(v) {
			return 1;
		} else {
			return 0;
		}
		break;
	}
};
thx_color_parse_ColorParser.prototype = {
	processHex: function(s) {
		if(!thx_color_parse_ColorParser.isPureHex.match(s)) {
			if(HxOverrides.substr(s,0,1) == "#") {
				if(s.length == 4) {
					s = s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2) + s.charAt(3) + s.charAt(3);
				} else if(s.length == 5) {
					s = s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2) + s.charAt(3) + s.charAt(3) + s.charAt(4) + s.charAt(4);
				} else {
					s = HxOverrides.substr(s,1,null);
				}
			} else if(HxOverrides.substr(s,0,2) == "0x") {
				s = HxOverrides.substr(s,2,null);
			} else {
				return null;
			}
		}
		var channels = [];
		while(s.length > 0) {
			channels.push(thx_color_parse_ChannelInfo.CIInt8(Std.parseInt("0x" + HxOverrides.substr(s,0,2))));
			s = HxOverrides.substr(s,2,null);
		}
		if(channels.length == 4) {
			var channels1 = channels[0];
			return new thx_color_parse_ColorInfo("rgba",channels.slice(1).concat([channels1]));
		} else {
			return new thx_color_parse_ColorInfo("rgb",channels);
		}
	}
	,processColor: function(s) {
		if(!this.pattern_color.match(s)) {
			return null;
		}
		var name = this.pattern_color.matched(1);
		if(null == name) {
			return null;
		}
		name = name.toLowerCase();
		var m2 = this.pattern_color.matched(2);
		var s_channels = null == m2 ? [] : m2.split(",");
		var channels = [];
		var channel;
		var _g = 0;
		while(_g < s_channels.length) {
			var s_channel = s_channels[_g];
			++_g;
			channel = this.processChannel(s_channel);
			if(null == channel) {
				return null;
			}
			channels.push(channel);
		}
		return new thx_color_parse_ColorInfo(name,channels);
	}
	,processChannel: function(s) {
		if(!this.pattern_channel.match(s)) {
			return null;
		}
		var value = this.pattern_channel.matched(1);
		var unit = this.pattern_channel.matched(2);
		if(unit == null) {
			unit = "";
		}
		try {
			switch(unit) {
			case "":
				if(value == "" + thx_Ints.parse(value)) {
					var i = thx_Ints.parse(value);
					if(i == 0) {
						return thx_color_parse_ChannelInfo.CIBool(false);
					} else if(i == 1) {
						return thx_color_parse_ChannelInfo.CIBool(true);
					} else if(i < 256) {
						return thx_color_parse_ChannelInfo.CIInt8(i);
					} else {
						return thx_color_parse_ChannelInfo.CIInt(i);
					}
				} else if(thx_Floats.canParse(value)) {
					return thx_color_parse_ChannelInfo.CIFloat(thx_Floats.parse(value));
				} else {
					return null;
				}
				break;
			case "%":
				if(thx_Floats.canParse(value)) {
					return thx_color_parse_ChannelInfo.CIPercent(thx_Floats.parse(value));
				} else {
					return null;
				}
				break;
			case "DEG":case "deg":
				if(thx_Floats.canParse(value)) {
					return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value));
				} else {
					return null;
				}
				break;
			case "RAD":case "rad":
				if(thx_Floats.canParse(value)) {
					return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value) * 180 / Math.PI);
				} else {
					return null;
				}
				break;
			default:
				return null;
			}
		} catch( _g ) {
			return null;
		}
	}
	,__class__: thx_color_parse_ColorParser
};
