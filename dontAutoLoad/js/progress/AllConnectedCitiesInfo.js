var progress_AllConnectedCitiesInfo = $hxClasses["progress.AllConnectedCitiesInfo"] = function(city) {
	this.allCityRuleset = progress_Ruleset.Normal;
	this.betrayedHippies = false;
	this.subCityMachine = [];
	this.subCitySentPeople = [];
	this.subCitySentResources = [];
	this.subCityPops = [];
	this.subCityNames = [];
	this.city = city;
};
progress_AllConnectedCitiesInfo.__name__ = "progress.AllConnectedCitiesInfo";
progress_AllConnectedCitiesInfo.prototype = {
	get_thisCityIndex: function() {
		if(this.city.cityFile == this.city.cityMainFile) {
			return 0;
		}
		return this.city.subCities.indexOf(HxOverrides.substr(this.city.cityFile,this.city.cityMainFile.length + 1,null)) + 1;
	}
	,update: function() {
		var _gthis = this;
		while(this.subCitySentPeople.length < this.city.subCities.length + 1) {
			this.subCityNames.push("");
			this.subCityPops.push(0);
			this.subCitySentResources.push(new haxe_ds_StringMap());
			this.subCitySentPeople.push("");
		}
		while(this.subCityMachine.length < this.city.subCities.length + 1) this.subCityMachine.push(false);
		var id = this.get_thisCityIndex();
		var possibleStory = Lambda.find(Resources.allStoriesInfo,function(x) {
			return x.link == _gthis.city.progress.story.storyName;
		});
		if(this.city.cityName == "" || this.city.cityName == null) {
			if(possibleStory != null) {
				this.subCityNames[id] = possibleStory.name;
			} else {
				this.subCityNames[id] = common_Localize.lo("stories.json/" + this.city.progress.story.storyName + ".name");
			}
		} else {
			this.subCityNames[id] = this.city.cityName;
		}
		this.subCityPops[id] = this.city.simulation.citizens.length;
		this.subCityMachine[id] = this.city.getAmountOfPermanentsPerType().h["buildings.TheMachine"] >= 1;
	}
	,doTransfer: function() {
		var thisCitySent = this.subCitySentResources[this.get_thisCityIndex()];
		if(thisCitySent != null) {
			if(thisCitySent.h["food"] != null && thisCitySent.h["food"] >= 0) {
				var _g = this.city.materials;
				_g.set_food(_g.food + thisCitySent.h["food"]);
			}
			if(thisCitySent.h["wood"] != null && thisCitySent.h["wood"] >= 0) {
				this.city.materials.wood += thisCitySent.h["wood"];
			}
			if(thisCitySent.h["stone"] != null && thisCitySent.h["stone"] >= 0) {
				this.city.materials.stone += thisCitySent.h["stone"];
			}
			if(thisCitySent.h["machineParts"] != null && thisCitySent.h["machineParts"] >= 0) {
				this.city.materials.machineParts += thisCitySent.h["machineParts"];
			}
			if(thisCitySent.h["refinedMetal"] != null && thisCitySent.h["refinedMetal"] >= 0) {
				this.city.materials.refinedMetal += thisCitySent.h["refinedMetal"];
			}
			if(thisCitySent.h["computerChips"] != null && thisCitySent.h["computerChips"] >= 0) {
				this.city.materials.computerChips += thisCitySent.h["computerChips"];
			}
			if(thisCitySent.h["cacao"] != null && thisCitySent.h["cacao"] >= 0) {
				this.city.materials.cacao += thisCitySent.h["cacao"];
			}
			if(thisCitySent.h["chocolate"] != null && thisCitySent.h["chocolate"] >= 0) {
				this.city.materials.chocolate += thisCitySent.h["chocolate"];
			}
			if(thisCitySent.h["graphene"] != null && thisCitySent.h["graphene"] >= 0) {
				this.city.materials.graphene += thisCitySent.h["graphene"];
			}
			if(thisCitySent.h["rocketFuel"] != null && thisCitySent.h["rocketFuel"] >= 0) {
				this.city.materials.rocketFuel += thisCitySent.h["rocketFuel"];
			}
			var _g = 0;
			var _g1 = MaterialsHelper.modMaterials;
			while(_g < _g1.length) {
				var modMaterial = _g1[_g];
				++_g;
				var currentMaterial = modMaterial.variableName;
				if(thisCitySent.h[currentMaterial] != null && thisCitySent.h[currentMaterial] >= 0) {
					this.city.materials[currentMaterial] += thisCitySent.h[currentMaterial];
				}
			}
			if(thisCitySent.h["knowledge"] != null && thisCitySent.h["knowledge"] >= 0) {
				this.city.materials.knowledge += thisCitySent.h["knowledge"];
			}
			this.subCitySentResources[this.get_thisCityIndex()] = new haxe_ds_StringMap();
		}
		var thisCitySentPeople = this.subCitySentPeople[this.get_thisCityIndex()];
		if(thisCitySentPeople != null) {
			var allThosePeople = thisCitySentPeople.split(";");
			allThosePeople.pop();
			var toWorld = null;
			var worldsWithCitizens = new haxe_ds_ObjectMap();
			var _g = 0;
			var _g1 = this.city.simulation.citizens;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				if(worldsWithCitizens.h[c.onWorld.__id__] != null) {
					worldsWithCitizens.set(c.onWorld,true);
				}
			}
			toWorld = common_ArrayExtensions.whereMin(this.city.worlds,function(w) {
				return w.rect.height > 0;
			},function(w) {
				return w.rect.y + 0.00001 * w.rect.x;
			});
			if(this.city.simulation.citizens.length > 0) {
				var _g = 0;
				var _g1 = this.city.simulation.citizens;
				while(_g < _g1.length) {
					var c = _g1[_g];
					++_g;
					if(c.onWorld != null && c.onWorld.rect.height > 0) {
						toWorld = c.onWorld;
						break;
					}
				}
			}
			var _g = 0;
			while(_g < allThosePeople.length) {
				var person = allThosePeople[_g];
				++_g;
				var citizenInfo = person.split(",");
				var newPerson = this.city.simulation.createCitizen(toWorld,parseFloat(citizenInfo[0]),null,random_Random.getInt(toWorld.rect.width - 2));
				newPerson.spriteIndex = Std.parseInt(citizenInfo[1]);
				newPerson.educationLevel = parseFloat(citizenInfo[2]);
				newPerson.dieAgeModifier = parseFloat(citizenInfo[3]);
				var f = newPerson.educationLevel;
				if(isNaN(f)) {
					newPerson.educationLevel = 0;
					console.log("FloatingSpaceCities/progress/AllConnectedCitiesInfo.hx:104:","education was NaN!");
				}
				var f1 = newPerson.dieAgeModifier;
				if(isNaN(f1)) {
					newPerson.dieAgeModifier = 0;
				}
				newPerson.updateSpriteAndNameIndexInfo();
				Citizen.shouldUpdateDraw = true;
			}
			this.subCitySentPeople[this.get_thisCityIndex()] = "";
		}
	}
	,doCityStart: function() {
		this.city.progress.ruleset = this.city.progress.allCitiesInfo.allCityRuleset;
		if(this.city.progress.ruleset == progress_Ruleset.HippieCity && !Lambda.exists(this.city.policies.policies,function(po) {
			return ((po) instanceof policies_HippieLifestyle);
		})) {
			this.city.policies.addPolicy(new policies_HippieLifestyle());
		}
		if(this.city.progress.ruleset == progress_Ruleset.KeyCity) {
			this.city.simulation.happiness.createGloryOfTheKey();
		}
		if(this.betrayedHippies) {
			if(this.get_thisCityIndex() != 0) {
				this.city.progress.unlocks.lock(buildings_BlossomHippieHQ);
			} else {
				this.city.progress.unlocks.unlock(buildings_BlossomHippieHQ,true,false);
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(progress_AllConnectedCitiesInfo.saveDefinition);
		}
		queue.addString(haxe_Serializer.run(this.subCityNames));
		queue.addString(haxe_Serializer.run(this.subCityPops));
		queue.addString(haxe_Serializer.run(this.subCitySentResources));
		queue.addString(haxe_Serializer.run(this.subCitySentPeople));
		queue.addString(haxe_Serializer.run(this.subCityMachine));
		var value = this.betrayedHippies;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var e = this.allCityRuleset;
		queue.addString($hxEnums[e.__enum__].__constructs__[e._hx_index]);
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"subCityNames")) {
			this.subCityNames = loadMap.h["subCityNames"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"subCityPops")) {
			this.subCityPops = loadMap.h["subCityPops"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"subCitySentResources")) {
			this.subCitySentResources = loadMap.h["subCitySentResources"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"subCitySentPeople")) {
			this.subCitySentPeople = loadMap.h["subCitySentPeople"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"subCityMachine")) {
			this.subCityMachine = loadMap.h["subCityMachine"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"betrayedHippies")) {
			this.betrayedHippies = loadMap.h["betrayedHippies"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"allCityRuleset")) {
			this.allCityRuleset = loadMap.h["allCityRuleset"];
		}
	}
	,__class__: progress_AllConnectedCitiesInfo
};
