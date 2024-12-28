var graphics_ParticleContainerHelper = $hxClasses["graphics.ParticleContainerHelper"] = function() { };
graphics_ParticleContainerHelper.__name__ = "graphics.ParticleContainerHelper";
graphics_ParticleContainerHelper.recreateContainer = function(cnt) {
	var par = cnt.parent;
	var pos = cnt.parent.children.indexOf(cnt);
	cnt.parent.removeChild(cnt);
	par.addChildAt(cnt,pos);
};
