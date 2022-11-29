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

}
