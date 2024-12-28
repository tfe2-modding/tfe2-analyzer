var progress_SidequestManager = $hxClasses["progress.SidequestManager"] = function(city,storyName) {
	this.minimumTimeBetweenSidequests = 5;
	this.canStartNewSidequestAt = 0;
	this.city = city;
	this.sidequests = [];
	this.completedSidequestsObjects = [];
	this.possibleSidequests = [new progress_sidequests_NotEnoughSchools(city,this)];
	if(Config.hasPremium()) {
		this.possibleSidequests.push(new progress_sidequests_SecretLibraryMission(city,this));
		this.possibleSidequests.push(new progress_sidequests_HackerSchoolMission(city,this));
		this.possibleSidequests.push(new progress_sidequests_HippieRocketMission(city,this));
	}
	if(storyName == "theLostShip") {
		this.possibleSidequests.push(new progress_sidequests_NotEnoughHomes(city,this));
	}
	if(storyName == "multipleWorlds") {
		this.possibleSidequests.push(new progress_sidequests_CarrotJuiceBarMission(city,this));
	}
	if(storyName == "hackersandaliens") {
		this.possibleSidequests.push(new progress_sidequests_SpecialArtworksMission(city,this));
		this.possibleSidequests.push(new progress_sidequests_SpecialArtworksMissionDelayedReward(city,this));
	}
	if(storyName == "hippiecommune") {
		this.possibleSidequests.push(new progress_sidequests_CarrotJuiceBarMission(city,this));
	}
	this.completedSidequests = [];
};
progress_SidequestManager.__name__ = "progress.SidequestManager";
progress_SidequestManager.prototype = {
	update: function(timeMod) {
		if(this.canStartSidequest() && timeMod > 0 && random_Random.getInt(1200) == 0) {
			var possibleSQ = random_Random.fromArray(this.possibleSidequests);
			if(possibleSQ.canStart()) {
				possibleSQ.start();
				this.sidequests.push(possibleSQ);
				if(possibleSQ.get_isInstant()) {
					this.completeSidequest(possibleSQ);
				}
				HxOverrides.remove(this.possibleSidequests,possibleSQ);
			}
		}
		var i = this.sidequests.length;
		while(--i >= 0) this.sidequests[i].update(timeMod);
	}
	,showSidequestDialog: function(title,text) {
		this.city.gui.removeNotifyPanel();
		this.city.gui.notifyInPanel(title,text,this);
	}
	,showSidequestFinishedDialog: function(title,text) {
		if(this.city.gui.currentNotificationRelatedTo == this) {
			this.city.gui.removeNotifyPanel();
		}
		this.city.gui.showSimpleWindow(text,title,true);
	}
	,completeSidequest: function(sideQuest) {
		sideQuest.onComplete();
		HxOverrides.remove(this.sidequests,sideQuest);
		this.completedSidequestsObjects.push(sideQuest);
		this.canStartNewSidequestAt = this.city.simulation.time.timeSinceStart / 1440 + this.minimumTimeBetweenSidequests;
		this.completedSidequests.push(sideQuest.className);
		sideQuest.completionTime = this.city.simulation.time.timeSinceStart;
	}
	,findSidequestWithType: function(type) {
		return Lambda.find(this.sidequests,function(sq) {
			return sq.className == type.__name__;
		});
	}
	,findCompletedSidequestWithType: function(type) {
		return Lambda.find(this.completedSidequestsObjects,function(sq) {
			return sq.className == type.__name__;
		});
	}
	,canStartSidequest: function() {
		if(this.city.simulation.time.timeSinceStart / 1440 >= this.canStartNewSidequestAt && (this.city.gui.window == null || this.city.gui.windowRelatedTo != this.city.progress.story) && this.sidequests.length == 0 && this.possibleSidequests.length > 0) {
			return this.city.gui.notificationPanel == null;
		} else {
			return false;
		}
	}
	,save: function(queue) {
		this.saveBasics(queue);
		var value = this.sidequests.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		Lambda.iter(this.sidequests,function(s) {
			queue.addString(s.className);
			s.save(queue);
		});
		var value = this.completedSidequestsObjects.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		Lambda.iter(this.completedSidequestsObjects,function(s) {
			queue.addString(s.className);
			s.save(queue);
		});
		var value = this.completedSidequests.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		Lambda.iter(this.completedSidequests,function(s) {
			queue.addString(s);
		});
	}
	,load: function(queue) {
		if(queue.version >= 61) {
			this.loadBasics(queue);
		}
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var num = intToRead;
		var _g = 0;
		var _g1 = num;
		while(_g < _g1) {
			var i = _g++;
			var typeString = queue.readString();
			var typeClass = $hxClasses[typeString];
			var sq = [Type.createInstance(typeClass,[this.city,this])];
			this.sidequests.push(sq[0]);
			var thisSq = Lambda.find(this.possibleSidequests,(function(sq) {
				return function(sq2) {
					return sq2.className == sq[0].className;
				};
			})(sq));
			if(thisSq != null) {
				HxOverrides.remove(this.possibleSidequests,thisSq);
			}
			sq[0].load(queue);
		}
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var num = intToRead;
		var _g = 0;
		var _g1 = num;
		while(_g < _g1) {
			var i = _g++;
			var typeString = queue.readString();
			var typeClass = $hxClasses[typeString];
			var sq1 = [Type.createInstance(typeClass,[this.city,this])];
			this.completedSidequestsObjects.push(sq1[0]);
			var thisSq = Lambda.find(this.possibleSidequests,(function(sq) {
				return function(sq2) {
					return sq2.className == sq[0].className;
				};
			})(sq1));
			if(thisSq != null) {
				HxOverrides.remove(this.possibleSidequests,thisSq);
			}
			sq1[0].load(queue);
		}
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var num = intToRead;
		var _g = 0;
		var _g1 = num;
		while(_g < _g1) {
			var i = _g++;
			this.completedSidequests.push(queue.readString());
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(progress_SidequestManager.saveDefinition);
		}
		var value = this.canStartNewSidequestAt;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"canStartNewSidequestAt")) {
			this.canStartNewSidequestAt = loadMap.h["canStartNewSidequestAt"];
		}
	}
	,__class__: progress_SidequestManager
};
