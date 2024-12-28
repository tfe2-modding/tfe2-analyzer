var common_StringExtensions = $hxClasses["common.StringExtensions"] = function() { };
common_StringExtensions.__name__ = "common.StringExtensions";
common_StringExtensions.firstToUpper = function(str) {
	if(str.length == 0) {
		return str;
	}
	return str.charAt(0).toUpperCase() + HxOverrides.substr(str,1,null);
};
