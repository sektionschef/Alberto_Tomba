class Bubbles extends Particles {
    constructor(data) {
        const options = {
            isStatic: false,
            friction: 1,
            restitution: 0.5,  // A Number that defines the restitution (elasticity) of the body.
            density: 1,
            // inertia: Infinity,  // prevents rotation
        }

        for (let currentBubble of data) {
            currentBubble.color = color(getRandomFromList(PALETTE));
            currentBubble.image = bubbles_full.get(currentBubble.x, currentBubble.y, currentBubble.w, currentBubble.h);
            currentBubble.options = options;
        }

        super(data);
    }
}