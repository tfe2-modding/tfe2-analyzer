var polygonal_ds_ArrayedQueueIterator = $hxClasses["polygonal.ds.ArrayedQueueIterator"] = function(x) {
	this.mObject = x;
	this.reset();
};
polygonal_ds_ArrayedQueueIterator.__name__ = "polygonal.ds.ArrayedQueueIterator";
polygonal_ds_ArrayedQueueIterator.__interfaces__ = [polygonal_ds_Itr];
polygonal_ds_ArrayedQueueIterator.prototype = {
	reset: function() {
		this.mFront = this.mObject.mFront;
		this.mCapacity = this.mObject.capacity;
		this.mSize = this.mObject.mSize;
		this.mI = 0;
		this.mData = this.mObject.mData.slice();
		return this;
	}
	,hasNext: function() {
		return this.mI < this.mSize;
	}
	,next: function() {
		return this.mData[(this.mI++ + this.mFront) % this.mCapacity];
	}
	,__class__: polygonal_ds_ArrayedQueueIterator
};
