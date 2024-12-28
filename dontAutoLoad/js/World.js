var World = $hxClasses["World"] = function(game,city,stage,midStage,bgStage,rect,seed,appearance) {
	this.id = 0;
	this.tempId = 0;
	this.appearance = null;
	this.isProtectedKey = false;
	this.isUnbuildableFromAliens = false;
	this.hasTeleporterOnGroup = false;
	this.stresstest = false;
	this.knownResourceInavailabilityLastResetDay = 0;
	this.relevantWorldsForDirectCityConnectionsCache = null;
	this.surfaceShardId = -1;
	this.worldGroup = null;
	this.game = game;
	this.city = city;
	this.rect = rect;
	this.stage = stage;
	this.midStage = midStage;
	this.bgStage = bgStage;
	this.seed = seed;
	this.worldGlow = null;
	this.appearance = appearance;
	var random = new random_SeedeableRandom(seed);
	if(seed == null) {
		this.seed = random.seed;
	}
	if(rect.height != 0) {
		var worldSpriteAndMask = graphics_WorldImage.makeWorldSprite(random,rect.width,rect.height,appearance);
		this.worldSprite = worldSpriteAndMask.sprite;
		this.mask = worldSpriteAndMask.mask;
		this.worldSprite.position.set(rect.x,rect.y);
		stage.cacheableChildren.push(this.worldSprite);
		stage.isInvalid = true;
	} else {
		this.worldSprite = null;
	}
	var numberOfHCells = Math.ceil(rect.width / 20);
	var _g = [];
	var _g1 = 0;
	var _g2 = numberOfHCells;
	while(_g1 < _g2) {
		var _ = _g1++;
		_g.push([]);
	}
	this.permanents = _g;
	var _g = [];
	var _g1 = 0;
	var _g2 = numberOfHCells;
	while(_g1 < _g2) {
		var _ = _g1++;
		_g.push(null);
	}
	this.decorations = _g;
	if(!Game.isLoading && rect.height != 0 && appearance != "snow") {
		var _g = 0;
		var _g1 = numberOfHCells;
		while(_g < _g1) {
			var x = _g++;
			this.setDecoration("spr_grass",x);
		}
	}
	this.reachableWorlds = [];
	this.knownResourceInavailability = new haxe_ds_StringMap();
	if(city.worlds.length == 0) {
		this.id = 0;
	} else {
		this.id = common_ArrayExtensions.max(city.worlds,function(w) {
			return w.id;
		}).id + 1;
	}
};
World.__name__ = "World";
World.fromLoad = function(queue,game,city,stage,midStage,bgStage) {
	var rect = queue.readRectangle();
	if(queue.version < 56) {
		rect.y = Math.ceil(rect.y / 20) * 20;
	}
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var seed = intToRead;
	var appearance = "";
	if(queue.version >= 41) {
		appearance = queue.readString();
	}
	var thisWorld = new World(game,city,stage,midStage,bgStage,rect,seed,appearance);
	var xPos = 0;
	var _g = 0;
	var _g1 = thisWorld.permanents;
	while(_g < _g1.length) {
		var permanentStack = _g1[_g];
		++_g;
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var stackSize = intToRead;
		var _g2 = 0;
		var _g3 = stackSize;
		while(_g2 < _g3) {
			var i = _g2++;
			var intToRead1 = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var firstInt = intToRead1;
			if(firstInt == 2) {
				permanentStack.push(null);
			} else {
				var isBuilding = firstInt == 1;
				var intToRead2 = queue.bytes.getInt32(queue.readStart);
				queue.readStart += 4;
				var permanentID = intToRead2;
				var typeString = queue.readString();
				var typeClass = $hxClasses[typeString];
				var worldPos = new common_Point(xPos,i);
				var pos = new common_Point(rect.x + 20 * xPos,rect.y - 20 * (1 + i));
				var inst = typeClass == null ? new buildings_UnknownBuilding(game,stage,bgStage,city,thisWorld,pos,worldPos,permanentID) : isBuilding ? Type.createInstance(typeClass,[game,stage,bgStage,city,thisWorld,pos,worldPos,permanentID]) : Type.createInstance(typeClass,[game,permanentID,city,thisWorld,pos,worldPos,stage]);
				permanentStack.push(inst);
				inst.load(queue);
			}
		}
		if(stackSize == 0 || queue.version >= 55 && permanentStack[0] == null) {
			var decorationName = queue.readString();
			if(decorationName != "") {
				var intToRead3 = queue.bytes.getInt32(queue.readStart);
				queue.readStart += 4;
				var subImage = intToRead3;
				thisWorld.setDecoration(decorationName,xPos,subImage);
			}
		}
		++xPos;
	}
	if(queue.version >= 27) {
		var byteToRead = queue.bytes.b[queue.readStart];
		queue.readStart += 1;
		thisWorld.isUnbuildableFromAliens = byteToRead == 1;
		if(thisWorld.isUnbuildableFromAliens) {
			thisWorld.setUnbuildableAliens();
		}
	}
	if(queue.version >= 42) {
		var byteToRead = queue.bytes.b[queue.readStart];
		queue.readStart += 1;
		thisWorld.isProtectedKey = byteToRead > 0;
	}
	if(queue.version >= 44) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		thisWorld.id = intToRead;
	}
	return thisWorld;
};
World.prototype = {
	update: function(timeMod) {
		if(this.knownResourceInavailabilityLastResetDay != 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0)) {
			this.knownResourceInavailability = new haxe_ds_StringMap();
			this.knownResourceInavailabilityLastResetDay = 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0);
		}
		if(!this.isUnbuildableFromAliens && this.worldGlow != null) {
			this.worldGlow.alpha -= 0.1 * timeMod;
			if(this.worldGlow.alpha <= 0) {
				this.worldGlow.destroy();
				this.worldGlow = null;
			}
		}
	}
	,resizeInvisibleWorld: function(newX,newWidth) {
		if(this.rect.height != 0) {
			return;
		}
		if(this.rect.width > newWidth) {
			return;
		}
		var moveLeft = (this.rect.x - newX) / 20 | 0;
		this.rect.x = newX;
		this.rect.width = newWidth;
		var newPMWidth = newWidth / 20 | 0;
		var i = this.permanents.length - 1;
		var oldPermanentsLength = i + 1;
		this.permanents.length = newPMWidth;
		this.decorations.length = newPMWidth;
		while(i >= 0) {
			this.permanents[i + moveLeft] = this.permanents[i];
			var _g = 0;
			var _g1 = this.permanents[i + moveLeft];
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				if(pm != null) {
					pm.worldPosition.x = i + moveLeft;
				}
			}
			this.decorations[i + moveLeft] = this.decorations[i];
			--i;
		}
		var _g = 0;
		var _g1 = moveLeft;
		while(_g < _g1) {
			var i = _g++;
			this.permanents[i] = [];
			this.decorations[i] = null;
		}
		var _g = oldPermanentsLength + moveLeft;
		var _g1 = this.permanents.length;
		while(_g < _g1) {
			var i = _g++;
			this.permanents[i] = [];
			this.decorations[i] = null;
		}
	}
	,canBuildOnSurface: function() {
		if(this.isProtectedKey) {
			return false;
		}
		if(this.rect.height != 0) {
			return !this.isUnbuildableFromAliens;
		} else {
			return false;
		}
	}
	,canBuildOnNotSurface: function(isMachine) {
		if(this.isProtectedKey && !isMachine) {
			return false;
		}
		return true;
	}
	,onCannotBuild: function() {
		if(this.isUnbuildableFromAliens) {
			this.city.gui.showSimpleWindow(common_Localize.lo("building_prevented_strange_force"),null,true);
		}
		if(this.isProtectedKey) {
			this.city.gui.showSimpleWindow(common_Localize.lo("secret_society_forbidden"),null,true);
		}
	}
	,onCityChange: function() {
		this.knownResourceInavailability = new haxe_ds_StringMap();
	}
	,build: function(buildingType,xPos,insertAt) {
		if(insertAt == null || insertAt == 0) {
			this.removeDecoration(xPos);
		}
		var currLen = this.permanents[xPos].length;
		var yPos = insertAt == null ? currLen : insertAt;
		if(yPos > currLen) {
			var _g = 0;
			var _g1 = yPos - currLen;
			while(_g < _g1) {
				var i = _g++;
				this.permanents[xPos].push(null);
			}
		}
		var newBuilding = Type.createInstance(buildingType,[this.game,this.stage,this.bgStage,this.city,this,new common_Point(this.rect.x + 20 * xPos,this.rect.y - 20 * (1 + yPos)),new common_Point(xPos,yPos),this.city.maxPermanentID++]);
		if(yPos < this.permanents[xPos].length && this.permanents[xPos][yPos] == null) {
			this.permanents[xPos][yPos] = newBuilding;
		} else if(insertAt == null) {
			this.permanents[xPos].push(newBuilding);
		} else {
			this.permanents[xPos].splice(insertAt,0,newBuilding);
			var _g = yPos + 1;
			var _g1 = currLen + 1;
			while(_g < _g1) {
				var i = _g++;
				if(this.permanents[xPos][i] == null) {
					this.permanents[xPos].splice(i,1);
					break;
				}
			}
		}
		if(this.permanents[xPos].length >= 100) {
			var failed = false;
			var _g = 0;
			while(_g < 100) {
				var pm = _g++;
				if(this.permanents[xPos][pm] == null) {
					failed = true;
					break;
				}
			}
			if(!failed) {
				common_Achievements.achieve("BUILDING_HEIGHT");
			}
		}
		var _g = 0;
		var _g1 = this.city.miscCityElements.allMiscElements;
		while(_g < _g1.length) {
			var miscElement = _g1[_g];
			++_g;
			if(miscElement.is(miscCityElements_Bridge)) {
				var bridge = miscElement;
				if(bridge.position.x == newBuilding.position.x && bridge.position.y == newBuilding.position.y) {
					if(bridge.rect.x == bridge.position.x) {
						bridge.position.x += 20;
					} else {
						bridge.position.x -= 20;
					}
				}
			}
		}
		newBuilding.onBuild();
		return newBuilding;
	}
	,createWorldResource: function(resourceType,xPos) {
		this.removeDecoration(xPos);
		var newResource = Type.createInstance(resourceType,[this.game,this.city.maxPermanentID++,this.city,this,new common_Point(this.rect.x + 20 * xPos,this.rect.y - 20),new common_Point(xPos,0),this.stage]);
		this.permanents[xPos][0] = newResource;
		return newResource;
	}
	,setDecoration: function(textureName,xPos,image) {
		this.removeDecoration(xPos);
		if(this.permanents[xPos].length > 0 && this.permanents[xPos][0] != null) {
			return;
		}
		this.decorations[xPos] = new graphics_GroundDecoration(this.stage,new common_Point(this.rect.x + 20 * xPos,this.rect.y - 20),textureName,image);
	}
	,removeDecoration: function(xPos) {
		if(this.decorations[xPos] != null) {
			this.decorations[xPos].destroy();
			this.decorations[xPos] = null;
		}
	}
	,handleMouse: function(mouse) {
		var tmp;
		if(this.stresstest) {
			var _this = this.rect;
			var inlPoint_x = _this.x;
			var inlPoint_y = _this.y;
			tmp = inlPoint_x == 0;
		} else {
			tmp = false;
		}
		if(tmp) {
			this.stresstest = false;
			var _g = 0;
			while(_g < 1250) {
				var i = _g++;
				var i0 = random_Random.getInt(this.permanents.length);
				if(this.permanents[i0].length == 0 || this.permanents[i0][this.permanents[i0].length - 1].isBuilding) {
					this.build(buildings_NormalHouse,i0);
				}
				var i1 = random_Random.getInt(this.permanents.length);
				if(this.permanents[i1].length == 0 || this.permanents[i1][this.permanents[i1].length - 1].isBuilding) {
					this.build(buildings_IndoorFarm,i1);
				}
			}
			this.city.connections.updateCityConnections();
			this.city.simulation.updatePathfinder(false);
		}
		if(mouse.get_cityX() >= this.rect.x && mouse.get_cityX() < this.rect.x + this.rect.width && mouse.get_cityY() < this.rect.y) {
			var pressedStack = this.permanents[(mouse.get_cityX() - this.rect.x) / 20 | 0];
			var permanentNumber = (this.rect.y - (mouse.get_cityY() + 1)) / 20 | 0;
			if(permanentNumber >= pressedStack.length && permanentNumber <= pressedStack.length + 3 && pressedStack.length > 0 && pressedStack[pressedStack.length - 1] != null && pressedStack[pressedStack.length - 1].is(buildings_RocketLaunchPlatform)) {
				permanentNumber = pressedStack.length - 1;
			}
			if(permanentNumber < pressedStack.length) {
				if(pressedStack[permanentNumber] != null) {
					switch(mouse.claimMouse(pressedStack[permanentNumber],null,false)._hx_index) {
					case 0:
						pressedStack[permanentNumber].onHover(true);
						return true;
					case 1:
						pressedStack[permanentNumber].onClick();
						return true;
					case 2:
						pressedStack[permanentNumber].onHover(false);
						return false;
					}
				}
			}
		}
		return false;
	}
	,save: function(queue) {
		queue.addRectangle(this.rect);
		var value = this.seed;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		if(this.appearance == null) {
			queue.addString("");
		} else {
			queue.addString(this.appearance);
		}
		var _g = 0;
		var _g1 = this.permanents.length;
		while(_g < _g1) {
			var i = _g++;
			var permanentStack = this.permanents[i];
			var value = permanentStack.length;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
			var _g2 = 0;
			while(_g2 < permanentStack.length) {
				var permanent = permanentStack[_g2];
				++_g2;
				if(permanent == null) {
					if(queue.size + 4 > queue.bytes.length) {
						var oldBytes1 = queue.bytes;
						queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
						queue.bytes.blit(0,oldBytes1,0,queue.size);
					}
					queue.bytes.setInt32(queue.size,2);
					queue.size += 4;
				} else {
					var value1 = permanent.isBuilding ? 1 : 0;
					if(queue.size + 4 > queue.bytes.length) {
						var oldBytes2 = queue.bytes;
						queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
						queue.bytes.blit(0,oldBytes2,0,queue.size);
					}
					queue.bytes.setInt32(queue.size,value1);
					queue.size += 4;
					var value2 = permanent.id;
					if(queue.size + 4 > queue.bytes.length) {
						var oldBytes3 = queue.bytes;
						queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
						queue.bytes.blit(0,oldBytes3,0,queue.size);
					}
					queue.bytes.setInt32(queue.size,value2);
					queue.size += 4;
					queue.addString(permanent.className);
					permanent.save(queue);
				}
			}
			if(permanentStack.length == 0 || permanentStack[0] == null) {
				if(this.decorations[i] != null) {
					queue.addString(this.decorations[i].textureName);
					var value3 = this.decorations[i].subImage;
					if(queue.size + 4 > queue.bytes.length) {
						var oldBytes4 = queue.bytes;
						queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
						queue.bytes.blit(0,oldBytes4,0,queue.size);
					}
					queue.bytes.setInt32(queue.size,value3);
					queue.size += 4;
				} else {
					queue.addString("");
				}
			}
		}
		var value = this.isUnbuildableFromAliens ? 1 : 0;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value;
		queue.size += 1;
		var value = this.isProtectedKey;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.id;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,setUnbuildableAliens: function() {
		if(this.worldGlow == null) {
			this.worldGlow = new PIXI.Sprite(Resources.getTexture("spr_blueworldglow"));
			this.worldGlow.width = this.rect.width;
			this.worldGlow.position.set(this.rect.x,this.rect.y - 4);
			this.stage.addChild(this.worldGlow);
			this.isUnbuildableFromAliens = true;
		}
	}
	,setProtectedKey: function() {
		this.isProtectedKey = true;
	}
	,makeBuildableAliens: function() {
		this.isUnbuildableFromAliens = false;
	}
	,cleanup: function() {
		if(this.worldSprite != null) {
			var tex = this.worldSprite.texture;
			var _this = this.stage;
			var child = this.worldSprite;
			var destroyTexture = true;
			if(destroyTexture == null) {
				destroyTexture = false;
			}
			HxOverrides.remove(_this.cacheableChildren,child);
			_this.isInvalid = true;
			child.destroy({ children : true, texture : destroyTexture});
			tex.destroy(true);
		}
	}
	,__class__: World
};
