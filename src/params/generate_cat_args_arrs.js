var make_cat_position_array = require('./../cats/make_cat_position_array');
var make_cat_args = require('./../cats/make_cat_args');

/* eslint-disable no-loop-func */

module.exports = function generate_cat_args_arrs(regl, params){

  // console.log('re-generate cat parameters because mousing over cats')

  // debugger

  params.cat_args = {};
  params.cat_args.row = [];
  params.cat_args.col = [];

  params.cat_arrs = {};

  _.each(['inst', 'new'], function(inst_state){
    params.cat_arrs[inst_state] = {}
    params.cat_arrs[inst_state].row = {};
    params.cat_arrs[inst_state].col = {};
  });

  _.each(['row', 'col'], function(inst_axis){
    for (var cat_index = 0; cat_index < params.cat_data.cat_num[inst_axis]; cat_index++) {
      _.each(['inst', 'new'], function(inst_state){
        params.cat_arrs[inst_state][inst_axis][cat_index] = make_cat_position_array(
          params, inst_axis, cat_index, params.order[inst_state][inst_axis]
        );
      });

      // console.log('make_cat_args')

      params.cat_args[inst_axis][cat_index] = make_cat_args(regl, params, inst_axis, cat_index);
    }
  });

};
