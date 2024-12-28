var common_Achievements = $hxClasses["common.Achievements"] = function() { };
common_Achievements.__name__ = "common.Achievements";
common_Achievements.achieve = function(achievement_id) {
	if(common_Achievements.achievementsAchievedThisSession.h[achievement_id] == null && common_Achievements.achievementsAreEnabled) {
		window.SteamUnlockAchievement(achievement_id);
		common_Achievements.achievementsAchievedThisSession.h[achievement_id] = true;
	}
};
common_Achievements.setEnabled = function(isEnabled) {
	common_Achievements.achievementsAreEnabled = isEnabled;
};
