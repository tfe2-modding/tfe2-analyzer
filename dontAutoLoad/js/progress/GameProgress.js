var progress_GameProgress = $hxClasses["progress.GameProgress"] = function(city,storyName) {
	this.ruleset = progress_Ruleset.Normal;
	this.shownPopLimitHint = false;
	this.shownCtrlToHighlightHint = false;
	this.city = city;
	this.storyName = storyName;
	this.goalHelp = new progress_GoalHelp(city);
	this.sandbox = new progress_SandboxHelper(city);
	this.buildingCost = new progress_BuildingCost(city);
	this.allCitiesInfo = new progress_AllConnectedCitiesInfo(city);
	this.sideQuests = new progress_SidequestManager(city,storyName);
	this.currentHouseProperties = new buildings_CustomHouseProperties();
};
progress_GameProgress.__name__ = "progress.GameProgress";
progress_GameProgress.prototype = {
	init: function() {
		this.resources = new progress_CityResources();
		this.unlocks = new progress_Unlocks(this.city);
		this.story = new progress_Story(this.city,this.storyName);
	}
	,handleMouse: function(mouse) {
		if(this.cityIntro != null) {
			return this.cityIntro.handleMouse(mouse);
		}
		return false;
	}
	,update: function(timeMod) {
		this.story.update(timeMod);
		this.unlocks.update(timeMod);
		this.sandbox.update(timeMod);
		this.sideQuests.update(timeMod);
		this.allCitiesInfo.update();
		if(this.cityIntro != null) {
			this.cityIntro.update(timeMod);
		}
		if(this.city.simulation.babyMaker.softPopLimit == this.city.simulation.citizens.length && this.city.simulation.babyMaker.softPopLimit == 3000 && this.city.gui.window == null && !this.shownPopLimitHint) {
			this.shownPopLimitHint = true;
			this.city.gui.showSimpleWindow(common_Localize.lo("change_pop_limit"),common_Localize.lo("pop_limit_reached"));
		}
	}
	,save: function(queue) {
		this.story.save(queue);
		this.unlocks.save(queue);
		var value = this.shownCtrlToHighlightHint ? 1 : 0;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value;
		queue.size += 1;
		this.sandbox.save(queue);
		var value = this.shownPopLimitHint;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		this.allCitiesInfo.save(queue);
		this.sideQuests.save(queue);
		var e = this.ruleset;
		queue.addString($hxEnums[e.__enum__].__constructs__[e._hx_index]);
	}
	,load: function(queue) {
		this.story.load(queue);
		this.unlocks.load(queue);
		if(queue.version >= 13) {
			var byteToRead = queue.bytes.b[queue.readStart];
			queue.readStart += 1;
			this.shownCtrlToHighlightHint = byteToRead == 1;
		}
		if(queue.version >= 25) {
			this.sandbox.load(queue);
		}
		if(queue.version >= 40) {
			var byteToRead = queue.bytes.b[queue.readStart];
			queue.readStart += 1;
			this.shownPopLimitHint = byteToRead > 0;
		}
		if(queue.version >= 53) {
			this.allCitiesInfo.load(queue);
		}
		if(queue.version >= 60) {
			this.sideQuests.load(queue);
		}
		if(this.unlocks.getUnlockState(buildings_MachinePartsFactory) == progress_UnlockState.Researched) {
			this.currentHouseProperties.customAttractiveness = 70;
		}
		if(this.unlocks.getUnlockState(buildings_RefinedMetalFactory) == progress_UnlockState.Researched) {
			this.currentHouseProperties.customAttractiveness = 85;
		}
		if(this.unlocks.getUnlockState(buildings_ComputerChipFactory) == progress_UnlockState.Researched) {
			this.currentHouseProperties.customAttractiveness = 100;
		}
		if(queue.version >= 69) {
			this.ruleset = Type.createEnum(progress_Ruleset,queue.readString(),null);
		}
	}
	,resetCtrlToHightlightHint: function() {
		if(this.city.simulation.citizens.length >= 100) {
			this.shownCtrlToHighlightHint = true;
		}
	}
	,__class__: progress_GameProgress
};
