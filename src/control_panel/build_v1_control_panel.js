const draw_webgl_layers = require('./../draws/draw_webgl_layers');
const color_to_rgba = require('./../colors/color_to_rgba');

module.exports = function build_v1_control_panel(cgm, params) {
  // const control_container = params.root + " .control-container"
  // const container = d3.select(control_container);

  const v1_height = 50;
  const v1_width = params.viz_width;
  const container = d3.select(params.root)
    .append("div")
    .attr('height', v1_height + "px")
    .attr('width', v1_width + 'px')
    ;

  // const v1_controller = container
  //   .append("svg")
  //   .classed('v1-controller', true)
  //   .attr('height', v1_height + "px")
  //   .attr('width', v1_width + 'px')
  //   .on('mouseover', function() {
  //     params.tooltip.in_bounds_tooltip = false; });

  // const control_panel_color = 'white';
  // v1_controller
  //   .append('rect')
  //   .attr('height', v1_height + 'px')
  //   .attr('width', v1_width + 'px')
  //   .attr('position', 'absolute')
  //   .attr('fill', control_panel_color)
  //   .attr('class', 'v1-control-panel-background')
  // ;

  const color_scheme_container = container 
    .append('div')
    .style('font-weight', 400)
    .style('font-size', '14px')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('position', 'absolute')
    .style('padding-left', '10px')
    .style('padding-right', '10px')
    .style('margin-top','10px');

  const selector_label = color_scheme_container
    .append("label")
    .style('height', '20px')
    .style('font-weight', 400)
    .attr("for", "color-scheme-selector")
    .html("Choose color scheme: ")
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
    .style('height', '20px')
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
