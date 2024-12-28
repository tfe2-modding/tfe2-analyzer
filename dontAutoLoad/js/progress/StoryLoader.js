var progress_StoryLoader = $hxClasses["progress.StoryLoader"] = function(storyName,onSuccess,onFail) {
	var fileName = "stories/" + storyName + ".json";
	var loader = new PIXI.Loader();
	loader.add(fileName);
	var hasError = false;
	loader.use(function(res,next) {
		if(res.error) {
			console.log("FloatingSpaceCities/progress/StoryLoader.hx:21:",res.error);
			if(!hasError) {
				onFail();
				hasError = true;
			}
			return;
		}
		var v = res.data;
		Resources.storiesInfo.h[storyName] = v;
		next();
	});
	loader.load(onSuccess);
};
progress_StoryLoader.__name__ = "progress.StoryLoader";
progress_StoryLoader.shouldShowUnlockAllStoriesButton = function(game) {
	var stories = Resources.allStoriesInfo;
	var _g = 0;
	while(_g < stories.length) {
		var story = stories[_g];
		++_g;
		if(story.unlockedWithAll && !progress_StoryLoader.hasCompletedRequirements(game,story) && (!Config.isLimitedDemo && 5 != 4 || common_ArrayExtensions.all(story.requirements,function(r) {
			return r != "notDemo";
		})) && (Config.hasPremium() || common_ArrayExtensions.all(story.requirements,function(r) {
			return r != "premium";
		}))) {
			return true;
		}
	}
	return false;
};
progress_StoryLoader.hasCompletedRequirements = function(game,story) {
	if(story.requirements == null) {
		return true;
	}
	if(story.unlockedWithAll && game.metaGame.unlockedAll && (!Config.isLimitedDemo && 5 != 4 || common_ArrayExtensions.all(story.requirements,function(r) {
		return r != "notDemo";
	})) && (Config.hasPremium() || common_ArrayExtensions.all(story.requirements,function(r) {
		return r != "premium";
	}))) {
		return true;
	}
	return common_ArrayExtensions.all(story.requirements,function(r) {
		if(!(r == "notDemo" && (!Config.isLimitedDemo && 5 != 4) || r == "premium" && Config.hasPremium() || r == "isSnow" && Config.isSnowThemed)) {
			return game.metaGame.hasWonScenario(r);
		} else {
			return true;
		}
	});
};
progress_StoryLoader.prototype = {
	__class__: progress_StoryLoader
};
