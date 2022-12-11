module.exports = function calc_viz_area(params){

  // console.log('calc_viz_area!!!!!!!!!!!!')

  var zoom_data = params.zoom_data;
  var pix_to_webgl = params.pix_to_webgl;

  var buffer_width = 0.0;
  var total_pan = {};
  var viz_area = {};
  var dim = {}
  var inst_dim;
  var label_name;
  var found_label;
  dim.x = 'width';
  dim.y = 'height';

  var label_dict = {};
  label_dict.x = 'col'
  label_dict.y = 'row'

  params.labels.visible_labels = {};

  _.each(['x', 'y'], function(inst_axis){
    inst_dim = dim[inst_axis]

    total_pan[inst_axis + '_min'] = -zoom_data[inst_axis].total_pan_min;
    total_pan[inst_axis + '_max'] = params.viz_dim.heat[inst_dim] + zoom_data[inst_axis].total_pan_max;

    // x and y axis viz area is defined differently
    if (inst_axis == 'x'){
      viz_area[inst_axis + '_min'] = pix_to_webgl[inst_axis](total_pan[inst_axis + '_min']) - buffer_width;
      viz_area[inst_axis + '_max'] = pix_to_webgl[inst_axis](total_pan[inst_axis + '_max']) + buffer_width;
    } else {
      viz_area[inst_axis + '_min'] = pix_to_webgl[inst_axis](total_pan[inst_axis + '_max']) - buffer_width;
      viz_area[inst_axis + '_max'] = pix_to_webgl[inst_axis](total_pan[inst_axis + '_min']) + buffer_width;
    }

    label_name = label_dict[inst_axis]

    params.labels.visible_labels[label_dict[inst_axis]] = [];

    var min_viz = viz_area[inst_axis + '_min'];
    var max_viz = viz_area[inst_axis + '_max'];

    _.each(params.network[label_name + '_nodes'], function(inst_label){

      if (inst_label.offsets.inst > min_viz && inst_label.offsets.inst < max_viz){

        found_label = inst_label.name;

        if (found_label.indexOf(': ') >=0){
          found_label = found_label.split(': ')[1];
        }

        params.labels.visible_labels[label_dict[inst_axis]].push(found_label);

      }

    });

  });


  params.viz_area = viz_area;
};
