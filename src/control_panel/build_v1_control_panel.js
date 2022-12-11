const draw_webgl_layers = require('./../draws/draw_webgl_layers');
const color_to_rgba = require('./../colors/color_to_rgba');

module.exports = function build_v1_control_panel(cgm, params) {
  // const control_container = params.root + " .control-container"
  // const container = d3.select(control_container);
  params.v1_control = {
    resize: false,
  }

  const v1_height = 50;
  const v1_width = params.viz_width;
  const container = d3.select(params.root + " .v1-control-container")
    .attr('height', v1_height + "px")
    .attr('width', v1_width + 'px')
    .style("display", "flex")
    .style('margin-top','10px')
    .style("align-items", "center")
    .style('font-weight', 400)
    .style('font-size', '14px')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .on('mouseover', function(){
      params.tooltip.in_bounds_tooltip = false;
    })
  ;

  const uploader = container
    .append("div")
  ;

  const input_plug = uploader
    .append("input")
    .classed("v1-file-uploader", true)
    .style("width", "200px")
    .attr("type", "file")
  ;

  const select_btn = uploader
    .append('div')
    .classed('file_uploader_button',true)
    // .style('margin-left', '5px')
    .style('display', 'inline-block')
    .attr('data-toggle','buttons')
    .append('button')
    .classed('sidebar_text', true)
    .html('Open')
    .attr('type','button')
    .classed('btn',true)
    .classed('btn-primary',true)
    .style('width', '100%')
    .on('click', async () => {

      var files = d3
        .select(".v1-control-container .v1-file-uploader")
        .node().files;

      if (files.length) {
        const json_file = JSON.parse(await files[0].text());
        window.sessionStorage.setItem(
          "json_file", JSON.stringify(json_file))
        window.location.reload();
      }
    });

  // ========= Color Scheme Setter =========
  const color_scheme_container = container 
    .append('div')
    // .style('position', 'absolute')
    .style('padding-left', '10px')
    .style('padding-right', '10px')
  ;

  const selector_label = color_scheme_container
    .append("label")
    // .style('height', '20px')
    .style("margin-left", "5px")
    .style('font-weight', 400)
    .attr("for", "color-scheme-selector")
    .html("Color Scheme: ")
  ;

  const color_schemes = [
    { pos: "red", neg: "blue", name: "R/B" },
    { pos: "red", neg: "green", name: "R/G" },
    { pos: "red", neg: "yellow", name: "R/Y" },
  ];
  const selector = color_scheme_container
    .append("select")
    .attr("name", "color-scheme-selector")
    .attr("id", "color-scheme-selector")
    // .style('height', '20px')
    .style('display', 'inline-block')
    .style('padding', '1pt 2pt')
    .on("change", () => { 
      const t = d3.event.target;
      const idx = t.options[t.selectedIndex].value;
      const d = color_schemes[idx];

      params.network.matrix_colors.pos = d.pos;
      params.network.matrix_colors.neg = d.neg;

      const pos_rgb = color_to_rgba(d.pos).slice(0, 3);
      const neg_rgb = color_to_rgba(d.neg).slice(0, 3);
      params.viz.mat_colors.pos_rgb = pos_rgb;
      params.viz.mat_colors.neg_rgb = neg_rgb;

      // update webgl matrix props
      cgm.make_matrix_args();
      draw_webgl_layers(cgm);
    })
  ;

  for (var i = 0; i < color_schemes.length; i++) {
    selector
      .append("option")
      .attr("value", i)
      .html(color_schemes[i].name)
    ;
  }

  // =========== Canvas Size ==========
  const canvas_plug = container.append("div");

  canvas_plug
    .append("label")
    .html("H:")
  ;

  canvas_plug
    .append("input")
    .attr("type", "text")
    .attr("value", params.viz_height)
    .style("width", "50px")
    .classed("v1-canvas-height", true)
  ;

  canvas_plug
    .append("label")
    .html("W:")
  ;

  canvas_plug
    .append("input")
    .attr("type", "text")
    .attr("value", params.viz_width)
    .style("width", "50px")
    .classed("v1-canvas-width", true)
  ;

  canvas_plug
    .append("label")
    .html("L:")
  ;

  canvas_plug
    .append("input")
    .attr("type", "text")
    .attr("value", params.layout.left)
    .style("width", "50px")
    .classed("v1-edge-left", true)
  ;

  canvas_plug
    .append("label")
    .html("T:")
  ;

  canvas_plug
    .append("input")
    .attr("type", "text")
    .attr("value", params.layout.top)
    .style("width", "50px")
    .classed("v1-edge-top", true)
  ;

  cgm.adjust_canvas_size = function(width, height) {
    var cgm = this;
    var params = this.params;

    d3.select(params.root + " .canvas-container")
      .style("height", height + "px")
      .style("width", width + "px")
    ;
    var canvas = cgm.regl._gl.canvas;
    canvas.style.height = height + "px";
    canvas.style.width = width + "px";
    cgm.resizeCanvasToDisplaySize(canvas);

    const labels = params.labels;
    params.viz_height = height;
    params.viz_width = width;

    var layout = params.layout || {};
    layout.left = parseInt(d3.select(" .v1-edge-left").node().value);
    layout.top = parseInt(d3.select(".v1-edge-top").node().value);

    require('../params/calc_viz_dim')(cgm.regl, params);
    require('../params/generate_cat_args_arrs')(cgm.regl, params);
    params.zoom_data = require('../zoom/ini_zoom_data')();
    params.canvas_pos = require('../params/calc_row_and_col_canvas_positions')(params);

    _.each(['row', 'col'], function(inst_axis){
      require('../matrix_labels/calc_text_offsets')(params, inst_axis);
    });

    const heat = params.viz_dim.heat;
    params.tile_pix_width = heat.width / labels.num_col;
    params.tile_pix_height = heat.height / labels.num_row;

    require('../params/gen_pix_to_webgl')(params);
    require('../params/generate_webgl_to_pix')(params);
    require('../matrix_labels/make_label_queue')(params);
    require('../params/gen_text_zoom_par')(params);
    require('../params/calc_viz_area')(params);
    require('../params/generate_text_triangle_params')(params);

    params.zoom_restrict = require('../zoom/ini_zoom_restrict')(params);
    require('../params/calc_mat_arr')(params);
    cgm.make_matrix_args();

    require('../params/gen_dendro_par')(cgm);
    require('../params/generate_spillover_params')(cgm.regl, params);
    // cgm.zoom_rules_high_mat(cgm.regl, params, {});
    require("../cameras/make_cameras")(cgm.regl, params);
    // require("../cameras/reset_cameras")(cgm.regl, params);
    draw_webgl_layers(cgm);

    const slider_length = 130;
    const slider_width = 25;

    d3.select(".row_dendro_slider_svg")
      .style("left", (params.viz_width-slider_width) + "px");
    const pos_top = params.viz_height - (slider_length / 2) - slider_width;
    d3.select(".col_dendro_slider_svg")
      .style("top", pos_top + "px");

    params.adjust_col_cat_titles(params);
    params.adjust_row_cat_titles(params);
  }

  const BORDER_SIZE = 4;
  var canvas = d3.select(params.root + " .canvas-container")
    .style("margin-top", "10px")
    .style("border", BORDER_SIZE + "px solid")
    .node();

  var canvas_drag = {
    drag: false,
    x: false, x_pos: 0,
    y: false, y_pos: 0,
  }
  function resize_x(e){
    e.preventDefault(); e.stopPropagation();
    const dx = e.x - canvas_drag.x_pos;
    canvas_drag.x_pos = e.x;
    canvas.style.width = parseInt(getComputedStyle(canvas, '').width) + dx + "px";
  }
  function resize_y(e) {
    e.preventDefault(); e.stopPropagation();
    const dy = e.y - canvas_drag.y_pos;
    canvas_drag.y_pos = e.y;
    canvas.style.height = parseInt(getComputedStyle(canvas, '').height) + dy + "px";
  }

  function in_range(e, x, y, width, height) {
    return (e.x >= x && e.x <= (x + width)) && (e.y >= y && e.y <= (y + height));
  }

  document.addEventListener("mousedown", function(e){
    var rect = canvas.getBoundingClientRect();
    console.log(e.x, e.y, canvas_drag);
    if (in_range(e, rect.right - BORDER_SIZE, rect.top, BORDER_SIZE, rect.height)) {
      e.preventDefault(); e.stopPropagation();
      canvas_drag.enabled = true;
      canvas_drag.x_pos = e.x;
      document.addEventListener("mousemove", resize_x, false);
    }
    if (in_range(e, rect.left, rect.bottom - BORDER_SIZE, rect.width, BORDER_SIZE)) {
      e.preventDefault(); e.stopPropagation();
      canvas_drag.enabled = true;
      canvas_drag.y_pos = e.y;
      document.addEventListener("mousemove", resize_y, false);
    }
  }, false);

  document.addEventListener("mouseup", function(){
    if (canvas_drag.enabled) {
      canvas_drag.enabled = false;
      document.removeEventListener("mousemove", resize_x, false);
      document.removeEventListener("mousemove", resize_y, false);
      var canvas_size = getComputedStyle(canvas, '');
      cgm.adjust_canvas_size(parseInt(canvas_size.width), parseInt(canvas_size.height));
    }
  }, false);


  canvas_plug
    .append('button')
    .html('Resize')
    .attr('type','button')
    .on("click", () => {
      const height = d3.select(params.root + " .v1-canvas-height")
        .node().value;
      const width = d3.select(params.root + " .v1-canvas-width")
        .node().value;

      cgm.adjust_canvas_size(parseInt(width), parseInt(height));
    });

}
