var d3 = require("d3");
var run_reorder = require('./../reorders/run_reorder');

module.exports = function build_reorder_cat_titles(regl, cgm){

  var params = cgm.params;
  var button_color = '#eee';

  let fieldSorter = (fields) => (a, b) => fields.map(o => {
          let dir = 1;
          if (o[0] === '-') { dir = -1; o=o.substring(1); }
          return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
      }).reduce((p, n) => p ? p : n, 0);

  function stable_reorder_cats(axis, i){
    let inst_nodes = params.network[axis + '_nodes'].map(x => x)
    let cat_primary = 'cat-' + String(i)
    let cat_secondary_up = 'cat-' + String(i - 1)
    let cat_secondary_down = 'cat-' + String(i + 1)
    if (cat_secondary_down in params.network[axis + '_nodes'][0]){
      console.log('found down')
      cat_secondary = cat_secondary_down
    } else if (cat_secondary_up in params.network[axis + '_nodes'][0]){
      console.log('found up')
      cat_secondary = cat_secondary_up
    } else {
      // single category reordering
      console.log('did not find cat_secondary')
      cat_secondary = cat_primary
    }

    let sorted_nodes = inst_nodes.sort(fieldSorter([cat_primary, cat_secondary]));
    let order_dict = {}
    let inst_name
    let inst_order
    sorted_nodes.forEach((d, i) => {
      inst_name = d.name
      if (inst_name.includes(': ')){
        inst_name = inst_name.split(': ')[1]
      }
      order_dict[inst_name] = i
    })

    params.network[axis + '_nodes'].forEach((d,i) => {
      inst_name = d.name
      if (inst_name.includes(': ')){
        inst_name = inst_name.split(': ')[1]
      }

      d.custom = order_dict[inst_name]
    })

    require('./../params/generate_cat_args_arrs')(regl, params);
    run_reorder(regl, params, axis, 'custom');
    params.order.inst.col = 'custom'
  }

  // Column Titles
  var col_cat_title_group = d3.select(params.root + ' .canvas-container')
    .append('g')
    .style('position', 'absolute')
    .classed('col-cat-title-group', true);

  var col_cat_title_svg = col_cat_title_group
    .append('svg')
    .classed('col-cat-title-svg', true);

  var col_cat_reorder_group = col_cat_title_svg
    .append('g')
    .classed('col-cat-reorder-group', true);

  col_cat_reorder_group
    .selectAll('rect')
    .data(params.cat_data.col)
    .enter()
    .append('text')
    .text(function(d){ return d.cat_title; })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight',  800)
    .attr('index', (d, i) => i)
    .classed('col-cat-title-text', true)

  col_cat_reorder_group
    .selectAll('rect')
    .data(params.cat_data.col)
    .enter()
    .append('rect')
    .classed('col-cat-title-rect', true)
    .style('fill', 'white')
    .style('opacity', 0.0)
    .on('dblclick', function(d, i){

      // // Original Category Reordering
      // ////////////////////////////////////////
      // let inst_reorder = 'cat_' + String(i) + '_index'
      // run_reorder(regl, params, 'col', inst_reorder)
      // params.order.inst.col = inst_reorder

      // New Category Reordering
      ////////////////////////////////////////
      stable_reorder_cats('col', i)
      params.order.inst.col = 'custom'

      d3.select(params.root + ' .col-reorder-buttons')
        .selectAll('rect')
        .attr('stroke', button_color);

    })
    .style('user-select', 'none');

  params.adjust_col_cat_titles = function (params) {
    var col_title = params.viz_dim.cat_title.col;
    var dim_x = 55;
    var dim_y = col_title.width;

    d3.select(params.root + ' .col-cat-title-group')
      .style('top', col_title.top + 'px')
      .style('left', col_title.left + 'px')
    ;
    d3.select(params.root + ' .col-cat-title-svg')
      .style('width', dim_x)
      .style('height', dim_y * params.cat_data.col.length)
    d3.selectAll(params.root + ' .col-cat-title-text')
      .style('font-size', Math.min(12, 12 * params.viz_height / 900))
      .attr('transform', function(d, i) {
        var y_trans = dim_y * (i + 1);
        return 'translate( 0, '+ y_trans +')';
      });
    d3.selectAll(params.root + ' .col-cat-title-rect')
      .style('width', dim_x + 'px')
      .style('height', function(){ return dim_y + 'px' })
      .attr('transform', function(d, i) {
        var y_trans = dim_y * i;
        return 'translate( 0, '+ y_trans +')';
      });
  }
  params.adjust_col_cat_titles(params);


  // Row Titles
  var row_cat_title_group = d3.select(params.root + ' .canvas-container')
    .append('g')
    .style('position', 'absolute')
    .classed('row-cat-title-group', true);

  var row_cat_title_svg = row_cat_title_group
    .append('svg')
    .classed('row-cat-title-svg', true);

  var inst_rotate;
  var row_cat_reorder_group = row_cat_title_svg
    .append('g')
    .classed('row-cat-reorder-group', true)

  row_cat_reorder_group
    .selectAll('rect')
    .data(params.cat_data.row)
    .enter()
    .append('text')
    .text(function(d){ return d.cat_title; })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight',  800)
    .classed('row-cat-title-text', true)

  row_cat_reorder_group
    .selectAll('rect')
    .data(params.cat_data.row)
    .enter()
    .append('rect')
    .classed('row-cat-title-rect', true)
    .style('fill', 'white')
    .style('opacity', 0.0)
    .on('dblclick', function(d, i){

      // let inst_reorder = 'cat_' + String(i) + '_index'
      // run_reorder(regl, params, 'row', inst_reorder);
      // params.order.inst.row = inst_reorder;

      stable_reorder_cats('row', i)
      params.order.inst.row = 'custom';

      d3.select(params.root + ' .row-reorder-buttons')
        .selectAll('rect')
        .attr('stroke', button_color);

    })
    .style('user-select', 'none');

  params.adjust_row_cat_titles = function (params) {
    var row_title = params.viz_dim.cat_title.row;
    var row_dim_x = 60;
    var row_dim_y = row_title.width;
    var row_height = row_dim_y * params.cat_data.row.length;

    d3.select(params.root + ' .row-cat-title-group')
      .style('top', (row_title.top - row_dim_x) + 'px')
      .style('left', row_title.left + 'px');
    d3.select(params.root + ' .row-cat-title-svg')
      .style('width', row_dim_y * params.cat_data.row.length)
      .style('height', row_dim_x)
    d3.select(params.root + ' .row-cat-reorder-group')
      .attr('transform', function(){
          inst_rotate = -90;
          return 'translate(0,' + row_dim_x + '), rotate('+ inst_rotate +')';
        });
    d3.selectAll(params.root + ' .row-cat-title-text')
      .style('font-size', Math.min(12, 12 * params.viz_width / 900))
      .attr('transform', function(d, i) {
        var y_trans = row_title.width * (i + 1);
        return 'translate( 0, '+ y_trans +')';
      });
    d3.selectAll(params.root + ' .row-cat-title-rect')
      .style('width', row_dim_x + 'px')
      .style('height', function(){ return row_dim_y + 'px' })
      .attr('transform', function(d, i) {
        var y_trans = row_dim_y * i;
        return 'translate( 0, '+ y_trans +')';
      });
  }
  params.adjust_row_cat_titles(params);



};
