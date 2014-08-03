(function(){

  var cities = [];
  var distances = [];


  // invoke, start
  this.addEventListener('message', function (e) {
    console.log('start');

    // setup
    var args = e.data;
    cities.length = 0;
    cities.push.apply(cities, args[0]);
    distances.length = 0;
    distances.push.apply(distances, args[1])

    // calc
    var list = cities.slice();
    var route = bruteForce([list.shift()], list, []);
    this.postMessage(route);
  });

  this.addEventListener('error', console.error.bind(console));


  /**
   *  [bruteForce description]
   *  @param  {[type]} connectedCities [description]
   *  @param  {[type]} openCities      [description]
   *  @param  {[type]} best            [description]
   *  @return {[type]}                 [description]
   */
  function bruteForce (connectedCities, openCities, best) {
    if (!openCities.length) {
      if (!best.length || getDistance(best) > getDistance(connectedCities)) {
       best = connectedCities.slice();
      }
      return best;
    }

    for (var i = 0, length = openCities.length; i < length; i++) {
      var tmpInList = connectedCities.slice();
      var tmpOutList = openCities.slice();
      var element = tmpOutList.splice(i,1)[0];
      tmpInList.push(element);
      best = bruteForce(tmpInList, tmpOutList, best);
    }

    return best;
  }


  // helper
  function getDistance (route) {
    var distance = 0;
    for (var i = 0; i < route.length-1; i++) {
      var currId = route[i].id   - 1,
          nextId = route[i+1].id - 1;
      distance += distances[currId][nextId];
    }
    currId = route[0].id - 1;
    nextId = route[i].id - 1;
    return distance + distances[currId][nextId];
  }

})();
