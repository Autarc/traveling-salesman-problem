/**
 *  App
 *  ===
 *
 *
 */

define(function (require) {

	// var Interface = require('../visual/interface');
	var Visualizer = require('../visual/visualizer');
	var logic = require('../algo/logic');


	/**
	 *  [App description]
	 */
	var App = function (config, path) {

		this.debug = config.debug;

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
			// this.interface.showUserActove();
		}.bind(this));


		var SA = this.refs.SA;

		// submit - input
		SA.form.addEventListener('submit', function(e) {
			e.preventDefault();

			var params = {
				temperature: parseFloat(SA.temperature.value),
				coolingRate: parseFloat(SA.coolingRate.value),
				absoluteTemperature: parseFloat(SA.absoluteTemperature.value)
			};

			var results = logic.simulatedAnnealing(params);

			this.visualizer.updateHistory(results.route, results.distance, 'Simulated Annealing');
			this.visualizer.drawRoute(results.route, 'green');

		}.bind(this));

		var EV = this.refs.EV;

		//
		EV.form.addEventListener('submit', function(e){
			e.preventDefault();

			var params = {
				generations: parseFloat(EV.maxGenerations.value)
			};

			var results = logic.evolutionary(params);

			this.visualizer.updateHistory(results.route, results.distance, 'Evolutionary');
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
					mutation: parseFloat(GEN.mutation.value),
					reproduction: parseFloat(GEN.reproduction.value),
					crossover: parseFloat(GEN.crossover.value)
				}
			};

			var results = logic.genetic(params);

			this.visualizer.updateHistory(results.route, results.distance, 'Genetic');
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

				var route = path.split(','); // list of city ids

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
