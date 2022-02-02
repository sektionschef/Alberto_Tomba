// strokes as impediments
class Strokes extends Particles {
    constructor(data) {

        let move_a_little = 20;

        const options = {
            isStatic: true,
            friction: 1,
            restitution: 0.5,
            density: 1,
            inertia: Infinity,  // prevents rotation
        }

        for (let currentStroke of data) {
            currentStroke.color = color(getRandomFromList(PALETTE));
            currentStroke.color = distortColor(currentStroke.color);
            currentStroke.image = strokes_full.get(currentStroke.x, currentStroke.y, currentStroke.w, currentStroke.h);
            currentStroke.x = getRandomFromInterval(0 - move_a_little, width);
            currentStroke.y = getRandomFromInterval(0 - move_a_little, height);
            currentStroke.angle = getRandomFromInterval(-Math.PI / 9, Math.PI / 9);

            // plan for impediments, basis of CO2 thing
            currentStroke.position = {
                x: currentStroke.x,
                y: currentStroke.y
            }
            currentStroke.offsetPhysical = {
                x: -currentStroke.w / 2,
                y: -currentStroke.h / 2,
            };
            currentStroke.options = options;

            // create vertices from image - four coordinates with a few inches inwards
            var offsetVerticesW = currentStroke.w / 4
            var offsetVerticesH = currentStroke.h / 4
            currentStroke.vertices = [
                { x: currentStroke.x + offsetVerticesW, y: currentStroke.y + offsetVerticesH },
                { x: currentStroke.x + currentStroke.w - offsetVerticesW, y: currentStroke.y + offsetVerticesH },
                { x: currentStroke.x + currentStroke.w - offsetVerticesW, y: currentStroke.y + currentStroke.h - offsetVerticesH },
                { x: currentStroke.x + offsetVerticesW, y: currentStroke.y + currentStroke.h - offsetVerticesH },
            ]
        }

        super(data);
    }
}