var haxe_ds_List = $hxClasses["haxe.ds.List"] = function() {
	this.length = 0;
};
haxe_ds_List.__name__ = "haxe.ds.List";
haxe_ds_List.prototype = {
	add: function(item) {
		var x = new haxe_ds__$List_ListNode(item,null);
		if(this.h == null) {
			this.h = x;
		} else {
			this.q.next = x;
		}
		this.q = x;
		this.length++;
	}
	,iterator: function() {
		return new haxe_ds__$List_ListIterator(this.h);
	}
	,__class__: haxe_ds_List
};
var haxe_ds__$List_ListNode = $hxClasses["haxe.ds._List.ListNode"] = function(item,next) {
	this.item = item;
	this.next = next;
};
haxe_ds__$List_ListNode.__name__ = "haxe.ds._List.ListNode";
haxe_ds__$List_ListNode.prototype = {
	__class__: haxe_ds__$List_ListNode
};
var haxe_ds__$List_ListIterator = $hxClasses["haxe.ds._List.ListIterator"] = function(head) {
	this.head = head;
};
haxe_ds__$List_ListIterator.__name__ = "haxe.ds._List.ListIterator";
haxe_ds__$List_ListIterator.prototype = {
	hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		var val = this.head.item;
		this.head = this.head.next;
		return val;
	}
	,__class__: haxe_ds__$List_ListIterator
};
