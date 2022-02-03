// walls as impediments
class Walls extends Particles {
    constructor() {

        let thickness = 50;

        const options = {
            isStatic: true,
            friction: 1,
            restitution: 0.5,
            density: 1,
            inertia: Infinity,  // prevents rotation
        }

        // four walls
        let data = [
            {
                // top
                x: 0,
                y: 2200,
                w: width,
                h: thickness
            },
            {
                // bottom
                x: 0,
                y: height,
                w: width,
                h: thickness
            },
            {
                // left
                x: 0 - thickness,
                y: 0,
                w: thickness,
                h: height
            },
            {
                // right
                x: width,
                y: 0,
                w: thickness,
                h: height
            }
        ];
        for (let i = 0; i < data.length; i++) {
            data[i].color = color(0);
            data[i].angle = 0;

            // plan for impediments, basis of CO2 thing
            data[i].position = {
                x: data[i].x,
                y: data[i].y
            }
            data[i].offsetPhysical = {
                x: -data[i].w / 2,
                y: -data[i].h / 2,
            };
            data[i].options = options;

            // create vertices from image - four coordinates with a few inches inwards
            data[i].vertices = [
                { x: data[i].x, y: data[i].y },
                { x: data[i].x + data[i].w, y: data[i].y },
                { x: data[i].x + data[i].w, y: data[i].y + data[i].h },
                { x: data[i].x, y: data[i].y + data[i].h },
            ]
        }

        super(data);
    }
}