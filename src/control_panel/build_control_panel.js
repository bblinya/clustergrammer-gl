var d3 = require("d3");
let draw_webgl_layers = require('./../draws/draw_webgl_layers')
// var logo_url = require("file-loader!../graham_cracker_70.png");
let build_opacity_slider = require('./../colors/build_opacity_slider')
let download_matrix = require('./../download/download_matrix')
let download_metadata = require('./../download/download_metadata')

module.exports = function build_control_panel(){

  var cgm = this;
  var regl = cgm.regl;

  var params = cgm.params;
  params.tooltip_id = '#d3-tip_' + params.root.replace('#','');

  var tooltip = require('d3-tip').default()
                   .attr('id', params.tooltip_id.replace('#',''))
                   .attr('class', 'cgm-tooltip')
                   .direction('sw')
                   .html(function(){
                      return '';
                    });


  params.tooltip_fun = tooltip;

  var control_container = params.root + " .control-container"

  const container = d3.select(control_container)
    .attr("height", i_height + "px")
    .attr("width", i_width + "px");
  

  // .attr("height", i_height + "px")
  // .attr("width", i_width + "px");

  const control_panel_color = 'white';
  var text_color = '#47515b';
  var button_color = '#eee';

  var i_height = 135;
  var i_width = params.viz_width;
  var control_svg = container
    .append('svg')
    .classed('control_svg', true)
    .attr('height',i_height + 'px')
    .attr('width',i_width+'px')
    .on('mouseover', function(){
      params.tooltip.in_bounds_tooltip = false;
    })

  control_svg
    .append('rect')
    .attr('height',i_height + 'px')
    .attr('width',i_width+'px')
    .attr('position', 'absolute')
    .attr('fill', control_panel_color)
    .attr('class', 'control-panel-background')
    .call(tooltip);

  require('./../tooltip/initialize_d3_tip')(params);

  // tooltip style
  //////////////////////////
  d3.select(params.tooltip_id)
    .style('line-height', 1.5)
    .style('font-weight', 'bold')
    .style('padding-top', '3px')
    .style('padding-bottom', '7px')
    .style('padding-left', '10px')
    .style('padding-right', '10px')
    .style('background', 'rgba(0, 0, 0, 0.8)')
    .style('color', '#fff')
    .style('border-radius', '2px')
    .style('pointer-events', 'none')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-size', '12px');

  // control panel border
  var border_height = 1;
  control_svg
    .append('rect')
    .classed('north_border', true)
    .attr('height', '1px')
    .attr('width',i_width+'px')
    .attr('position', 'absolute')
    .attr('stroke', '#eee')
    .attr('stroke-width', 3)
    .attr('transform', function(){
      var y_trans = i_height - border_height;
      return 'translate( 0, '+ y_trans +')';
    });

  var button_dim = {};
  button_dim.height = 32;
  button_dim.width = 63;
  button_dim.buffer = 12;
  button_dim.x_trans = button_dim.width + button_dim.buffer;
  button_dim.fs = 11;

  var button_groups = {};
  button_groups.row = {};
  button_groups.col = {};

  var cracker_room = 60;

  // control_svg
  //   .append('image')
  //   .image('https://amp.pharm.mssm.edu/clustergrammer/static/icons/graham_cracker_70.png')

  control_svg
    .append('svg:a')
    // .attr('xlink:href', 'https://clustergrammer.readthedocs.io/clustergrammer2.html')
    // .attr('xlink:target', '_blank')
    .append('svg:image')
    .classed('cgm-logo', true)
    .attr('x', 15)
    .attr('y', 55)
    .attr('width', 50)
    .attr('height', 50)
    // .attr('xlink:href', 'https://amp.pharm.mssm.edu/clustergrammer/static/icons/graham_cracker_70.png')
    .attr('xlink:href', 'https://raw.githubusercontent.com/ismms-himc/clustergrammer-gl/master/img/graham_cracker_144.png')
    .on('click', function() {
        window.open(
          'https://clustergrammer.readthedocs.io/',
          '_blank' // <- This is what makes it open in a new window.
        );
      })
    // .attr('cursor', 'pointer');
    // .attr("xlink:href", logo_url)

    // console.log(logo_url)

  var shift_x_order_buttons = 65 + cracker_room;
  button_groups.row.x_trans = shift_x_order_buttons;
  button_groups.col.x_trans = shift_x_order_buttons;

  var y_offset_buttons = 47;
  button_groups.col.y_trans = y_offset_buttons;
  button_groups.row.y_trans = button_groups.col.y_trans + button_dim.height + button_dim.buffer;

  control_svg
    .append('g')
    .classed('panel_button_titles', true)
    .classed('reorder_button_title', true)
    .on('click', function(){

      d3.selectAll(params.root + ' .panel_button_titles')
        .attr('opacity', 0.5)
      d3.select(this)
        .attr('opacity', 1.0)

      if (params.viz.current_panel == 'recluster') {

        params.viz.current_panel = 'reorder'

        // modify buttons
        d3.select(params.root + ' .panel_button_title')
          .text('reorder'.toUpperCase())
        d3.select(params.root + ' .top_button_title')
          .text('COL')
        d3.select(params.root + ' .bottom_button_title')
          .text('ROW')
        d3.selectAll(params.root + ' .reorder_buttons')
          .style('display', 'block');
        d3.select(params.root + ' .run_cluster_container')
          .style('display', 'none')

        d3.selectAll(params.root + ' .dist_options')
          .style('display', 'none')
        d3.selectAll(params.root + ' .link_options_container')
          .style('display', 'none')
      }

    })
    .append('text')
    .text('reorder'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', text_color)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = 110 + cracker_room;
        var y_trans = y_offset_buttons - 2 * button_dim.buffer + 2;
        return 'translate( '+ x_offset +', '+ y_trans +')';
      })

  // dropped alpha, will probably replace with ini
  var order_options = ['clust', 'sum', 'var', 'ini'];

  control_svg
    .append('rect')
    .attr('height', '1px')
    .attr('width', '290px')
    .attr('position', 'absolute')
    .attr('stroke', '#eee')
    .attr('stroke-width', 2)
    .attr('transform', function(){
      var x_offset = button_dim.x_trans - button_dim.buffer + 1 + cracker_room;
      var y_trans = y_offset_buttons - button_dim.buffer + 2;
      return 'translate( '+ x_offset +', '+ y_trans +')';
    });

  let name_dict = {}
  name_dict['col'] = 'top'
  name_dict['row'] = 'bottom'

  _.each(['row', 'col'], function(i_axis){

    var axis_title = control_svg
      .append('g')
      .classed(name_dict[i_axis] + '_button_title_container', true)
      .attr('transform', function(){
        var x_offset = 0;
        var y_offset = button_groups[i_axis].y_trans;
        return 'translate('+ x_offset  +', '+ y_offset +')';
      })

    var axis_title_offset = 35 + cracker_room;

    axis_title
      .append('text')
      .classed(name_dict[i_axis] + '_button_title', true)
      .text(i_axis.toUpperCase())
      .style('-webkit-user-select', 'none')
      .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr('font-weight', 400)
      .attr('font-size', button_dim.fs)
      .attr('text-anchor', 'middle')
      .attr('stroke', text_color)
      .attr('alignment-baseline', 'middle')
      .attr('letter-spacing', '2px')
      .attr('cursor', 'default')
      .attr('transform', 'translate('+ axis_title_offset +', '+ button_dim.height/2 +')');

    var reorder_buttons = control_svg
      .append('g');

    reorder_buttons
      .classed(i_axis + '-reorder-buttons', true);

    var active_button_color = '#8797ff' // '#0000FF75';

    // generate reorder buttons
    var button_group = reorder_buttons
      .selectAll('g')
      .data(order_options)
      .enter()
      .append('g')
      .classed('reorder_buttons', true)
      .attr('transform', function(_d, i){
        var x_offset = button_dim.x_trans * i + button_groups[i_axis].x_trans;
        return 'translate('+ x_offset  +', '+ button_groups[i_axis].y_trans +')';
      })
      .on('click', function(d){

        var clean_order = d.replace('sum', 'rank')
                           .replace('var', 'rankvar')

        if (params.order.inst[i_axis] != clean_order){
          console.log('>>>>>>>>', params.order.inst[i_axis], clean_order)

          /* category order is already calculated */
          require('./../reorders/run_reorder')(regl, params, i_axis, d);

          d3.select(params.root + ' .' + i_axis + '-reorder-buttons')
            .selectAll('rect')
            .attr('stroke', button_color);

          d3.select(this)
            .select('rect')
            .attr('stroke', active_button_color);

        }
      })

    button_group
      .append('rect')
      .attr('height', button_dim.height)
      .attr('width', button_dim.width)
      .attr('fill', control_panel_color)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('stroke', function(d){
        var i_color;
        if (params.order.inst[i_axis] == d){
          i_color = active_button_color;
        } else {
          i_color = button_color;
        }
        return i_color;
      })
      .attr('stroke-width', 2.5);


    button_group
      .append('text')
      .classed('button-name', true)
      .text(function(d){
        return d.toUpperCase();
      })
      .style('-webkit-user-select', 'none')
      .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr('font-weight', 400)
      .attr('font-size', button_dim.fs)
      .attr('text-anchor', 'middle')
      .attr('stroke', text_color)
      .attr('alignment-baseline', 'middle')
      .attr('letter-spacing', '2px')
      .attr('cursor', 'default')
      .attr('transform', 'translate('+ button_dim.width/2 +', '+ button_dim.height/2 +')');

  })

  require('../cats/build_reorder_cat_titles')(regl, cgm);
  require('./build_recluster_section')(cgm);

  // row search
  ///////////////////
  var search_container = d3.select(params.root + ' .control-container')
    .append('div')
    .classed('row_search_container',true)
    .style('position', 'absolute')
    .style('padding-left','10px')
    .style('padding-right','10px')
    .style('margin-top','10px')
    .style('top', '37px')
    .style('left', '440px')

  let root_id = cgm.params.root.replace('#', '')

  search_container
    .append('input')
    .classed('form-control',true)
    .classed('row_search_box',true)
    .classed('sidebar_text', true)
    .attr('type','text')
    .attr('placeholder', 'row names')
    .attr('list', 'row_names_' + root_id)
    .style('width', '100px')
    .style('height', '20px')
    .style('margin-top', '5px')
    .style('display', 'inline-block')
    .style('padding', '1pt 2pt')

  let row_names = params.network.row_node_names


  search_container
    .append('datalist')
    .attr('id', 'row_names_' + root_id)
    .selectAll('options')
    .data(row_names)
    .enter()
    .append('option')
    .attr('value', d => d)

  search_container
    .append('div')
    .classed('row_search_button',true)
    .style('margin-top', '5px')
    .style('margin-left', '5px')
    .style('display', 'inline-block')
    .attr('data-toggle','buttons')
    .append('button')
    .classed('sidebar_text', true)
    .html('Find')
    .attr('type','button')
    .classed('btn',true)
    .classed('btn-primary',true)
    .classed('submit_gene_button',true)
    .style('width', '100%')
    .style('font-size', '14px')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight', 400)
    .on('click', () => {

      let inst_value = d3.select(params.root + ' .control-container .row_search_box')
        .node().value

      params.search.searched_rows = inst_value.split(', ')
      draw_webgl_layers(cgm)

    })

  // opacity slider
  ////////////////////////////
  build_opacity_slider(cgm)

  // download buttons
  control_svg
    .append('text')
    .classed('download_section_title', true)
    .text('download'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', text_color)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = cracker_room + 715
        var y_trans = y_offset_buttons - 2 * button_dim.buffer + 2
        return 'translate( '+ x_offset +', '+ y_trans +')'
      })

  // download section border
  control_svg
    .append('rect')
    .classed('download_section_border', true)
    .attr('height', '1px')
    .attr('width', '145px')
    .attr('position', 'absolute')
    .attr('stroke', '#eee')
    .attr('stroke-width', 2)
    .attr('transform', function(){
      var x_offset = cracker_room + 645
      var y_trans = y_offset_buttons - button_dim.buffer + 2;
      return 'translate( '+ x_offset +', '+ y_trans +')';
    });

  control_svg
    .append('g')
    .on('click', () => {
      params.download.delimiter_name = 'csv'
      download_matrix(params)
    })
    .append('text')
    .classed('download_section_type', true)
    .text('csv'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', 'blue')
    .attr('opacity', 0.75)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = cracker_room + 610 + 55
        var y_trans = 63
        return 'translate( '+ x_offset +', '+ y_trans +')'
      })

  // let shift_download = 40
  control_svg
    .append('g')
    .on('click', () => {
      params.download.delimiter_name = 'tsv'
      download_matrix(params)
    })
    .append('text')
    .classed('download_section_type', true)
    .text('tsv'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', 'blue')
    .attr('opacity', 0.75)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = cracker_room + 610 + 55 + 40
        var y_trans = 63
        return 'translate( '+ x_offset +', '+ y_trans +')'
      })

  control_svg
    .append('g')
    .on('click', () => {
      params.download.delimiter_name = 'tuple'
      download_matrix(params)
    })
    .append('text')
    .classed('download_section_type', true)
    .text('tuple'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', 'blue')
    .attr('opacity', 0.75)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = cracker_room + 610 + 55 + 90
        var y_trans = 63
        return 'translate( '+ x_offset +', '+ y_trans +')'
      })


  control_svg
    .append('text')
    .classed('download_section_type', true)
    .text('matrix'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', text_color)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = cracker_room + 615
        var y_trans = 63
        return 'translate( '+ x_offset +', '+ y_trans +')'
      })

  control_svg
    .append('text')
    .classed('download_section_type', true)
    .text('meta'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', text_color)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = cracker_room + 615
        var y_trans = 107
        return 'translate( '+ x_offset +', '+ y_trans +')'
      })


  control_svg
    .append('g')
    .on('click', () => {
      params.download.meta_type = 'col'
      download_metadata(params)
    })
    .append('text')
    .classed('download_section_type', true)
    .text('col'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', 'blue')
    .attr('opacity', 0.75)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = cracker_room + 610 + 55
        var y_trans = 107
        return 'translate( '+ x_offset +', '+ y_trans +')'
      })

  control_svg
    .append('g')
    .on('click', () => {
      params.download.meta_type = 'row'
      download_metadata(params)
    })
    .append('text')
    .classed('download_section_type', true)
    .text('row'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', 'blue')
    .attr('opacity', 0.75)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = cracker_room + 610 + 55 + 40
        var y_trans = 107
        return 'translate( '+ x_offset +', '+ y_trans +')'
      })


  require("./build_v1_control_panel")(cgm, params);

};

