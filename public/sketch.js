// trace, debug, info, warn, error
// const SWITCH_LOGGING_LEVEL = "warn";
const SWITCH_LOGGING_LEVEL = "info";
// const SWITCH_LOGGING_LEVEL = "debug";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

let gravity_counter = 0;

let custom_font;
let custom_font_bold;

let fps = 0;
let default_debugging_text_size = 15;
let debugging_physical_body_count = 0;

// REWORK
let timeScaleTarget = 1;

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

let SCALING_FACTOR = 1;
let rescaling_width;
let rescaling_height;

let background_image;
let background_color;

// for FEATURE creation
chosen_palette = getRandomFromList(PALETTE);
PALETTE = chosen_palette.values;
PALETTE_NAME = chosen_palette.name;

const NUMBER_PARTICLES = 70;  // min 30 max 200

const EXPLOSION_INTERVAL = getRandomFromInterval(4000, 8000);  // 8000
const FREEZE_DURATION = getRandomFromInterval(3000, 8000);  // 5000
const EXPLOSION_TO_FREEZE = getRandomFromInterval(20, 50);  // 30;

const EXPLOSION_FORCE = getRandomFromInterval(0.1, 1);  // 0.5
const GRAVITY_SPEED = getRandomFromInterval(0.1, 1); // 0.5

logging.info("Palette: " + PALETTE_NAME + " " + PALETTE[0]);
logging.info("Number of particles: " + NUMBER_PARTICLES);
logging.info("Explosion interval: " + EXPLOSION_INTERVAL);
logging.info("Freeze duration: " + FREEZE_DURATION);
logging.info("Explosion to freeze: " + EXPLOSION_TO_FREEZE);
logging.info("Explosion force: " + EXPLOSION_FORCE);
logging.info("Gravity: " + GRAVITY_SPEED);



const origins_data = [
  { label: "1", x: getRandomFromInterval(0, CANVAS_WIDTH), y: 60, },
  { label: "2", x: getRandomFromInterval(0, CANVAS_WIDTH), y: 60, },
  { label: "3", x: getRandomFromInterval(0, CANVAS_WIDTH), y: 60, },
  { label: "4", x: getRandomFromInterval(0, CANVAS_WIDTH), y: 60, },
]


function preload() {
  fontRegular = loadFont('SourceSansPro-Regular.otf');

  background_a = loadImage('background_a.png');
  canvas_image = loadImage('canvas_02.png');

  particles_image = loadImage('particles.png');

  for (let currentArea of areas_data) {
    currentArea.image = loadImage(currentArea.file);
  }
}

function setup() {

  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL).parent('canvasHolder');
  // let canvas = createCanvas(windowWidth, windowHeight).parent('canvasHolder');

  logging.setLevel(SWITCH_LOGGING_LEVEL);

  engine = Engine.create();
  world = engine.world;

  const VERTICAL_GRAVITY = 1;
  // const VERTICAL_GRAVITY = getRandomFromInterval(0.05, 0.5);

  impediment_walls = new Walls()
  impediment_walls.create_all();

  particles_physical = new Bubbles(particles_data);

  origins = new Origins(origins_data);
  origins.create_all();

  Matter.Runner.run(engine)
  engine.world.gravity.y = VERTICAL_GRAVITY;

  areas = new Areas(areas_data);

  resize_canvas();

  setTimeout(explode, EXPLOSION_INTERVAL);
}

function draw() {


  translate(-width / 2, -height / 2, 0);
  background(255);

  push();
  image(background_a, 0, 0, background_a.width * SCALING_FACTOR, background_a.height * SCALING_FACTOR)
  pop();

  // LIMIT
  if (particles_physical.bodies.length < NUMBER_PARTICLES) {
    origins.drop_all();
  }

  if (logging.getLevel() <= 1) {
    origins.debugging_show_origins();
  }
  areas.show();

  particles_physical.show();
  impediment_walls.show();

  particles_physical.kill_not_needed(NUMBER_PARTICLES);

  Engine.update(engine);

  push();
  image(canvas_image, 0, 0, canvas_image.width * SCALING_FACTOR, canvas_image.height * SCALING_FACTOR)
  pop();

  // show_framerate();
  // show_number_physical_bodies();


  // if (frameCount % 3 == 0) {
  //   logging.debug("timeScale: " + engine.timing.timeScale);
  // }

  freezeLifestyle();
}
