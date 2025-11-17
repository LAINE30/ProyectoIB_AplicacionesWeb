import { LoadingState } from "./LoadingState.js";

export class MenuState {
    init(manager) {
        this.manager = manager;

        window.addEventListener("keydown", this.keyHandler = (e) => {
            if (e.key === "Enter") {
                this.manager.set(new LoadingState());
            }
        });
    }

    render(ctx) {
        const { width, height } = ctx.canvas;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("MI JUEGO RTS", width / 2, height / 2 - 40);
        ctx.fillText("Presiona ENTER para iniciar", width / 2, height / 2 + 10);
    }

    exit() {
        window.removeEventListener("keydown", this.keyHandler);
    }
}
