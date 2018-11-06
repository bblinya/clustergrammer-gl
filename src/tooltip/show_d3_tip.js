module.exports = function show_d3_tip(params){

  params.tooltip_fun.show('tooltip');

  // var inst_bbox = d3.selectAll('.d3-tip').node().getBBox();

  var mouseover = params.interact.mouseover;

  d3.select('#d3-tip')
    .html(function(){
      var full_string = mouseover.row.name + ' and ' + mouseover.col.name + ' <br> ' +
                        'value: ' + mouseover.value.toFixed(3);

      return full_string;
    });



  console.log(mouseover.row.name, mouseover.col.name)

  var d3_tip_width = parseFloat(d3.select('#d3-tip')
                               .style('width')
                               .replace('px',''));

  var d3_tip_height = parseFloat(d3.select('#d3-tip')
                               .style('height')
                               .replace('px',''));

  // this is necessary to offset hte tooltip correctly, probably due to the
  // padding in the tooltip or some related paramters
  var magic_x_offset = 22;

  cgm.params.d3_tip_width = d3_tip_width

  d3.select('#d3-tip')
    .style('margin-left', function(){
      // var total_x_offset = params.zoom_data.x.cursor_position;
      var total_x_offset = params.zoom_data.x.cursor_position - d3_tip_width + 22;
      return total_x_offset + 'px'
    })
    .style('margin-top', function(){
      // var total_y_offset = params.zoom_data.y.cursor_position;
      var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
      return total_y_offset + 'px'
    })


}