var d3 = require("d3");
var build_single_dendro_slider = require('./build_single_dendro_slider');

module.exports = function build_dendrogram_sliders(){

  var cgm = this;
  var params = cgm.params;
  var regl = cgm.regl;

  // Add sliders on top of the canvas
  /////////////////////////////////////
  const slider_length = 130;
  const slider_width = 25;

  // slider containers

  var axis_slider_container;
  var inst_top;
  var inst_left;
  var inst_rotate;

  // hardwiring dendro slider position
  _.each(['row', 'col'], function(inst_axis){

    if (inst_axis === 'row'){
      inst_top = 175;
      inst_left = params.viz_width - slider_width;
    } else {
      inst_top = params.viz_height - (slider_length / 2) - slider_width;
      // inst_top = 795;
      inst_left = 55;
    }
    console.log(inst_top, inst_left)

    axis_slider_container = d3.select(params.root + ' .canvas-container')
      .append('svg')
      .style('height', slider_length + 'px')
      .style('width', (slider_width-5) + 'px')
      .style('position', 'absolute')
      .style('top', inst_top + 'px')
      .style('left', inst_left + 'px')
      .attr('class', inst_axis + '_dendro_slider_svg')
      .attr('transform', function(){
        if (inst_axis === 'row'){
          inst_rotate = 0;
        } else {
          inst_rotate = -90;
        }
        return 'rotate('+ inst_rotate +')';
      });

    axis_slider_container
      .append('rect')
      .style('height', slider_length + 'px')
      .style('width', slider_width + 'px')
      .style('fill', 'white');

    build_single_dendro_slider(cgm, inst_axis);
  });

}
