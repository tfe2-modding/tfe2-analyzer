var Resources = $hxClasses["Resources"] = function() { };
Resources.__name__ = "Resources";
Resources.getTextures = function(name,number,striped,rows) {
	if(rows == null) {
		rows = 1;
	}
	if(striped == null) {
		striped = false;
	}
	var cacheName = name + "%num%" + number;
	if(striped) {
		cacheName += "%s%";
	}
	if(rows != 1) {
		cacheName += "%r%" + rows;
	}
	if(Object.prototype.hasOwnProperty.call(Resources.multiTextureCache.h,cacheName)) {
		return Resources.multiTextureCache.h[cacheName];
	}
	var textures = [];
	var _g = 0;
	var _g1 = rows;
	while(_g < _g1) {
		var j = _g++;
		var _g2 = 0;
		var _g3 = number;
		while(_g2 < _g3) {
			var i = _g2++;
			var tex = PIXI.Texture.from("" + name + ".png").clone();
			var w = ((tex.frame.width + 2 | 0) / number | 0) - (striped ? 1 : 2);
			tex.frame = new PIXI.Rectangle(tex.frame.x + (w + (striped ? 1 : 2)) * i - (striped && i % 2 == 1 ? 1 : 0),tex.frame.y + ((tex.frame.height - 2 * (rows - 1)) / rows + 2) * j,w,(tex.frame.height - 2 * (rows - 1)) / rows);
			textures.push(tex);
		}
	}
	Resources.multiTextureCache.h[cacheName] = textures;
	return textures;
};
Resources.getTexturesByWidth = function(name,width,striped) {
	if(striped == null) {
		striped = false;
	}
	var cacheName = name + "%width%" + width;
	if(striped) {
		cacheName += "%s%";
	}
	if(Object.prototype.hasOwnProperty.call(Resources.multiTextureCache.h,cacheName)) {
		return Resources.multiTextureCache.h[cacheName];
	}
	var textures = Resources.getTextures(name,(PIXI.Texture.from("" + name + ".png").width + 2) / (width + (striped ? 1 : 2)) | 0,striped);
	Resources.multiTextureCache.h[cacheName] = textures;
	return textures;
};
Resources.getTexturesAsGrid = function(name,numberW,numberH,marginX,striped) {
	if(striped == null) {
		striped = false;
	}
	if(marginX == null) {
		marginX = 0;
	}
	var cacheName = name + "%numW%" + numberW + "%numH%" + numberH;
	if(striped) {
		cacheName += "%s%";
	}
	if(Object.prototype.hasOwnProperty.call(Resources.multiTextureCache2.h,cacheName)) {
		return Resources.multiTextureCache2.h[cacheName];
	}
	var textures = [];
	var _g = 0;
	var _g1 = numberW;
	while(_g < _g1) {
		var i = _g++;
		textures[i] = [];
		var _g2 = 0;
		var _g3 = numberH;
		while(_g2 < _g3) {
			var j = _g2++;
			var tex = PIXI.Texture.from("" + name + ".png").clone();
			var w = ((tex.frame.width + 2 | 0) / numberW | 0) - (striped ? 1 : marginX);
			var h = (tex.frame.height | 0) / numberH | 0;
			tex.frame = new PIXI.Rectangle(tex.frame.x + (w + (striped ? 1 : marginX)) * i - (striped && i % 2 == 1 ? 1 : 0),tex.frame.y + h * j,w,h);
			textures[i].push(tex);
		}
	}
	Resources.multiTextureCache2.h[cacheName] = textures;
	return textures;
};
Resources.getTexturesBySize = function(name,width,height,marginX,striped) {
	if(striped == null) {
		striped = false;
	}
	if(marginX == null) {
		marginX = 0;
	}
	var cacheName = name + "%width%" + width + "%height%" + height;
	if(striped) {
		cacheName += "%s%";
	}
	if(Object.prototype.hasOwnProperty.call(Resources.multiTextureCache2.h,cacheName)) {
		return Resources.multiTextureCache2.h[cacheName];
	}
	var textures = Resources.getTexturesAsGrid(name,(PIXI.Texture.from("" + name + ".png").width + marginX) / (width + (striped ? 1 : marginX)) | 0,PIXI.Texture.from("" + name + ".png").height / height | 0,null,striped);
	Resources.multiTextureCache2.h[cacheName] = textures;
	return textures;
};
Resources.getTexturesAsGridInverse = function(name,numberW,numberH,marginX,striped) {
	if(striped == null) {
		striped = false;
	}
	if(marginX == null) {
		marginX = 0;
	}
	var cacheName = name + "%numW%" + numberW + "%numH%" + numberH + "%INV";
	if(striped) {
		cacheName += "%s%";
	}
	if(Object.prototype.hasOwnProperty.call(Resources.multiTextureCache2.h,cacheName)) {
		return Resources.multiTextureCache2.h[cacheName];
	}
	var textures = [];
	var _g = 0;
	var _g1 = numberH;
	while(_g < _g1) {
		var j = _g++;
		textures[j] = [];
		var _g2 = 0;
		var _g3 = numberW;
		while(_g2 < _g3) {
			var i = _g2++;
			var tex = PIXI.Texture.from("" + name + ".png").clone();
			var w = ((tex.frame.width + 2 | 0) / numberW | 0) - (striped ? 1 : marginX);
			var h = (tex.frame.height | 0) / numberH | 0;
			tex.frame = new PIXI.Rectangle(tex.frame.x + (w + (striped ? 1 : marginX)) * i - (striped && i % 2 == 1 ? 1 : 0),tex.frame.y + h * j,w,h);
			textures[j].push(tex);
		}
	}
	Resources.multiTextureCache2.h[cacheName] = textures;
	return textures;
};
Resources.getTexturesBySizeInverse = function(name,width,height,marginX,striped) {
	if(striped == null) {
		striped = false;
	}
	if(marginX == null) {
		marginX = 0;
	}
	var cacheName = name + "%width%" + width + "%height%" + height + "%INV";
	if(striped) {
		cacheName += "%s%";
	}
	if(Object.prototype.hasOwnProperty.call(Resources.multiTextureCache2.h,cacheName)) {
		return Resources.multiTextureCache2.h[cacheName];
	}
	var textures = Resources.getTexturesAsGridInverse(name,(PIXI.Texture.from("" + name + ".png").width + marginX) / (width + (striped ? 1 : marginX)) | 0,PIXI.Texture.from("" + name + ".png").height / height | 0,marginX,striped);
	Resources.multiTextureCache2.h[cacheName] = textures;
	return textures;
};
Resources.getTexture = function(name,part) {
	var cacheName = part != null ? "" + name + "@" + part.x + "," + part.y + "," + part.width + "," + part.height : name;
	if(Object.prototype.hasOwnProperty.call(Resources.singleTextureCache.h,cacheName)) {
		return Resources.singleTextureCache.h[cacheName];
	}
	if(part == null && name.indexOf("@") != -1) {
		var splitName = name.split("@");
		name = splitName[0];
		var partString = splitName[1];
		var _this = partString.split(",");
		var result = new Array(_this.length);
		var _g = 0;
		var _g1 = _this.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = Std.parseInt(_this[i]);
		}
		var splitParts = result;
		part = new common_Rectangle(splitParts[0],splitParts[1],splitParts[2],splitParts[3]);
	}
	var tex = PIXI.Texture.from("" + name + ".png").clone();
	if(part != null) {
		tex.frame = new PIXI.Rectangle(tex.frame.x + part.x,tex.frame.y + part.y,part.width,part.height);
	}
	Resources.singleTextureCache.h[cacheName] = tex;
	return tex;
};
Resources.makeSprite = function(textureName,part) {
	return new PIXI.Sprite(Resources.getTexture(textureName,part));
};
Resources.initializeCityResources = function(cr) {
	cr.buildingInfoArray = [];
	var _g = 0;
	var _g1 = Resources.buildingInfoArray;
	while(_g < _g1.length) {
		var bi = _g1[_g];
		++_g;
		cr.buildingInfoArray.push(Reflect.copy(bi));
	}
	cr.buildingInfo = new haxe_ds_StringMap();
	var _g = 0;
	var _g1 = cr.buildingInfoArray;
	while(_g < _g1.length) {
		var building = _g1[_g];
		++_g;
		cr.buildingInfo.h["buildings." + building.className] = building;
	}
};
