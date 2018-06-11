'use strict';

// Helper function to create an immutable enum
module.exports = (name, args) => {
	const obj = {};
	args.forEach(a => obj[a] = `${name}.${a}`);
	return Object.freeze(obj);
};
