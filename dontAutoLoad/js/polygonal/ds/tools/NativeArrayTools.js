var polygonal_ds_tools_NativeArrayTools = $hxClasses["polygonal.ds.tools.NativeArrayTools"] = function() { };
polygonal_ds_tools_NativeArrayTools.__name__ = "polygonal.ds.tools.NativeArrayTools";
polygonal_ds_tools_NativeArrayTools.blit = function(src,srcPos,dst,dstPos,n) {
	if(n > 0) {
		if(src == dst) {
			if(srcPos < dstPos) {
				var i = srcPos + n;
				var j = dstPos + n;
				var _g = 0;
				var _g1 = n;
				while(_g < _g1) {
					var k = _g++;
					--i;
					--j;
					src[j] = src[i];
				}
			} else if(srcPos > dstPos) {
				var i = srcPos;
				var j = dstPos;
				var _g = 0;
				var _g1 = n;
				while(_g < _g1) {
					var k = _g++;
					src[j] = src[i];
					++i;
					++j;
				}
			}
		} else if(srcPos == 0 && dstPos == 0) {
			var _g = 0;
			var _g1 = n;
			while(_g < _g1) {
				var i = _g++;
				dst[i] = src[i];
			}
		} else if(srcPos == 0) {
			var _g = 0;
			var _g1 = n;
			while(_g < _g1) {
				var i = _g++;
				dst[dstPos + i] = src[i];
			}
		} else if(dstPos == 0) {
			var _g = 0;
			var _g1 = n;
			while(_g < _g1) {
				var i = _g++;
				dst[i] = src[srcPos + i];
			}
		} else {
			var _g = 0;
			var _g1 = n;
			while(_g < _g1) {
				var i = _g++;
				dst[dstPos + i] = src[srcPos + i];
			}
		}
	}
};
polygonal_ds_tools_NativeArrayTools.nullify = function(a,first,n) {
	if(n == null) {
		n = 0;
	}
	if(first == null) {
		first = 0;
	}
	var min = first;
	var max = n <= 0 ? a.length : min + n;
	while(min < max) a[min++] = null;
	return a;
};
