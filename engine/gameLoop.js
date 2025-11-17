export class GameLoop {
    constructor(stateManager, ctx) {
        this.stateManager = stateManager;
        this.ctx = ctx;
        this.lastTime = 0;
        this.delta = 0;
    }

    start() {
        requestAnimationFrame((t) => this.loop(t));
    }

    loop(timestamp) {
        this.delta = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        const state = this.stateManager.currentState;
        if (state) {
            state.update(this.delta); // LÓGICA DEL ESTADO
            state.render(this.ctx);   // DIBUJO DEL ESTADO
        }

        requestAnimationFrame((t) => this.loop(t));
    }
}
