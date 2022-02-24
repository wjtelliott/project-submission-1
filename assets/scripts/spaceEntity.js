class spaceEntity {
    constructor() {
        
    }
    getDistance(objectPosition) {
        // objectPosition will always be X as [0] and Y as [1], same as this.position / this.velocity
        if (objectPosition === null || this.position === null) return Infinity;
        let p1 = objectPosition[0] - (this.X + 32);
        let p2 = objectPosition[1] - (this.Y + 32);
        return (p1 * p1) + (p2 * p2);
    }
}