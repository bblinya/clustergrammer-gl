module.exports = function viz_from_network(external_model){

  this.initialize_containers();
  this.initialize_regl();

  // console.log('viz_from_network')
  // define parameters and run visualization
  this.initialize_params(external_model);

  this.params_bak = JSON.parse(JSON.stringify(this.params));
  console.log("after init paramnsts", this.params_bak);

  this.build_control_panel();
  this.build_dendrogram_sliders();
  this.ini_canvas_mouseover();
  this.run_viz(external_model);
};
