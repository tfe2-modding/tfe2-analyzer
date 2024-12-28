var simulation_SchoolAssigner = $hxClasses["simulation.SchoolAssigner"] = function(city,simulation) {
	this.schoolsShouldBeUpdated = false;
	this.city = city;
	this.simulation = simulation;
};
simulation_SchoolAssigner.__name__ = "simulation.SchoolAssigner";
simulation_SchoolAssigner.prototype = {
	assignSchools: function() {
		if(this.schoolsShouldBeUpdated) {
			var _g = [];
			var _g1 = 0;
			var _g2 = this.city.permanents;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				var schoolsThatAcceptStudents;
				if(!v.is(buildings_School)) {
					schoolsThatAcceptStudents = false;
				} else {
					var schoolP = v;
					schoolsThatAcceptStudents = schoolP.students.length < schoolP.get_studentCapacity() && schoolP.workers.length > 0;
				}
				if(schoolsThatAcceptStudents) {
					_g.push(v);
				}
			}
			var schoolsThatAcceptStudents = _g;
			if(schoolsThatAcceptStudents.length >= 0) {
				schoolsThatAcceptStudents.sort(function(s1,s2) {
					return s1.students.length - s2.students.length;
				});
				var _g = 0;
				var _g1 = schoolsThatAcceptStudents.length;
				while(_g < _g1) {
					var i = _g++;
					var school = schoolsThatAcceptStudents[i];
					if(school.is(buildings_HackerSchool)) {
						schoolsThatAcceptStudents[i] = schoolsThatAcceptStudents[schoolsThatAcceptStudents.length - 1];
						schoolsThatAcceptStudents[schoolsThatAcceptStudents.length - 1] = school;
						break;
					}
				}
				var _g = [];
				var _g1 = 0;
				var _g2 = this.city.simulation.citizens;
				while(_g1 < _g2.length) {
					var v = _g2[_g1];
					++_g1;
					if(v.get_age() < 16 && v.school == null) {
						_g.push(v);
					}
				}
				var possibleStudents = _g;
				var anyAssigned = true;
				while(possibleStudents.length > 0 && anyAssigned) {
					anyAssigned = false;
					var i = schoolsThatAcceptStudents.length;
					while(--i >= 0) {
						var school = [schoolsThatAcceptStudents[i]];
						var correctStudent = Lambda.find(possibleStudents,(function(school) {
							return function(s) {
								if(s.getShard() != school[0].shardId) {
									if(s.home != null && s.home.get_hasPrivateTeleporter()) {
										return school[0].world.hasTeleporterOnGroup;
									} else {
										return false;
									}
								} else {
									return true;
								}
							};
						})(school));
						if(correctStudent != null) {
							anyAssigned = true;
							HxOverrides.remove(possibleStudents,correctStudent);
							correctStudent.school = school[0];
							school[0].students.push(correctStudent);
							if(school[0].students.length >= school[0].get_studentCapacity()) {
								schoolsThatAcceptStudents.splice(i,1);
							}
						}
						if(possibleStudents.length == 0) {
							break;
						}
					}
				}
			}
			this.schoolsShouldBeUpdated = false;
		}
	}
	,__class__: simulation_SchoolAssigner
};
