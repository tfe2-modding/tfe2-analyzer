var gamesave_GameSaveHelper = $hxClasses["gamesave.GameSaveHelper"] = function() { };
gamesave_GameSaveHelper.__name__ = "gamesave.GameSaveHelper";
gamesave_GameSaveHelper.makeLoadMap = function(definition,queue) {
	var loadMap = new haxe_ds_StringMap();
	var _g = 0;
	var _g1 = definition.split("|");
	while(_g < _g1.length) {
		var varAndType = _g1[_g];
		++_g;
		if(varAndType == "") {
			continue;
		}
		var varAndTypeArray = varAndType.split("$");
		var res;
		var _g2 = varAndTypeArray[1];
		switch(_g2) {
		case "Bool":
			if(queue.version < 29) {
				var intToRead = queue.bytes.getInt32(queue.readStart);
				queue.readStart += 4;
				res = intToRead == 1 && true;
			} else {
				var byteToRead = queue.bytes.b[queue.readStart];
				queue.readStart += 1;
				res = byteToRead > 0;
			}
			break;
		case "FPoint":
			res = queue.readFPoint();
			break;
		case "Float":
			var floatToRead = queue.bytes.getDouble(queue.readStart);
			queue.readStart += 8;
			res = floatToRead;
			break;
		case "Int":
			var intToRead1 = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			res = intToRead1;
			break;
		case "LifeAction":
			var la = queue.readString();
			switch(la) {
			case "Nothing":
				res = 2;
				break;
			case "School":
				res = 1;
				break;
			case "Work":
				res = 0;
				break;
			default:
				res = 2;
			}
			break;
		case "Point":
			res = queue.readPoint();
			break;
		case "Rectangle":
			res = queue.readRectangle();
			break;
		case "String":
			res = queue.readString();
			break;
		case "buildings.FarmStage":
			var fs = queue.readString();
			switch(fs) {
			case "Cleaning":
				res = 2;
				break;
			case "Growing":
				res = 0;
				break;
			case "Harvesting":
				res = 1;
				break;
			default:
				res = 2;
			}
			break;
		case "ds":
			res = haxe_Unserializer.run(queue.readString());
			break;
		default:
			var typeName = _g2;
			var resolvedEnum = $hxEnums[typeName];
			if(resolvedEnum != null) {
				res = Type.createEnum(resolvedEnum,queue.readString());
			} else {
				throw haxe_Exception.thrown("That type isn't supported while loading the game!");
			}
		}
		loadMap.h[varAndTypeArray[0]] = res;
	}
	ModTools.currentLoadMap = loadMap;
	return loadMap;
};
