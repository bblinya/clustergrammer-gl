module.exports = function initialize_regl(){

  var canvas_container = this.canvas_container;

  // var canvas = d3.select(canvas_container)
  //   .append("canvas")
  //   .style("width", "100%")
  //   .style("height", "100%")
  //   .node()
  // ;

  // this.resizeCanvasToDisplaySize(canvas);

  var regl = require('regl')({
    extensions: ['angle_instanced_arrays'],
    container: canvas_container,
    // canvas: canvas,
    // pixelRatio: window.devicePixelRatio/10
  });

  this.regl = regl;
};
