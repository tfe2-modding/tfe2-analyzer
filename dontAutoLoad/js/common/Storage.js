var common_Storage = $hxClasses["common.Storage"] = function() { };
common_Storage.__name__ = "common.Storage";
common_Storage.testSupport = function(ifSupported,ifUnsupported) {
	if(common_Storage.knowsSupport && !common_Storage.hasSupport) {
		ifUnsupported();
		return;
	}
	if(common_Storage.knowsSupport && common_Storage.hasSupport) {
		ifSupported();
		return;
	}
	try {
		nodestorage.ready().then(function() {
			common_Storage.hasSupport = true;
			common_Storage.knowsSupport = true;
			ifSupported();
		}).catch(function() {
			common_Storage.hasSupport = false;
			common_Storage.knowsSupport = true;
			common_Storage.storageReplacement = new haxe_ds_StringMap();
			ifUnsupported();
		});
	} catch( _g ) {
		common_Storage.knowsSupport = true;
		common_Storage.hasSupport = true;
		ifSupported();
	}
};
common_Storage.getItem = function(key,onSuccess,returnBuffer) {
	if(returnBuffer == null) {
		returnBuffer = false;
	}
	if(common_Storage.hasSupport) {
		if(returnBuffer) {
			return nodestorage.getItemBuffer(key,onSuccess);
		} else {
			return nodestorage.getItemParsed(key,onSuccess);
		}
	}
	common_Storage.testSupport(function() {
		if((returnBuffer ? nodestorage.getItemBuffer(key,onSuccess) : nodestorage.getItemParsed(key,onSuccess)) == null) {
			onSuccess("error",null);
		}
	},function() {
		if(!Object.prototype.hasOwnProperty.call(common_Storage.storageReplacement.h,key)) {
			onSuccess("error",null);
		} else {
			onSuccess(null,common_Storage.storageReplacement.h[key]);
		}
	});
	return -1;
};
common_Storage.setItem = function(key,value,onSuccess) {
	common_Storage.testSupport(function() {
		nodestorage.setItem(key,value,onSuccess);
	},function() {
		common_Storage.storageReplacement.h[key] = value;
		onSuccess();
	});
};
common_Storage.storageSupported = function() {
	if(common_Storage.knowsSupport) {
		return common_Storage.hasSupport;
	} else {
		return true;
	}
};
