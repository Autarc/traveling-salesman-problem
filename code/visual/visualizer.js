/**
 *  Visualizer
 *  ==========
 *
 *
 */

define(function (require) {

	var utils = require('../core/utils');
	var logic = require('../algo/logic');


	/**
	 *  [Visualizer description]
	 */
	var Visualizer = function (config) {

		this.intro = true;
		this.allowInput = false;
		this.distance = 0;
		this.route = [];

		this.size = config.city.size;
		this.offset = this.size/2;

		this.create(config.element);
		this.render();
	};


	/**
	 *  Invoke a canvas
	 *
	 *  @param  {[type]} elementID [description]
	 */
	Visualizer.prototype.create = function (elementID) {

		var cvs = document.createElement('canvas'),
				ctx = cvs.getContext('2d');

		var width = 1000;
		var height = 1000;

		cvs.width = width;
		cvs.height = height;

		this.ctx = ctx;

		document.getElementById(elementID||'canvas-wrapper').appendChild(cvs);
	};


	/**
	 *  [render description]
	 *
	 *  @return {[type]} [description]
	 */
	Visualizer.prototype.render = function(){


	  // /**
	  //  *  [loop description]
	  //  *
	  //  *  @return {[type]} [description]
	  //  */

	  //   var LAPSE = this.lapse,

	  //       diff = 0,
	  //       last = performance.now(),
	  //       curr, delta,  // time
	  //       frame;

	  //   loop.call(this);


	  //   /**
	  //    *  [loop description]
	  //    *
	  //    *  @return {[type]} [description]
	  //    */
	  //   function loop(){

	  //     curr  = performance.now();
	  //     delta = curr - last;
	  //     last  = curr;

	  //     diff += delta;

	  //     while ( diff > LAPSE ) {

	  //       diff -= LAPSE;

	  //       update.call( this, LAPSE );
	  //     }

	  //     update.call( this, diff );

	  //     render.call( this );

	  //     frame = requestAnimationFrame( loop.bind(this) );
	  //   }
	  // };
	};

	/**
	 *  Called on loaded data
	 */
	Visualizer.prototype.setData = function(){

		this.cityMap = Object.create(null);

		logic.data.cities.forEach(function(city) {
			if (!this.cityMap[city.x]) this.cityMap[city.x] = {};
			if (!this.cityMap[city.x][city.y]) this.cityMap[city.x][city.y] = [];
			this.cityMap[city.x][city.y].push(city.id);
		}, this);
	};


	/**
	 *  [setupHandler description]
	 */
	Visualizer.prototype.setupHandler = function(){
		var cvs = this.ctx.canvas;

		var route = this.temp = [];
		var distance = 0;

		var cities = logic.data.cities;

		cvs.addEventListener('click', function(e) {

			if (!this.allowInput) return;

			var pos = utils.getPos(e);
			var match = this.getIntersection(pos);

			if (!match || route.indexOf(match) > -1) return;

			route.push(match);


			var temp = route.map(function (id) {
				return cities[id-1];
			});

			this.updateHistory(temp, null, 'user');

			if (route.length < 2) return;

			var last = route[route.length-2];

			last = cities[last-1];
			match = cities[match-1];

			this.ctx.strokeStyle = 'black';
			this.ctx.beginPath();
			this.ctx.moveTo(last.x, last.y);
			this.ctx.lineTo(match.x, match.y);
			this.ctx.closePath();
			this.ctx.stroke();

			// distance += this.distances[last.id-1][match.id-1];
			// console.log(distance, route.length, this.cities.length)

			if (route.length === cities.length) {
				last = route[route.length-1];
				match = route[0];

				last = cities[last-1];
				match = cities[match-1];

				this.ctx.beginPath();
				this.ctx.moveTo(last.x, last.y);
				this.ctx.lineTo(match.x, match.y);
				this.ctx.closePath();
				this.ctx.stroke();

				// distance += this.distances[last.id-1][match.id-1];
				route = route.map(function(id){
					return cities[id-1];
				});

				var distance = logic.getDistance(route);

				this.distance= distance;
				this.route=route;
				this.updateHistory(null, null, 'user');
			}

		}.bind(this));
	};

	/**
	 *  [getIntersection description]
	 *
	 *  @param  {[type]} pos [description]
	 *  @return {[type]}     [description]
	 */
	Visualizer.prototype.getIntersection = function(pos){

		var offset = this.offset;

		var coords = this.cityMap;
		var coordsX = Object.keys(coords);

		var minX = pos.x - offset,
			maxX = pos.x + offset,
			minY = pos.y - offset,
			maxY = pos.y + offset;

		var matches = [];

		coordsX.forEach(function(posX){
			posX = parseFloat(posX);
			if (posX >= minX && posX < maxX) {
				var list = coords[posX];
				var coordsY = Object.keys(list);
				coordsY.forEach(function(posY){
					posY = parseFloat(posY);
					if (posY >= minY && posY < maxY) {
						matches.push(list[posY]);
					}
				});
			}
		});

		if (matches.length) {
			matches = matches.reduce(function(curr, next){
				return curr.concat(next);
			});
		}

		return matches[0];
	};


	/**
	 *  [clear description]
	 */
	Visualizer.prototype.clear = function(){
		var cvs = this.ctx.canvas;
		this.ctx.clearRect(0, 0, cvs.width, cvs.height);
	};


	/**
	 *  [drawCities description]
	 */
	Visualizer.prototype.drawCities = function() {
		var cities = logic.data.cities;
		var ctx = this.ctx;

		var size = this.size;
		var offset = this.offset;
		var color = 'blue';

		ctx.fillStyle = color;

		cities.forEach(function(city, i) {


			if(!this.intro){

						// ctx.beginPath();
						// ctx.arc(city.x - offset, city.y - offset, size, 0, Math.PI * 2);
						// ctx.closePath();
						// ctx.fill();

						ctx.fillRect(city.x - offset, city.y - offset, size, size);
					// });

			} else {

				setTimeout(function(i){

						// ctx.beginPath();
						// ctx.arc(city.x - offset, city.y - offset, size, 0, Math.PI * 2);
						// ctx.closePath();
						// ctx.fill();

						ctx.fillRect(city.x - offset, city.y - offset, size, size);
					// });

				}, 16.67 * i);
			}

		}.bind(this));


		if(this.intro) {
			this.intro = false;
		}

	};


	/**
	 *  [drawRoute description]
	 *
	 *  @param  {[type]} route [description]
	 *  @param  {[type]} color [description]
	 *  @param  {[type]} start [description]
	 */
	Visualizer.prototype.drawRoute = function(route, color, start){

		route = route.slice();

		var ctx = this.ctx;
		var offset = this.offset;

		var size = route.length - 1;
		var previous = route.shift();
		var target;

		this.clear();

		ctx.beginPath();
		ctx.moveTo(previous.x + offset, previous.y + offset);

		ctx.fillStyle = start || 'red';
		ctx.strokeStyle = color || 'black';

		// TODO: fix stat size
		ctx.fillRect(previous.x - offset, previous.y - offset, this.size*2, this.size*2);

		while (size > 0) {
			size--;
			target = route.shift();

			// Add Up distance
			// distance += this.distances[previous.id-1][target.id-1]
			// draw
			ctx.lineTo(target.x + offset, target.y + offset);
			previous = target;
		}

		// distance += this.distances[route[0].id-1][route[route.length-1].id-1];
		ctx.closePath();
		ctx.stroke();

		this.drawCities()
	};


	/**
	 *  [randomConnect description]
	 */
	Visualizer.prototype.randomConnect = function () {

		this.allowInput = false;

		var list = logic.getRandomRoute();
		var route = list.slice();

		this.route = list;
		// this.distance = logic.getDistance(list); //

		this.drawRoute(route, 'black');
		this.updateHistory(null, null, 'random');
	};


	/**
	 *  [enableUserConnect description]
	 */
	Visualizer.prototype.enableUserConnect = function(){

		this.clear();
		this.drawCities();

		this.allowInput = true;

		this.route.length = 0;
		this.temp.length = 0;
		// this.updateHistory(null, null, 'user');
	};


	/**
	 *  [updateHistory description]
	 *
	 *  @param  {[type]} route    [description]
	 *  @param  {[type]} distance [description]
	 */
	Visualizer.prototype.updateHistory = function(route, distance, algorithm, time){

		var statsDistance = document.getElementById('stats-distance');
		var statsHistory = document.getElementById('stats-history');
		var statsAlgo = document.getElementById('stats-algo');
		var statsTime = document.getElementById('stats-time');

		if (route) this.route = route;

		this.distance = logic.getDistance(this.route);

		if (distance != void 0) this.distance = distance;

		var text = this.route.map(function(city){
			return '<li>' + (city.id || city) + '</li>';
		}).join(' - ');

		statsAlgo.textContent = 'Algorithm: ' + algorithm || '';
		statsDistance.textContent = 'Distance: ' + this.distance;
		statsHistory.innerHTML = text; // route


		text = '';

		if (time != void 0) {
			text = 'Time: ' + time;
		}

		statsTime.textContent = text;
	};


	return Visualizer;

});
