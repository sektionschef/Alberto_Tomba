// trace, debug, info, warn, error
// const SWITCH_LOGGING_LEVEL = "warn";
const SWITCH_LOGGING_LEVEL = "info";
// const SWITCH_LOGGING_LEVEL = "debug";

// mind aspect ratio of image - default resolution
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

let custom_font;
let custom_font_bold;

let fps = 0;
let default_debugging_text_size = 15;
let debugging_physical_body_count = 0;


// matter.js stuff
var Engine = Matter.Engine;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var world;

let underneath_image;
let impediments_image;
let on_top_image;

let SCALING_FACTOR = 1;
let rescaling_width;
let rescaling_height;

let stroke_image;
let PALETTE;
let background_image;
let background_color;

let bubble;

let area04;
let area05;

const origins_data = [
  { label: "1", x: getRandomFromInterval(0, CANVAS_WIDTH), y: -60, },
  { label: "2", x: getRandomFromInterval(0, CANVAS_WIDTH), y: -60, },
  { label: "3", x: getRandomFromInterval(0, CANVAS_WIDTH), y: -60, },
  { label: "4", x: getRandomFromInterval(0, CANVAS_WIDTH), y: -60, },
]


function preload() {
  fontRegular = loadFont('SourceSansPro-Regular.otf');

  background_01 = loadImage('background_01.png');
  background_02 = loadImage('background_02.png');
  background_03 = loadImage('background_03.png');
  background_04 = loadImage('background_04.png');
  canvas_image = loadImage('canvas_02.png');

  strokes_full = loadImage('strokes_full.png');
  bubbles_full = loadImage('bubble_full.png');

  stroke_data = loadJSON("stroke_data.json");
  bubble_data = loadJSON("bubble_data.json");
  areas_data = loadJSON("areas_data.json", loadAreas);
  palettes = loadJSON("palettes.json");


  // area_04 = loadImage('area_04.png');
  // area_05 = loadImage('area_05.png');
}

function setup() {

  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL).parent('canvasHolder');
  // let canvas = createCanvas(windowWidth, windowHeight).parent('canvasHolder');

  logging.setLevel(SWITCH_LOGGING_LEVEL);

  engine = Engine.create();
  world = engine.world;

  // const VERTICAL_GRAVITY = -0.25;
  const VERTICAL_GRAVITY = getRandomFromInterval(0.05, 0.5);

  chosen_palette = getRandomFromList(palettes.palettes);
  PALETTE = chosen_palette.values;
  PALETTE_NAME = chosen_palette.name;
  console.log(PALETTE_NAME);

  background_image = getRandomFromList([background_01, background_02, background_03, background_04]);

  impediment_strokes = new Strokes(stroke_data.data)
  impediment_strokes.create_all();

  bubbles_physical = new Bubbles(bubble_data.data);

  origins = new Origins(origins_data);
  origins.create_all();

  Matter.Runner.run(engine)
  engine.world.gravity.y = VERTICAL_GRAVITY;

  background(120);

  areas = new Areas(areas_data.data);

  resize_canvas();
}

function draw() {

  translate(-width / 2, -height / 2, 0);

  push();
  image(background_image, 0, 0, background_image.width * SCALING_FACTOR, background_image.height * SCALING_FACTOR)
  pop();

  origins.drop_all();

  if (logging.getLevel() <= 1) {
    origins.debugging_show_origins();
  }
  areas.show();

  bubbles_physical.show();
  impediment_strokes.show();

  bubbles_physical.kill_not_needed(300);

  Engine.update(engine);

  push();
  image(canvas_image, 0, 0, background_image.width * SCALING_FACTOR, background_image.height * SCALING_FACTOR)
  pop();

  // show_framerate();
  // show_number_physical_bodies();
}


