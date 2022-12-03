const draw_webgl_layers = require('./../draws/draw_webgl_layers');
const color_to_rgba = require('./../colors/color_to_rgba');

module.exports = function build_v1_control_panel(cgm, params) {
  // const control_container = params.root + " .control-container"
  // const container = d3.select(control_container);

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
    .append('button')
    .html('Resize')
    .attr('type','button')
    .on("click", () => {
      const height = d3.select(params.root + " .v1-canvas-height")
        .node().value;
      const width = d3.select(params.root + " .v1-canvas-width")
        .node().value;

      params.viz_height = height;
      params.viz_width = width;

      d3.select(params.root + " .canvas-container")
        .style("height", height + "px")
        .style("width", width + "px")
      ;

      const canvas = cgm.regl._gl.canvas;
      // canvas.width = width;
      canvas.style.width = width + "px";
      // canvas.height = height;
      canvas.style.height = height + "px";

      console.log(width, height, canvas);

      // require('./../cameras/make_cameras')(cgm.regl, params);
      // require('./../params/calc_mat_arr')(params);
      // require('../params/generate_cat_args_arrs')(
      //   cgm.regl, params);
      // cgm.zoom_rules_high_mat(cgm.regl, params, external_model);
      params.zoom_restrict = require('./../zoom/ini_zoom_restrict')(params);
      draw_webgl_layers(cgm);

      const slider_length = 130;
      const slider_width = 25;

      _.each(['row', 'col'], function(axis) {
        var slider = d3.select(
          "." + axis + "_dendro_slider_svg");
        if (axis === 'row') {
          slider.style("left",
            (params.viz_width - slider_width) + "px");
        } else {
          pos_top = params.viz_height - (slider_length / 2) - slider_width;
          slider.style("top", pos_top + "px");
        }

      });
    });

}
