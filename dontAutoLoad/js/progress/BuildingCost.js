var progress_BuildingCost = $hxClasses["progress.BuildingCost"] = function(city) {
	this.city = city;
};
progress_BuildingCost.__name__ = "progress.BuildingCost";
progress_BuildingCost.prototype = {
	getBuildingCost: function(buildingInfo) {
		if(buildingInfo.className == "NormalHouse" && this.city.progress.story.storyName == "theLostShip" && this.city.progress.story.currentGoal != null && this.city.progress.story.currentGoal.name == "BuildIndoorFarmAndHouse" && (this.city.getAmountOfPermanentsPerType().h["buildings.NormalHouse"] == null || this.city.getAmountOfPermanentsPerType().h["buildings.NormalHouse"] == 0)) {
			return new Materials(2,2);
		}
		return Materials.fromBuildingInfo(buildingInfo);
	}
	,getBuildingCostDescriptionAdder: function(buildingInfo) {
		if(buildingInfo.className == "NormalHouse" && this.city.progress.story.storyName == "theLostShip" && this.city.progress.story.currentGoal != null && this.city.progress.story.currentGoal.name == "BuildIndoorFarmAndHouse" && (this.city.getAmountOfPermanentsPerType().h["buildings.NormalHouse"] == null || this.city.getAmountOfPermanentsPerType().h["buildings.NormalHouse"] == 0)) {
			return " " + common_Localize.lo("first_house_cheaper");
		}
		return "";
	}
	,__class__: progress_BuildingCost
};
