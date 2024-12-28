var common_Point = $hxClasses["common.Point"] = function(x,y) {
	this.x = x;
	this.y = y;
};
common_Point.__name__ = "common.Point";
common_Point.distance = function(point1,point2) {
	return Math.sqrt((point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y));
};
common_Point.mean = function(point1,point2) {
	return new common_FPoint(0.5 * (point1.x + point2.x),0.5 * (point1.y + point2.y));
};
common_Point.prototype = {
	__class__: common_Point
};
