var common_Rectangle = $hxClasses["common.Rectangle"] = function(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};
common_Rectangle.__name__ = "common.Rectangle";
common_Rectangle.fromPixiRect = function(rect) {
	return new common_Rectangle(rect.x | 0,rect.y | 0,rect.width | 0,rect.height | 0);
};
common_Rectangle.fromStoryRect = function(rect) {
	return new common_Rectangle(rect.x,rect.y,rect.width,rect.height);
};
common_Rectangle.prototype = {
	get_x2: function() {
		return this.x + this.width;
	}
	,get_y2: function() {
		return this.y + this.height;
	}
	,get_center: function() {
		return new common_Point(this.x + (this.width / 2 | 0),this.y + (this.height / 2 | 0));
	}
	,clone: function() {
		return new common_Rectangle(this.x,this.y,this.width,this.height);
	}
	,set: function(rect) {
		this.x = rect.x;
		this.y = rect.y;
		this.width = rect.width;
		this.height = rect.height;
	}
	,intersects: function(other) {
		var tmp;
		var val = this.x;
		if(!(val >= other.x && val < other.x + other.width)) {
			var val = other.x;
			tmp = val >= this.x && val < this.x + this.width;
		} else {
			tmp = true;
		}
		if(tmp) {
			var val = other.y;
			if(!(val >= this.y && val < this.y + this.height)) {
				var val = this.y;
				if(val >= other.y) {
					return val < other.y + other.height;
				} else {
					return false;
				}
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,fullyContains: function(other) {
		if(this.x <= other.x && this.y <= other.y && this.get_x2() > other.get_x2()) {
			return this.get_y2() > other.get_y2();
		} else {
			return false;
		}
	}
	,contains: function(point) {
		var val = point.x;
		if(val >= this.x && val < this.x + this.width) {
			var val = point.y;
			if(val >= this.y) {
				return val < this.y + this.height;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	,__class__: common_Rectangle
};
