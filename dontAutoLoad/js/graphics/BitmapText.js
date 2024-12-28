var graphics_BitmapText = $hxClasses["graphics.BitmapText"] = function(text,style,langIndependentSize) {
	if(langIndependentSize == null) {
		langIndependentSize = false;
	}
	PIXI.Container.call(this);
	if(Settings.language == "vi" && !langIndependentSize) {
		style.font = Std.string(style.font) + "_vi";
	}
	var fnt = style.font;
	if(!langIndependentSize && graphics_BitmapText.languageDependentFontMap != null && graphics_BitmapText.languageDependentFontMap[fnt] != null) {
		style.font = graphics_BitmapText.languageDependentFontMap[fnt].font;
	}
	style.fontName = style.font;
	style.font = null;
	this.internalText = new PIXI.BitmapText(text,style);
	this.addChild(this.internalText);
	if(Settings.language == "vi" && !langIndependentSize) {
		this.internalText.position.y = 1;
	}
	if(!langIndependentSize && graphics_BitmapText.languageDependentFontMap != null && graphics_BitmapText.languageDependentFontMap[fnt] != null && graphics_BitmapText.languageDependentFontMap[fnt].yAdd != null) {
		this.internalText.position.y = graphics_BitmapText.languageDependentFontMap[fnt].yAdd;
	}
};
graphics_BitmapText.__name__ = "graphics.BitmapText";
graphics_BitmapText.__super__ = PIXI.Container;
graphics_BitmapText.prototype = $extend(PIXI.Container.prototype,{
	set_maxWidth: function(w) {
		return this.internalText.maxWidth = w;
	}
	,get_text: function() {
		return this.internalText.text;
	}
	,set_text: function(w) {
		return this.internalText.text = w;
	}
	,get_textWidth: function() {
		return this.internalText.textWidth;
	}
	,get_textHeight: function() {
		return this.internalText.textHeight;
	}
	,set_tint: function(t) {
		return this.internalText.tint = t;
	}
	,get_anchor: function() {
		return this.internalText.anchor;
	}
	,set_align: function(a) {
		return this.internalText.align = a;
	}
	,get_fontName: function() {
		return this.internalText.fontName;
	}
	,destroy: function(options) {
		if(options == null) {
			options = { children : true};
		}
		PIXI.Container.prototype.destroy.call(this,options);
	}
	,__class__: graphics_BitmapText
});
