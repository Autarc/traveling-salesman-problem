/**
 *  Configurations
 *  ==============
 *
 *
 */

define({

  //
  debug: 0,

  live: 'https://autarc.github.io/traveling-salesman-problem/',

  //
  source: 'data/tsp_Brazil.txt',


  // element styling
  visual: {

    city: {
      size: 10,
      color: 'red'
    },

    cityVisited: {
      size: 10,
      color: 'grey'
    }
  },


  //
  SA: {
    temperature: 10000,
    coolingRate: 0.9999,
    absoluteTemperature: 0.00001
  },

  //
  EV: {
    maxGenerations: 10
  },

  //
  GEN: {
    maxGenerations: 10,
    population: 100,
    reproduction: 0.1,
    crossover: 0.6,
    mutation: 0.3
  }

});
