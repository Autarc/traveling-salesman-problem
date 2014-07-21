/**
 *  City
 *  ====
 *
 *
 */

define(function(require){

	var City = function(id, x, y) {
		this.id = parseFloat(id);
		this.x = parseFloat(x);
		this.y = parseFloat(y);

		return this;
	};

	return City;
});

