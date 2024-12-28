var gui_IconListDisplay = $hxClasses["gui.IconListDisplay"] = function(displayedIcons) {
	PIXI.Container.call(this);
	this.setDisplay(displayedIcons);
};
gui_IconListDisplay.__name__ = "gui.IconListDisplay";
gui_IconListDisplay.__super__ = PIXI.Container;
gui_IconListDisplay.prototype = $extend(PIXI.Container.prototype,{
	wouldChangeDisplay: function(newIcons) {
		if(this.displayedIcons.length != newIcons.length) {
			return true;
		}
		var _g = 0;
		var _g1 = this.displayedIcons.length;
		while(_g < _g1) {
			var i = _g++;
			if(newIcons[i].texture != this.displayedIcons[i].texture || newIcons[i].text != this.displayedIcons[i].text) {
				return true;
			}
		}
		return false;
	}
	,setDisplay: function(displayedIcons) {
		this.displayedIcons = displayedIcons;
		var i = this.children.length;
		while(--i >= 0) {
			var child = this.children[i];
			this.removeChildAt(i);
			child.destroy({ children : true});
		}
		var xx = 0;
		var _g = 0;
		while(_g < displayedIcons.length) {
			var displayedIcon = displayedIcons[_g];
			++_g;
			var spr = new PIXI.Sprite(displayedIcon.texture);
			spr.position.x = xx;
			this.addChild(spr);
			xx += (spr.width | 0) + 2;
			var displayText = displayedIcon.text;
			var col = 0;
			if(HxOverrides.substr(displayedIcon.text,0,"[red]".length) == "[red]") {
				displayText = HxOverrides.substr(displayText,"[red]".length,null);
				col = 16711680;
			}
			if(HxOverrides.substr(displayedIcon.text,0,"[i#".length) == "[i#" && HxOverrides.substr(displayedIcon.text,9,1) == "]") {
				displayText = HxOverrides.substr(displayText,"[i#123456]".length,null);
				spr.tint = thx_color_Rgb.toInt(thx_color_Rgbxa.toRgb(thx_color_Color.parse(HxOverrides.substr(displayedIcon.text,2,7))));
			}
			var bitmapText = new graphics_BitmapText(displayText,{ font : "Arial", tint : col});
			if(displayText == "1") {
				--xx;
			}
			bitmapText.position.set(xx,-1);
			if(displayText == "1") {
				--xx;
			}
			this.addChild(bitmapText);
			if(displayText != "") {
				xx += (bitmapText.get_textWidth() | 0) + 3;
			}
		}
		this.displayWidth = xx;
	}
	,__class__: gui_IconListDisplay
});
