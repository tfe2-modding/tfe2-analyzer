var progress_GenerateWorld = $hxClasses["progress.GenerateWorld"] = function() { };
progress_GenerateWorld.__name__ = "progress.GenerateWorld";
progress_GenerateWorld.doGenerate = function(generatorScript,generatorArgs,city,storyInfo,cityStage,cityMidStage,cityBgStage) {
	if(generatorScript == "RandomMiniWorlds") {
		progress_worldGenerators_RandomMiniWorlds.doGenerate(generatorArgs,city,storyInfo,cityStage,cityMidStage,cityBgStage);
	}
};
