module.exports = function (mainSchema, num) {
	const mongoose = require('mongoose');
	const exc = [ '_id', 'id', '__v' ];

	let randomDate = (start, end) => {
		if (start === undefined) {
			start = new Date(1970);
		}
		if (end === undefined) {
			end = new Date();
		}
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	};

	let gen = {
		objectid : function () {
			return mongoose.Types.ObjectId();
		},
		date : function () {
			return randomDate().toISOString();
		},
		boolean : function () {
			return (Math.random() < 0.5);
		},
		bool : function () {
			return (Math.random() < 0.5);
		},
		number : function () {
			return Number(
				Math.random()
					.toString()
					.split('.')[ 1 ]);
		},
		string : function () {
			return Math.random()
				.toString(36)
				.replace(/[^a-z]+/g, '');
		},
		array : function () {
			return new Array(num);
		}
	};

	let get = something => {
		return Promise.resolve()
			.then(() => {
				let name;
				if (!something) {
					return something;
				}
				if (something.name !== undefined) {
					name = something.name;
				} else if (something.type !== undefined && something.type.name) {
					name = something.type.name;
				} else if (something instanceof Array) {
					return initArray(something);
				} else if (typeof something === 'object' && something instanceof Object === true) {
					return initObject(something);
				} else {
					console.log(something.length, typeof something, something instanceof Object);
				}
				if (name !== undefined) {
					name = name.toString().toLowerCase();
				}
				if (gen[ name ] !== undefined) {
					let simple = gen[ name ]();
					return simple;
				}
				return 'type_not_found: ' + something;
			});
	};

	let initObject = schema => {
		let obj = {};
		let promises = Object.keys(schema).map(prop => {
			if (exc.indexOf(prop) !== -1) {
				return null;
			}
			return get(schema[ prop ])
				.then(result => {
					obj[ prop ] = result;
					return null;
				});
		});
		return Promise.all(promises)
			.then(() => {
				return obj;
			});
	};

	let initArray = schema => {
		let promises = Array.apply(null, { length: num }).map(() => {
			if (schema[ 0 ]) {
				return get(schema[ 0 ]);
			} else {
				return 'missing schema';
			}
		});
		return Promise.all(promises)
			.then(results => {
				return results.filter(result => {
					return result !== 'missing schema';
				});
			});
	};

	let initSchema = schema => {
		let promises = Array.apply(null, { length: num })
			.map(() => {
				if (schema) {
					return get(schema);
				} else {
					return 'missing schema';
				}
			});
		return Promise.all(promises)
			.then(results => {
				return results.filter(result => {
					return result !== 'missing schema';
				});
			});
	};

	let checkSchema = schema => {
		return Promise.resolve()
			.then(() => {
				if (!schema) {
					return Promise.reject('invalid schema');
				} else if ((typeof schema === 'object' &&
					schema instanceof Object === true &&
					Object.keys(schema).length) ||
					(schema instanceof Array &&
					schema.length)) {
					return initSchema(schema);
				} else {
					return Promise.reject('invalid schema');
				}
			});
	};

	let checkNum = schema => {
		return new Promise((resolve) => {
			if (num &&
				!isNaN(num) &&
				num > 0) {
				return resolve(num);
			} else {
				return resolve(Math.round(Math.random() * 10));
			}
		})
			.then(newNum => {
				num = newNum;
				return schema;
			});
	};

	let mainInit = schema => {
		return checkNum(schema)
			.then(checkSchema);
	};

	return mainInit(mainSchema);// start init
};
