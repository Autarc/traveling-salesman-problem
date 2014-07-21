/**
 *  Utilities
 *  =========
 *
 *
 */

define(function(){

  /**
   *  [getPos description]
   *
   *  @param  {[type]} e       [description]
   *  @param  {[type]} offsetX [description]
   *  @param  {[type]} offsetY [description]
   *  @return {[type]}         [description]
   */
  function getPos (e, offsetX, offsetY) {

    var src = e.currentTarget,
        el  = src;

    var totalOffsetX = offsetX || 0,
        totalOffsetY = offsetY || 0;

    do {

      totalOffsetX += el.offsetLeft;
      totalOffsetY += el.offsetTop;

    } while ( el = el.offsetParent );

    var posX = e.pageX - totalOffsetX,
        posY = e.pageY - totalOffsetY;

    return {
      'x': posX,
      'y': posY
    };
  }

  return {
  	getPos: getPos
  }

});
