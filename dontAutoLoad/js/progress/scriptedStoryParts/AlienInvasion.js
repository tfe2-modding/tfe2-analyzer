var progress_scriptedStoryParts_AlienInvasion = $hxClasses["progress.scriptedStoryParts.AlienInvasion"] = function(city,story) {
	this.alienRayInited = false;
	this.isInvasionFinished = false;
	this.isInvasion = false;
	this.invasionProgress = 0;
	this.timeUntilInvasion = 0;
	progress_ScriptedStoryPart.call(this,city,story);
};
progress_scriptedStoryParts_AlienInvasion.__name__ = "progress.scriptedStoryParts.AlienInvasion";
progress_scriptedStoryParts_AlienInvasion.__super__ = progress_ScriptedStoryPart;
progress_scriptedStoryParts_AlienInvasion.prototype = $extend(progress_ScriptedStoryPart.prototype,{
	initialize: function($with) {
		this.timeUntilInvasion = $with.timeUntilInvasion;
	}
	,update: function(timeMod) {
		var _gthis = this;
		if(!this.isInvasionFinished) {
			if(this.isInvasion) {
				this.invasionProgress += timeMod;
				var alph = 0.0;
				if(!this.alienRayInited) {
					this.graphics = new PIXI.Graphics();
					this.city.movingViewStage.addChild(this.graphics);
					this.alienRayInited = true;
				}
				if(this.invasionProgress >= 30) {
					this.city.mainMovingViewStage.alpha = 0;
					alph = 1 - (this.invasionProgress - 30) / 30;
					if(this.invasionProgress >= 60) {
						this.city.progress.story.currentGoal = null;
						this.loseAliens();
						this.isInvasionFinished = true;
					}
				} else {
					alph = this.invasionProgress / 30;
				}
				this.graphics.clear();
				if(alph > 0) {
					this.graphics.beginFill(4388075,alph);
					var x1 = common_ArrayExtensions.min(this.city.worlds,function(w) {
						return w.rect.x - 10;
					}).rect.x - 10;
					var w = common_ArrayExtensions.min(this.city.worlds,function(w) {
						return w.rect.y - common_ArrayExtensions.max(w.permanents,function(p) {
							return p.length * 20;
						}).length * 20 - _gthis.city.game.rect.height * _gthis.city.game.scaling;
					});
					var y1 = w.rect.y - common_ArrayExtensions.max(w.permanents,function(p) {
						return p.length * 20;
					}).length * 20 - _gthis.city.game.rect.height * _gthis.city.game.scaling;
					this.graphics.drawRect(x1,y1,common_ArrayExtensions.max(this.city.worlds,function(w) {
						return w.rect.get_x2() + 10;
					}).rect.get_x2() + 10 - x1,common_ArrayExtensions.max(this.city.worlds,function(w) {
						return w.rect.get_y2();
					}).rect.get_y2() + this.city.game.rect.height * this.city.game.scaling - y1);
					this.graphics.endFill();
				}
			} else {
				this.timeUntilInvasion -= timeMod;
				this.isInvasion = true;
			}
		}
	}
	,loseAliens: function() {
		var _gthis = this;
		this.city.activateLoserState();
		this.city.gui.createWindow();
		this.city.gui.windowAddTitleText("You Lost!");
		this.city.gui.windowAddInfoText("Aliens have destroyed your city blah blah.");
		this.city.gui.windowAddBottomButtons(null,"Try Again");
		this.city.gui.windowOnDestroy = function() {
			_gthis.city.game.newCity(_gthis.city.progress.story.storyName,_gthis.city.cityFile);
		};
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		progress_ScriptedStoryPart.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(progress_scriptedStoryParts_AlienInvasion.saveDefinition);
		}
		var value = this.timeUntilInvasion;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.invasionProgress;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.isInvasion;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.isInvasionFinished;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
	}
	,load: function(queue,definition) {
		progress_ScriptedStoryPart.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timeUntilInvasion")) {
			this.timeUntilInvasion = loadMap.h["timeUntilInvasion"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"invasionProgress")) {
			this.invasionProgress = loadMap.h["invasionProgress"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"isInvasion")) {
			this.isInvasion = loadMap.h["isInvasion"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"isInvasionFinished")) {
			this.isInvasionFinished = loadMap.h["isInvasionFinished"];
		}
	}
	,__class__: progress_scriptedStoryParts_AlienInvasion
});
