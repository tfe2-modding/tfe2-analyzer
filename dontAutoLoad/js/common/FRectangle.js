var common_FRectangle = $hxClasses["common.FRectangle"] = function(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};
common_FRectangle.__name__ = "common.FRectangle";
common_FRectangle.prototype = {
	get_x2: function() {
		return this.x + this.width;
	}
	,get_y2: function() {
		return this.y + this.height;
	}
	,clone: function() {
		return new common_FRectangle(this.x,this.y,this.width,this.height);
	}
	,__class__: common_FRectangle
};
