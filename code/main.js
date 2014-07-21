/**
 *  Main
 *  ====
 *
 *
 */

require(['core/app', 'config'], function (App, config) {

  var path = window.location.hash.substr(1);

  window.app = new App(config, path);
});
