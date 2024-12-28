var modding_SingleModLoader = $hxClasses["modding.SingleModLoader"] = function() {
	this.reverseJSLoadOrder = false;
	this.priority = 0;
};
modding_SingleModLoader.__name__ = "modding.SingleModLoader";
modding_SingleModLoader.prototype = {
	doPreload: function(files,then) {
		var _gthis = this;
		if(files == null) {
			then();
		}
		var modInfoFile = Lambda.find(files,function(fi) {
			return StringTools.endsWith(fi,"modInfo.json");
		});
		if(modInfoFile != null) {
			var preloader = new PIXI.Loader();
			preloader.use(function(res,next) {
				if(res.error) {
					console.log("FloatingSpaceCities/modding/ModLoader.hx:36:",res);
					console.log("FloatingSpaceCities/modding/ModLoader.hx:37:",res.error);
					var v = common_Localize.lo("mod_resource_not_loaded") + " " + common_Localize.lo("technical_details") + "\n" + Std.string(res.error);
					window.alert(Std.string(v));
					return;
				}
				if(StringTools.endsWith(res.name,"modInfo.json")) {
					var modInfo = res.data;
					if(modInfo.loadPriority != null) {
						_gthis.priority = modInfo.loadPriority;
					}
					if(modInfo.name != null && modInfo.name == "Liquid") {
						_gthis.reverseJSLoadOrder = true;
					}
					if(modInfo.reverseJSLoadOrder != null) {
						_gthis.reverseJSLoadOrder = modInfo.reverseJSLoadOrder;
					}
				}
				next();
			});
			preloader.add(modInfoFile);
			preloader.load(then);
		} else {
			then();
		}
	}
	,load: function(callback) {
	}
	,__class__: modding_SingleModLoader
};
