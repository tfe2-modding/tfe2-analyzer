var MaterialsHelper = $hxClasses["MaterialsHelper"] = function() { };
MaterialsHelper.__name__ = "MaterialsHelper";
MaterialsHelper.findMaterialIndex = function(materialName) {
	return MaterialsHelper.materialNames.indexOf(materialName);
};
MaterialsHelper.findMaterialName = function(index) {
	return MaterialsHelper.materialNames[index];
};
MaterialsHelper.findMaterialDisplayName = function(index) {
	var nameKey = MaterialsHelper.findMaterialName(index);
	switch(nameKey) {
	case "computerChips":
		nameKey = "computer_chips";
		break;
	case "machineParts":
		nameKey = "machine_parts";
		break;
	case "refinedMetals":
		nameKey = "refined_metals";
		break;
	}
	return common_StringExtensions.firstToUpper(common_Localize.lo(nameKey));
};
Math.__name__ = "Math";
