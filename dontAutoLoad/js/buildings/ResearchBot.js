var buildings_ResearchBot = $hxClasses["buildings.ResearchBot"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.timeWorking = 0;
	this.waiting = 0;
	this.flyingSaucerTargetX = 0;
	this.flyingSaucerY = 0;
	this.flyingSaucerXI = 0;
	this.flyingSaucerXProg = 0;
	this.returning = false;
	this.flying = false;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.doorX = 15;
	this.flyingSaucerSprite = Resources.makeSprite("spr_researchbot");
	this.flyingSaucerSprite.position.set(position.x,position.y);
	stage.addChild(this.flyingSaucerSprite);
};
buildings_ResearchBot.__name__ = "buildings.ResearchBot";
buildings_ResearchBot.__super__ = buildings_Work;
buildings_ResearchBot.prototype = $extend(buildings_Work.prototype,{
	positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(!this.flying) {
			this.flyingSaucerXI = (this.position.x / 20 | 0) - this.city.simulation.flyingPathfinder.gridIStart - 1;
			this.flyingSaucerY = this.position.y;
			this.flyingSaucerSprite.position.set(this.position.x,this.position.y);
		} else if(this.workers.length > 0) {
			this.workers[0].canViewSelfInBuilding = false;
		}
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
		if(this.flying) {
			this.timeWorking += timeMod;
			if(this.waiting > 0) {
				this.waiting -= timeMod;
			} else {
				var num = this.flyingSaucerTargetX - this.flyingSaucerXI;
				var dir = num > 0 ? 1 : num < 0 ? -1 : 0;
				if(dir == 0) {
					var nextPos = this.city.simulation.flyingPathfinder.highestYPositions[this.flyingSaucerXI] - 40;
					if(this.returning) {
						nextPos += 40;
					}
					if(this.flyingSaucerY < nextPos && nextPos >= -1000000) {
						this.flyingSaucerY += 3 * timeMod;
						if(this.flyingSaucerY > nextPos) {
							this.flyingSaucerY = nextPos;
						}
					} else {
						if(nextPos >= -1000000) {
							this.flyingSaucerY = nextPos;
						}
						if(this.returning) {
							this.flying = false;
							this.returning = false;
							this.waiting = 60;
						} else {
							this.flyingSaucerTargetX = (this.position.x / 20 | 0) - this.city.simulation.flyingPathfinder.gridIStart - 1;
							this.returning = true;
							this.waiting = 60;
						}
					}
				} else {
					var nextPos = this.city.simulation.flyingPathfinder.highestYPositions[this.flyingSaucerXI + dir] - 40;
					if(this.flyingSaucerY > nextPos && nextPos >= -100000) {
						this.flyingSaucerY -= 3 * timeMod;
						if(this.flyingSaucerY < nextPos) {
							this.flyingSaucerY = nextPos;
						}
					} else {
						this.flyingSaucerXProg += 3 * dir * timeMod;
						if(dir * this.flyingSaucerXProg > 20) {
							this.flyingSaucerXProg = 0;
							this.flyingSaucerXI += dir;
						}
					}
				}
				this.flyingSaucerSprite.position.set((this.flyingSaucerXI + this.city.simulation.flyingPathfinder.gridIStart + 1) * 20 + this.flyingSaucerXProg,this.flyingSaucerY);
				if(this.workers.length > 0 && this.workers[0].inPermanent == this) {
					this.workers[0].setRelativePos(this.flyingSaucerSprite.position.x - this.position.x + 9,-(this.flyingSaucerSprite.position.y - this.position.y) + 3);
				}
			}
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && !this.flying) {
			citizen.currentAction = 2;
			return;
		}
		if(this.flying) {
			var newKnowledge = 0.00125 * timeMod * this.city.simulation.happiness.actionSpeedModifier * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
			this.city.materials.knowledge += newKnowledge;
			this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
			return;
		}
		var spd = citizen.pathWalkSpeed * timeMod;
		Citizen.shouldUpdateDraw = true;
		var tmp;
		if(Math.abs(9 - citizen.relativeX) < spd) {
			citizen.relativeX = 9;
			tmp = true;
		} else {
			var num = 9 - citizen.relativeX;
			citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			tmp = false;
		}
		if(tmp) {
			citizen.canViewSelfInBuilding = false;
			this.flying = true;
			this.flyingSaucerTargetX = random_Random.getInt(this.city.simulation.flyingPathfinder.highestYPositions.length);
			this.flyingSaucerXI = (this.position.x / 20 | 0) - this.city.simulation.flyingPathfinder.gridIStart - 1;
			if(this.city.progress.story.storyName == "hackersandaliens" && this.timeWorking < 60) {
				this.flyingSaucerTargetX = (-36. | 0) - this.city.simulation.flyingPathfinder.gridIStart - 1;
			}
			this.flyingSaucerY = this.position.y;
		}
	}
	,destroy: function() {
		this.flyingSaucerSprite.destroy();
		buildings_Work.prototype.destroy.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ResearchBot.saveDefinition);
		}
		var value = this.flying;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.returning;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.flyingSaucerXProg;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.flyingSaucerXI;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.flyingSaucerY;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.flyingSaucerTargetX;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.waiting;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.timeWorking;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"flying")) {
			this.flying = loadMap.h["flying"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"returning")) {
			this.returning = loadMap.h["returning"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"flyingSaucerXProg")) {
			this.flyingSaucerXProg = loadMap.h["flyingSaucerXProg"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"flyingSaucerXI")) {
			this.flyingSaucerXI = loadMap.h["flyingSaucerXI"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"flyingSaucerY")) {
			this.flyingSaucerY = loadMap.h["flyingSaucerY"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"flyingSaucerTargetX")) {
			this.flyingSaucerTargetX = loadMap.h["flyingSaucerTargetX"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"waiting")) {
			this.waiting = loadMap.h["waiting"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timeWorking")) {
			this.timeWorking = loadMap.h["timeWorking"];
		}
	}
	,__class__: buildings_ResearchBot
});
