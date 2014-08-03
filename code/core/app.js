/**
 *  App
 *  ===
 *
 *
 */

// time

// cvs:
// -
// -
//

define(function (require) {

	// var Interface = require('../visual/interface');
	var Visualizer = require('../visual/visualizer');
	var logic = require('../algo/logic');


	/**
	 *  [App description]
	 */
	var App = function (config, path) {

		this.debug = config.debug;
		this.live = config.live;
		this.report = [];
		this.latest = null;

		// this.interface = new Interface(config);
		this.visualizer = new Visualizer(config.visual);

		this.initElements(config);
		this.setupHandler();
		this.loadData(config.source, path);
	};


	/**
	 *  [initElements description]
	 *
	 *  @param  {[type]} config [description]
	 *  @return {[type]}        [description]
	 */
	App.prototype.initElements = function (config) {
		this.refs = {

			debug: document.getElementById('debug'),

			random:  document.getElementById('random'),
			user: document.getElementById('user'),
			force: document.getElementById('force'),
			csv: document.getElementById('csv'),

			SA: {
				form: document.getElementById('SA-form'),
				temperature: document.getElementById('SA-temperature'),
				coolingRate: document.getElementById('SA-coolingRate'),
				absoluteTemperature: document.getElementById('SA-absoluteTemperature')
			},

			EV: {
				form: document.getElementById('EV-form'),
				maxGenerations: document.getElementById('EV-maxGenerations')
			},

		  GEN: {
		  	form: document.getElementById('GEN-form'),
		    maxGenerations: document.getElementById('GEN-maxGenerations'),
		    population: document.getElementById('GEN-population'),
		    reproduction: document.getElementById('GEN-reproduction'),
		    crossover: document.getElementById('GEN-crossover'),
		    mutation: document.getElementById('GEN-mutation')
		  }

		};

		var options = [
			'temperature',
			'coolingRate',
			'absoluteTemperature'
		];

		options.forEach(function (option) {
			this.refs.SA[option].value = config.SA[option];
		}.bind(this));

		this.refs.EV.maxGenerations.value = config.EV.maxGenerations;

		options = [
			'maxGenerations',
			'population',
			'reproduction',
			'crossover',
			'mutation'
		];

		options.forEach(function (option) {
			this.refs.GEN[option].value = config.GEN[option];
		}.bind(this));
	};


	/**
	 *  [setupHandler description]
	 *
	 *  @return {[type]} [description]
	 */
	App.prototype.setupHandler = function(){

		if (this.refs.debug) {
			this.refs.debug.addEventListener('change', function(e){
				var active = e.currentTarget.checked;
				// console.log('debug', active);
				// if (active) this.debug = this.config.debug;
			});
		}

		this.refs.random.addEventListener('click', function(){
			this.visualizer.randomConnect();
		}.bind(this));

		this.refs.user.addEventListener('click', function(){
			this.visualizer.enableUserConnect();
		}.bind(this));

		this.refs.force.addEventListener('click', function(){
			var time = Date.now();
			logic.bruteForce(function (results) {
				time = Date.now() - time;
				this.visualizer.updateHistory(results.route, results.distance, 'Brute Force', time);
				this.visualizer.drawRoute(results.route, 'red');
			}.bind(this));
		}.bind(this));


		if (URL) {

			this.refs.csv.addEventListener('click', function(){
				var name = this.latest || 'Traveling-Salesman-Problem';

				var text =  this.report.join('\r\n\r\n');

				var link = document.createElement('a'),
						blob = new Blob([ text ], { type: 'plain/text' });

				url = URL.createObjectURL(blob);

				link.setAttribute('download', name + '.csv');
				link.setAttribute('href', url);

				link.dispatchEvent(new Event('click'));
	    	URL.revokeObjectURL(url);
		  }.bind(this));
		}



		var SA = this.refs.SA;

		// submit - input
		SA.form.addEventListener('submit', function(e) {
			e.preventDefault();

			var params = {
				temperature: parseFloat(SA.temperature.value),
				coolingRate: parseFloat(SA.coolingRate.value),
				absoluteTemperature: parseFloat(SA.absoluteTemperature.value)
			};

			var time = Date.now();
			var results = logic.simulatedAnnealing(params);
			time = Date.now() - time;



			var route = results.route.map(function (city) {
				return city.id;
			}).join('-');

			// temperature // coolingRate // absoluteTemperature // time // distance // route
			var measurements = [
				params.temperature,
				params.coolingRate,
				params.absoluteTemperature,
				time,
				results.distance,
				this.live + '#' + route
			].join(',');

			this.report.push(measurements);

			this.latest = 'Simulated-Annealing';



			this.visualizer.updateHistory(results.route, results.distance, 'Simulated Annealing', time);
			this.visualizer.drawRoute(results.route, 'green');

		}.bind(this));

		var EV = this.refs.EV;

		//
		EV.form.addEventListener('submit', function(e){
			e.preventDefault();

			var params = {
				generations: parseFloat(EV.maxGenerations.value)
			};

			var time = Date.now();
			var results = logic.evolutionary(params);
			time = Date.now() - time;



			var route = results.route.map(function (city) {
				return city.id;
			}).join('-');

			// generations // time // distance // route
			var measurements = [
				params.generations,
				time,
				results.distance,
				this.live + '#' + route
			].join(',');

			this.report.push(measurements);

			this.latest = 'Evolutionary';



			this.visualizer.updateHistory(results.route, results.distance, 'Evolutionary', time);
			this.visualizer.drawRoute(results.route, 'purple');
		}.bind(this));


		var GEN = this.refs.GEN;

		//
		GEN.form.addEventListener('submit', function (e) {
			e.preventDefault();

			var params = {
				generations: parseFloat(GEN.maxGenerations.value),
				population: parseFloat(GEN.population.value),
				p: {
					reproduction: parseFloat(GEN.reproduction.value),
					crossover: parseFloat(GEN.crossover.value),
					mutation: parseFloat(GEN.mutation.value)
				}
			};

			var time = Date.now();
			var results = logic.genetic(params);
			time = Date.now() - time;



			var route = results.route.map(function (city) {
				return city.id;
			}).join('-');

			// maxGenerations // population // reproduction // crossover // mutation // time // distance // route
			var measurements = [
				params.generations,
			  params.population,
				params.p.reproduction,
				params.p.crossover,
				params.p.mutation,
				time,
				results.distance,
				this.live + '#' + route
			].join(',');

			this.report.push(measurements);

			this.latest = 'Genetic';



			this.visualizer.updateHistory(results.route, results.distance, 'Genetic', time);
			this.visualizer.drawRoute(results.route, 'orange');
		}.bind(this));
	};


	/**
	 *  [loadData description]
	 *
	 *  @return {[type]} [description]
	 */
	App.prototype.loadData = function (source, path) {

		var request = new XMLHttpRequest();
		request.open('GET', source);

		request.onload = function formatData(){

			var data = request.response;
			var rows = data.split('\n');

			// delete first and last row
			rows.shift();
			rows.pop();

			logic.prepareCities(rows);
			logic.prepareDistances();

			this.visualizer.setData();
			this.visualizer.setupHandler();
			this.visualizer.drawCities();


			if (path) {

				var route = path.split('-'); // list of city ids

				try {

					route = route.map(function (id) {
						return logic.data.cities[id-1];
					});

					this.visualizer.intro = false;
					this.visualizer.drawRoute(route);
					this.visualizer.updateHistory(route, null, 'link');

				} catch (e) {
					// console.log(e);
				}
			}

		}.bind(this);

		request.send();
	};

	return App;
});
