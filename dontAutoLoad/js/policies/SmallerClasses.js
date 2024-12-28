var policies_SmallerClasses = $hxClasses["policies.SmallerClasses"] = function() {
	policies_Policy.call(this);
};
policies_SmallerClasses.__name__ = "policies.SmallerClasses";
policies_SmallerClasses.__super__ = policies_Policy;
policies_SmallerClasses.prototype = $extend(policies_Policy.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.policies.vars.schoolClassSizeMod = 0.6666667;
		city.simulation.schoolAssigner.schoolsShouldBeUpdated = true;
		city.policies.vars.schoolMaxEdu = 1.15;
		var _g = 0;
		var _g1 = city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(pm.is(buildings_School)) {
				var pmSchool = pm;
				while(pmSchool.students.length > pmSchool.get_studentCapacity()) pmSchool.students[pmSchool.students.length - 1].leaveSchool();
			}
		}
	}
	,destroy: function() {
		this.city.policies.vars.schoolClassSizeMod = 1;
		this.city.simulation.schoolAssigner.schoolsShouldBeUpdated = true;
		this.city.policies.vars.schoolMaxEdu = 1;
	}
	,__class__: policies_SmallerClasses
});
