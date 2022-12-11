var d3 = require("d3");
var extend = require('xtend/mutable');

module.exports = function calc_vd(regl, params){

  var vd = {};

  var opts = opts || {};
  var options = extend({
      element: opts.element || regl._gl.canvas,
    }, opts || {});
  var element = options.element;

  // vd.canvas = {};
  // _.each(['width', 'height'], function(inst_dim){
  //   vd.canvas[inst_dim] =
  //   vd.canvas[inst_dim] = Number.parseFloat(d3.select(element)
  //     .style(inst_dim).replace('px', ''));
  // });
  vd.canvas = element.getBoundingClientRect();

  var label = {};
  label.x = 'row';
  label.y = 'col';
  var other_label = {};
  other_label.x = 'col';
  other_label.y = 'row';

  var dim = {};
  dim.x = 'width';
  dim.y = 'height';

  vd.mat = {};
  vd.heat = {};
  vd.heat_size = {};
  vd.center = {};
  vd.offcenter = {};
  vd.offset = {};
  vd.shift_camera = {};
  vd.mat_size = {};

  var inst_label;
  var inst_other_label;
  var inst_dim;
  var offset_heat = {};

  var layout = {};
  layout.left = 125;
  layout.top = 125;
  layout.right = 55;
  layout.bottom = 55;

  function calc_layout(size, l, r) {
    var mat_size = size - l - r;
    var mat_scale = mat_size / size;
    var center_offset = l + mat_size / 2 - size / 2;
    var offset_scale  = center_offset / size;

    // var mat_scale = 0.8;
    // var offset_scale = 0.075 / 2;
    return {
      size: mat_size, mat_scale: mat_scale,
      offset: center_offset, offset_scale: offset_scale,
    }
  }

  layout.x = calc_layout(params.viz_width,
    layout.left+1, layout.right+1);
  layout.y = calc_layout(params.viz_height,
    layout.top, layout.bottom);
  vd.layout = layout;

  _.each(['x', 'y'], function(inst_axis){

    inst_label = label[inst_axis];
    inst_other_label = other_label[inst_axis];
    inst_dim = dim[inst_axis];

    // vd.mat_size[inst_axis] = 0.8;
    vd.mat_size[inst_axis] = vd.layout[inst_axis].mat_scale;

    vd.heat_size[inst_axis] = vd.mat_size[inst_axis] -
                              params.cat_data.cat_room[inst_axis] *
                              params.cat_data.cat_num[inst_label];

    // square matrix size set by width of canvas
    vd.mat[inst_dim] = vd.mat_size[inst_axis] * vd.canvas[inst_dim]

    // min and max position of matrix
    vd.mat[inst_axis] = {};
    vd.mat[inst_axis].min = vd.canvas[inst_dim]/2 - vd.mat[inst_dim]/2;
    vd.mat[inst_axis].max = vd.canvas[inst_dim]/2 + vd.mat[inst_dim]/2;

    vd.heat[inst_dim] = vd.heat_size[inst_axis] * vd.canvas[inst_dim]

    offset_heat[inst_axis] = (vd.mat[inst_dim] - vd.heat[inst_dim])/2;
    vd.heat[inst_axis] = {};
    vd.heat[inst_axis].min = vd.canvas[inst_dim]/2 - vd.heat[inst_dim]/2 + offset_heat[inst_axis];

    // need to figure out if this is necessary
    if (inst_axis == 'x'){
      vd.heat[inst_axis].max = vd.canvas[inst_dim]/2 + vd.heat[inst_dim]/2; //  + offset_heat.x;
    } else {
      vd.heat[inst_axis].max = vd.canvas[inst_dim]/2 + vd.heat[inst_dim]/2 + offset_heat.x;
    }

    vd.center[inst_axis] = 0.5;

    vd['tile_' + inst_dim] = (vd.heat_size[inst_axis]/0.5)/params.labels['num_' + inst_other_label];

    var offcenter_magnitude = vd.layout[inst_axis].offset_scale * 2;
    // var offcenter_magnitude = 0.075;
    vd.offcenter[inst_axis] = offcenter_magnitude;

    if (inst_axis === 'x'){
      vd.shift_camera[inst_axis] = -offcenter_magnitude;
    } else {
      vd.shift_camera[inst_axis] = offcenter_magnitude;
    }

    vd.offset[inst_axis] = offcenter_magnitude / 2 * vd.canvas[inst_dim];

  });

  vd.cat_title = {
    row: {
      left: vd.mat["x"].min + vd.offset["x"] - 2,
      top: vd.heat["y"].min + vd.offset["y"] - 2,
      width: params.cat_data.cat_room["x"] * vd.canvas["width"],
    },
    col: {
      left: vd.mat["x"].max + vd.offset["x"] + 2,
      top: vd.mat["y"].min + vd.offset["y"] - 2,
      width: params.cat_data.cat_room["y"] * vd.canvas["height"],
    }
  }
  params.viz_dim = vd;
};
