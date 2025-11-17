export function drawHUD(ctx, questManager) {
    const m = questManager.getMisionActual();
    if (!m) return;

    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.fillText("Misión: " + m.descripcion, 20, 30);

    if (m.tipo === "coleccion") {
        ctx.fillText(`Progreso: ${m.progreso}/${m.objetivo}`, 20, 60);
    }
}
