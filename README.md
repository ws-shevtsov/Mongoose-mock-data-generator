generator
=========

Mongoose Schema - Mock Data Generator


# This version generate data via promise directly to js array

Example:

```javascript
const generator = require('generator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let schema =  new Schema({
	string  : String,
	date    : Date,
	number  : Number,
	boolean : Boolean,
	array   : [],
	object  : {
		string  : String,
		date    : Date,
		number  : Number,
		boolean : Boolean
	},
	stringArray : [
		String
	],
	dateArray : [
		Date
	],
	numberArray : [
		Number
	],
	booleanArray : [
		Boolean
	],
	objectArray : [
		{
			prop : String
		}
	]
});
let test = mongoose.model('test', schema);

generator(test.schema.tree, 2)
	.then(result => {
		// do somthing
	})
```

# Contributions are welcomed.

This script is very minimalistic, if you like it, or wish to help and get involved suggestions are
welcomed at the issues page https://github.com/ws-shevtsov/generator/issues
