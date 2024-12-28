var common_LocalizeLoader = $hxClasses["common.LocalizeLoader"] = function() { };
common_LocalizeLoader.__name__ = "common.LocalizeLoader";
common_LocalizeLoader.load = function(langName,then) {
	var loader = new PIXI.Loader();
	var cacheBust = "?cache=" + "20241021113840";
	loader.add("" + ("lang_" + langName + ".csv") + cacheBust);
	loader.use(function(res,next) {
		if(res.error) {
			if(Object.prototype.hasOwnProperty.call(common_LocalizeLoader.additionalLocalizations.h,langName)) {
				then(true,common_LocalizeLoader.processLangFile("",langName));
				next();
				return;
			}
			then(false,null);
			return;
		}
		then(true,common_LocalizeLoader.processLangFile(res.data,langName));
		next();
	});
	loader.load(function() {
		return;
	});
};
common_LocalizeLoader.processLangFile = function(langFile,langName) {
	var theseLocalizations = new haxe_ds_StringMap();
	if(Object.prototype.hasOwnProperty.call(common_LocalizeLoader.additionalLocalizations.h,langName)) {
		langFile += "\n" + common_LocalizeLoader.additionalLocalizations.h[langName];
	}
	langFile = StringTools.replace(langFile,"\r\n","\n");
	var splitFile = langFile.split("\n");
	var _g = 0;
	var _g1 = splitFile.length;
	while(_g < _g1) {
		var i = _g++;
		var str = splitFile[i];
		var colonPos = str.indexOf("|");
		var key = str.substring(0,colonPos);
		var val = HxOverrides.substr(str,colonPos + 1,null);
		theseLocalizations.h[key] = val;
	}
	return theseLocalizations;
};
