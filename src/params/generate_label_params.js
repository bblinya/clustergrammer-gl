var get_ordered_labels = require('./../matrix_labels/get_ordered_labels');
module.exports = function generate_label_params(params){

  params.labels = {};
  params.labels.offset_dict = {};
  params.labels.draw_labels = false;

  get_ordered_labels(params);

};