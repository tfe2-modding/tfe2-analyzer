var gamesave_SaveMetaData = $hxClasses["gamesave.SaveMetaData"] = function() { };
gamesave_SaveMetaData.__name__ = "gamesave.SaveMetaData";
gamesave_SaveMetaData.saveMetaData = function(fileName,fileNameForText,city) {
	var possibleStory = Lambda.find(Resources.allStoriesInfo,function(x) {
		return x.link == city.progress.story.storyName;
	});
	var cityName = common_Localize.lo("city");
	if(possibleStory != null) {
		cityName = possibleStory.name;
	} else {
		cityName = common_Localize.lo("stories.json/" + city.progress.story.storyName + ".name");
	}
	if(city.cityName != "") {
		cityName = city.cityName;
	}
	var metaText = common_Localize.lo("file_description",[cityName,city.simulation.citizens.length]);
	if(city.subCities.length > 0) {
		metaText = common_Localize.lo("file_description_colony",[cityName,city.subCities.length,common_ArrayExtensions.sum(city.progress.allCitiesInfo.subCityPops)]);
	}
	common_Storage.setItem(fileNameForText + "__meta",metaText,function() {
	});
	common_Storage.setItem("__meta__mostRecentlyPlayed",fileName,function() {
	});
};
