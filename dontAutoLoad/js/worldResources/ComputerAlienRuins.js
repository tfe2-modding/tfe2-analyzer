var worldResources_ComputerAlienRuins = $hxClasses["worldResources.ComputerAlienRuins"] = function(game,id,city,world,position,worldPosition,stage) {
	worldResources_AlienRuins.call(this,game,id,city,world,position,worldPosition,stage,"spr_alienruins_3");
};
worldResources_ComputerAlienRuins.__name__ = "worldResources.ComputerAlienRuins";
worldResources_ComputerAlienRuins.__super__ = worldResources_AlienRuins;
worldResources_ComputerAlienRuins.prototype = $extend(worldResources_AlienRuins.prototype,{
	get_climbX: function() {
		return 9;
	}
	,get_climbY: function() {
		return 15;
	}
	,getBonuses: function(bonusNumber) {
		var _gthis = this;
		var createBonus = function(name,description,onGet) {
			return { name : name, description : description, onGet : onGet};
		};
		var createMatBonus = function(name,description,mat) {
			return { name : name, description : description, onGet : function() {
				_gthis.city.materials.add(mat);
				mat.addToProduction(_gthis.city.simulation.stats);
			}};
		};
		switch(bonusNumber) {
		case 0:
			return [createMatBonus(common_Localize.lo("alien_ruins_find_1e"),common_Localize.lo("alien_ruins_description_1e"),new Materials(0,35))];
		case 1:
			return [createMatBonus(common_Localize.lo("alien_ruins_find_2e"),common_Localize.lo("alien_ruins_description_2e"),new Materials(0,0,55))];
		case 2:
			return [createMatBonus(common_Localize.lo("alien_ruins_find_3e"),common_Localize.lo("alien_ruins_description_3e"),new Materials(0,0,0,7))];
		case 3:
			return [createBonus(common_Localize.lo("alien_ruins_find_4e"),common_Localize.lo("alien_ruins_description_4e"),function() {
			})];
		default:
			return [];
		}
	}
	,__class__: worldResources_ComputerAlienRuins
});
