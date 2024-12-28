var common_FPoint = $hxClasses["common.FPoint"] = function(x,y) {
	this.x = x;
	this.y = y;
};
common_FPoint.__name__ = "common.FPoint";
common_FPoint.distance = function(point1,point2) {
	return Math.sqrt((point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y));
};
common_FPoint.prototype = {
	get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,__class__: common_FPoint
};
