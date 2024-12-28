var testing_PermanentFinderPerfTest = $hxClasses["testing.PermanentFinderPerfTest"] = function() { };
testing_PermanentFinderPerfTest.__name__ = "testing.PermanentFinderPerfTest";
testing_PermanentFinderPerfTest.doTest = function(city) {
	var singleTest = function() {
		var target = random_Random.fromArray(city.permanents);
		city.simulation.permanentFinder.query(random_Random.fromArray(city.permanents),function(pm) {
			return pm == target;
		});
	};
	var tme = window.performance.now();
	var _g = 0;
	while(_g < 10000) {
		var i = _g++;
		singleTest();
	}
	console.log("FloatingSpaceCities/testing/PermanentFinderPerfTest.hx:21:",window.performance.now() - tme);
};
