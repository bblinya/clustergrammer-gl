var d3 = require("d3");
module.exports = function initialize_containers(){

  var base_container = this.args.container;

  d3.select(base_container)
    // .style("padding-left", "10px")
    // .style("padding-top", "10px")
    // .style("width", "100%")
    // .style("height", "100%")
  ;
    

  // make control panel (needs to appear above canvas)
  d3.select(base_container)
    .append('div')
    .attr('class', 'control-container')
    .style('cursor', 'default');

  d3.select(base_container)
    .append('div')
    .attr('class', 'v1-control-container')
    .style('cursor', 'default');

  // make canvas container
  var inst_height = this.args.viz_height;
  const canvas_container = d3.select(base_container)
    .append('div')
    .attr('class', 'canvas-container')
    .style('position', 'relative')
    .style('cursor', 'default')
    .style('width', '100%')
    .style('height', inst_height + "px")
  ;

  // var inst_width  = this.params.viz_width;

  // d3.select(canvas_container)
  //   .style('height',inst_height + 'px')
  //   .style("width", "100%");
    // .style('height',inst_height + 'px')
    // .style('width',inst_width+'px');

  // console.log(canvas_container)
  this.canvas_container = canvas_container.node();
  // return canvas_container;
};
