var common_Performance = $hxClasses["common.Performance"] = function() { };
common_Performance.__name__ = "common.Performance";
common_Performance.get_fps = function() {
	return 1000 / (common_ArrayExtensions.sum(common_Performance.frameTimeValues) / common_Performance.frameTimeValues.length);
};
common_Performance.registerFrame = function() {
	var currentTime = window.performance.now();
	if(common_Performance.frameTimeValues.length > 60) {
		common_Performance.frameTimeValues.splice(0,1);
	}
	if(common_Performance.previousTime != 0) {
		common_Performance.frameTimeValues.push(currentTime - common_Performance.previousTime);
	}
	common_Performance.previousTime = currentTime;
	if(common_Performance.isDrawingFPSCurrently) {
		common_Performance.fpsBitmap.set_text(Math.round(common_Performance.get_fps()) + "");
		if(common_Performance.get_fps() >= 100) {
			common_Performance.fpsRect.clear();
			common_Performance.fpsRect.beginFill(0,0.5);
			common_Performance.fpsRect.drawRect(7 * common_Performance.dpi,7 * common_Performance.dpi,46 * common_Performance.dpi,29 * common_Performance.dpi);
			common_Performance.fpsRect.endFill();
		}
	}
};
