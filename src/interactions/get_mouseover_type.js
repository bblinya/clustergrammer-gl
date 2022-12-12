module.exports = function get_mouseover_type(params){

  var layout = params.layout;
  var vd = params.viz_dim;
  var cat_title = vd.cat_title;

  // switch to using absolute cursor position to determine mouseover type
  // emperically found pixel parameters
  // cats are ~12px wide
  // var cat_width = 12  ;
  var edim = {};
  edim.x = {};
  edim.x.heat_min = layout.left + cat_title.row.width * params.cat_data.row.length;
  edim.x.dendro_start = vd.mat["x"].max + vd.offset["x"];
  edim.x.dendro_end = edim.x.dendro_start + 15;
  // edim.x.dendro_start = 845;
  // edim.x.dendro_end = 860;

  edim.y = {};
  // extra pixel prevents error *********** look into
  edim.y.heat_min = layout.top + cat_title.col.width * params.cat_data.col.length;
  edim.y.dendro_start = vd.mat["y"].max + vd.offset["y"];
  edim.y.dendro_end = edim.y.dendro_start + 15;

  // console.log(edim);

  // console.log(params.zoom_data.x.cursor_position, params.zoom_data.y.cursor_position)

  var inst_pix = {};
  inst_pix.x = params.zoom_data.x.cursor_position;
  inst_pix.y = params.zoom_data.y.cursor_position;

  // console.log(inst_pix.y)

  var cat_index;

  params.tooltip.in_bounds_tooltip = false;
  params.tooltip.tooltip_type = 'out-of-bounds';

  if (inst_pix.x > edim.x.heat_min &&
      inst_pix.x < edim.x.dendro_start &&
      inst_pix.y > edim.y.heat_min &&
      inst_pix.y < edim.y.dendro_start){

    params.tooltip.in_bounds_tooltip = true;
    params.tooltip.tooltip_type = 'matrix-cell';

  } else if (inst_pix.x <= edim.x.heat_min &&
             inst_pix.y > edim.y.heat_min &&
             inst_pix.y < edim.y.dendro_start){

    params.tooltip.in_bounds_tooltip = true;
    if (params.cat_data.row.length > 0){

      cat_index = Math.floor( ((edim.x.heat_min - inst_pix.x)/cat_title.row.width) );

      if (cat_index + 1 <= params.cat_data.row.length){
        params.tooltip.tooltip_type = 'row-cat-' + String(params.cat_data.row.length - cat_index - 1);
      } else {
        params.tooltip.tooltip_type = 'row-label';
      }

    } else {
      params.tooltip.tooltip_type = 'row-label';
    }


  } else if (inst_pix.y <= edim.y.heat_min &&
             inst_pix.x > edim.x.heat_min &&
             inst_pix.x < edim.x.dendro_start){

    params.tooltip.in_bounds_tooltip = true;
    if (params.cat_data.col.length > 0){

      cat_index = Math.floor( ((edim.y.heat_min - inst_pix.y)/cat_title.col.width) );

      if (cat_index + 1 <= params.cat_data.col.length){
        params.tooltip.tooltip_type = 'col-cat-' + String(params.cat_data.col.length - cat_index - 1);
      } else {
        params.tooltip.tooltip_type = 'col-label';
      }

    } else {
      params.tooltip.tooltip_type = 'col-label';
    }

  } else if (inst_pix.x >= edim.x.dendro_start &&
             inst_pix.x < edim.x.dendro_end &&
             inst_pix.y > edim.y.heat_min &&
             inst_pix.y < edim.y.dendro_start){

    if (params.order.inst.row == 'clust'){
      params.tooltip.tooltip_type = 'row-dendro';
      params.tooltip.in_bounds_tooltip = true;
    }

  } else if (inst_pix.y >= edim.y.dendro_start &&
             inst_pix.y < edim.y.dendro_end &&
             inst_pix.x > edim.x.heat_min &&
             inst_pix.x < edim.x.dendro_start){

    if (params.order.inst.col == 'clust'){
      params.tooltip.tooltip_type = 'col-dendro';
      params.tooltip.in_bounds_tooltip = true;
    }

  }


}
