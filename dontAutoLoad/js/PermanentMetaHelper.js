var PermanentMetaHelper = $hxClasses["PermanentMetaHelper"] = function() { };
PermanentMetaHelper.__name__ = "PermanentMetaHelper";
PermanentMetaHelper.getClassIDLength = function() {
	return PermanentMetaHelper.buildingClassesNumber;
};
PermanentMetaHelper.getClassID = function(className) {
	var registeredClassName = PermanentMetaHelper.registeredClassNames.h[className];
	if(registeredClassName != null) {
		return registeredClassName;
	}
	var v = PermanentMetaHelper.buildingClassesNumber;
	PermanentMetaHelper.registeredClassNames.h[className] = v;
	PermanentMetaHelper.buildingClassesNumber++;
	return PermanentMetaHelper.buildingClassesNumber - 1;
};
