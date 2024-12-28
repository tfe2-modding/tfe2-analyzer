var buildings_MedicalClinic = $hxClasses["buildings.MedicalClinic"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.extraCapacity = 0;
	this.extraQuality = 0;
	this.medicalEducationPart = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.isMedical = true;
};
buildings_MedicalClinic.__name__ = "buildings.MedicalClinic";
buildings_MedicalClinic.__interfaces__ = [buildings_IMedicalBuilding];
buildings_MedicalClinic.__super__ = buildings_Work;
buildings_MedicalClinic.prototype = $extend(buildings_Work.prototype,{
	get_medicalQuality: function() {
		return 50 + 0.25 * this.city.simulation.happiness.schoolHappiness * this.medicalEducationPart + this.extraQuality;
	}
	,get_medicalCapacity: function() {
		return (50 + this.extraCapacity) * (this.workers.length == 0 ? 0 : common_ArrayExtensions.sum(this.workers,function(w) {
			return w.get_educationSpeedModifier();
		}));
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_MedicalEducation,buildingUpgrades_AIAssistedDiagnosis];
	}
	,get_possibleCityUpgrades: function() {
		return [cityUpgrades_BirthControl];
	}
	,get_medicalTypeLimit: function() {
		return 1;
	}
	,get_medicalTypeID: function() {
		return 0;
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		if(citizen.relativeY < 5 && this.workers.indexOf(citizen) == 1) {
			citizen.changeFloor();
		} else {
			var x = citizen.relativeY < 5 ? 5 : 3;
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(x - citizen.relativeX) < spd) {
				citizen.relativeX = x;
			} else {
				var num = x - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("capacity",[Math.floor(_gthis.get_medicalCapacity())]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("quality",[Math.floor(_gthis.get_medicalQuality())]);
		});
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		buildings_Work.prototype.createMainWindowPart.call(this);
		var birthControlOptionContainer = new gui_GUIContainer(this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner);
		this.city.gui.windowInner.addChild(birthControlOptionContainer);
		var createBirthControlOption = function() {
			birthControlOptionContainer.padding.bottom = 6;
			var createBirthControlWindow = null;
			createBirthControlWindow = function() {
				_gthis.city.gui.createWindow("birthControlWindow");
				_gthis.city.gui.addWindowToStack(createBirthControlWindow);
				gui_BirthControlWindow.create(_gthis.city,_gthis.city.gui,_gthis.city.gui.innerWindowStage,_gthis.city.gui.windowInner);
				_gthis.city.gui.setWindowReload(createBirthControlWindow);
			};
			birthControlOptionContainer.addChild(new gui_TextButton(_gthis.city.gui,_gthis.city.gui.innerWindowStage,birthControlOptionContainer,createBirthControlWindow,common_Localize.lo("manage_birth_control")));
		};
		if(this.city.upgrades.vars.hasBirthControl) {
			createBirthControlOption();
		} else {
			var stillNeedsToAddBirthControlOption = true;
			birthControlOptionContainer.onUpdate = function() {
				if(stillNeedsToAddBirthControlOption && _gthis.city.upgrades.vars.hasBirthControl) {
					stillNeedsToAddBirthControlOption = false;
					createBirthControlOption();
				}
			};
		}
	}
	,__class__: buildings_MedicalClinic
});
