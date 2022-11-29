var d3 = require("d3");
module.exports = function ini_canvas_mouseover(){

  var params = this.params;

  d3.select(params.root + ' .canvas-container canvas')
    .on('mouseover', function(){
      params.tooltip.on_canvas = true;
    })
    .on('mouseout', function(){
      params.tooltip.on_canvas = false;
    });

};
