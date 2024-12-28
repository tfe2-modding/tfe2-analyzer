var common_DesktopHelpers = $hxClasses["common.DesktopHelpers"] = function() { };
common_DesktopHelpers.__name__ = "common.DesktopHelpers";
common_DesktopHelpers.update = function(game) {
	if(game.keyboard.pressed[119]) {
		
                var mywindow = chrome.app.window.getAll()[0];
                if (mywindow != null) {
                    mywindow.innerBounds.width = 1280;
                    mywindow.innerBounds.height = 720;
                }
            ;
	}
	if(game.keyboard.pressed[118]) {
		
                var mywindow = chrome.app.window.getAll()[0];
                if (mywindow != null) {
                    mywindow.innerBounds.width = 1920;
                    mywindow.innerBounds.height = 1080;
                }
            ;
	}
};
