(function(module){


	module.exports = {
		/**
		 *
		 * @param {Object} onObject
		 * @param {String} propName
		 */
		record: function(onObject, propName) {
			var isRunning = true;
			var original = onObject[propName];
			if (typeof original !== 'function') {
				throw new TypeError('Property specified is not a function, but ' + typeof original);
			}
			var recording = {};

			var startTime = Date.now();

			onObject[propName] = function() {
				var args = Array.prototype.slice.call(arguments, 0);
				var timeElapsed = Date.now() - startTime;
				if (!recording[timeElapsed]) {
					recording[timeElapsed] = [];
				}
				recording[timeElapsed].push({this: this, args: args});

				original.apply(this, args);
			};

			var recorder = {
				stop: function() {
					onObject[propName] = original;
					isRunning = false;
					return recording;
				},
				get recording(){
					return recording;
				},
				/**
				 * replays the recorded function calls
				 */
				replay: function() {
					if (isRunning) {
						recorder.stop();
					}

					Object.keys(recording).forEach(function(time) {
						var arrOfCalls = recording[time];
						setTimeout(function() {
							var callIndex = 0;
							while(callIndex < arrOfCalls.length) {
								var call = arrOfCalls[callIndex];
								original.apply(call.this, call.args);
								callIndex++;
							}
						}, time);
					});
				}
			};

			return recorder;
		},
		/**
		 * replays function call by providing an object with all args passed in time to the function
		 * @param {Function} fn
		 * @param {Object} ctx
		 * @param {Object<String,Array<Object>>} argsInTime
		 */
		replay: function(fn, ctx, argsInTime) {
			//TODO implement
		}
	};


})(typeof exports === 'undefined'? this['fnCallRecorder']={}:module);
