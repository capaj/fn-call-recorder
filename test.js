var recorder = require('./fn-call-recorder');

module.exports = {
	basic: function(test) {
		var num = 0;
		GLOBAL.addTest = function(addition) {
			console.log("adding " + addition);
			num += addition;
		};

		var rec = recorder.record(GLOBAL, 'addTest');
		addTest(2);
		setTimeout(function() {
			addTest(3);

			setTimeout(function() {
				rec.replay();
				setTimeout(function() {
					console.dir(rec.recording);
					test.equals(rec.recording[0][0].args[0], 2);	//this can fail while debugging because it is not as fast

					test.equals(num, 10);
					test.done();
				}, 300)
			}, 50)
		}, 250);

	}
};