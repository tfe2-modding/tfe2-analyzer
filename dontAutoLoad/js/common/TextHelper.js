var common_TextHelper = $hxClasses["common.TextHelper"] = function(game) {
	this.game = game;
};
common_TextHelper.__name__ = "common.TextHelper";
common_TextHelper.prototype = {
	ifNotMobile: function(thisText) {
		if(this.game.isMobile) {
			return "";
		}
		return thisText;
	}
	,clickOrTap: function(capital) {
		if(capital == null) {
			capital = true;
		}
		if(capital) {
			if(this.game.isMobile) {
				return common_StringExtensions.firstToUpper(common_Localize.lo("tap"));
			} else {
				return common_StringExtensions.firstToUpper(common_Localize.lo("click"));
			}
		}
		if(this.game.isMobile) {
			return common_Localize.lo("tap");
		} else {
			return common_Localize.lo("click");
		}
	}
	,__class__: common_TextHelper
};
