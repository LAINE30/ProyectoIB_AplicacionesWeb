export class QuestManager {
    constructor(player) {
        this.player = player;

        this.quests = [
            {
                id: "gemas",
                descripcion: "Recoge 5 gemas",
                tipo: "coleccion",
                objetivo: 5,
                progreso: 0,
                completada: false,
                recompensa: "speedBoost"
            },
            {
                id: "anciano",
                descripcion: "Encuentra al anciano",
                tipo: "npc",
                objetivo: "npcAnciano",
                completada: false,
                recompensa: "doubleJump"
            },
            {
                id: "entrega",
                descripcion: "Entrega el objeto al destino",
                tipo: "entrega",
                objetivo: "npcDestino",
                completada: false,
                recompensa: "shield"
            }
        ];

        this.index = 0;
    }

    getMisionActual() {
        return this.quests[this.index];
    }

    actualizarProgreso(valor = 1) {
        const m = this.getMisionActual();

        if (m.tipo !== "coleccion") return;

        m.progreso += valor;
        if (m.progreso >= m.objetivo) this.completarMision();
    }

    interactuarConNPC(idNPC) {
        const m = this.getMisionActual();

        if ((m.tipo === "npc" || m.tipo === "entrega") && m.objetivo === idNPC) {
            this.completarMision();
        }
    }

    completarMision() {
        const m = this.getMisionActual();
        m.completada = true;

        this.aplicarRecompensa(m.recompensa);

        // Siguiente misión
        this.index++;
    }

    aplicarRecompensa(recompensa) {
        switch (recompensa) {
            case "speedBoost":
                this.player.speed *= 1.3;
                break;

            case "doubleJump":
                this.player.canDoubleJump = true;
                break;

            case "shield":
                this.player.shield = true;
                setTimeout(() => this.player.shield = false, 5000);
                break;
        }
    }
}
