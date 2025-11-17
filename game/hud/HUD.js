export function drawHUD(ctx, questManager) {
    const mision = questManager.getMisionActual();
    if (!mision || mision.completada) return; // No dibujar si no hay misión o se completó

    const padding = 15;
    const x = padding;
    const y = ctx.canvas.height - 60 - padding; // Abajo a la izquierda
    const width = 300;
    const height = 60;

    // Fondo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(x, y, width, height);
    
    // Borde
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Texto de Misión
    ctx.fillStyle = '#eee';
    ctx.font = '16px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText("Misión:", x + 10, y + 25);
    ctx.fillText(mision.descripcion, x + 10, y + 45);

    // Progreso (si aplica)
    if (mision.tipo === 'coleccion') {
        ctx.textAlign = 'right';
        ctx.font = '18px system-ui';
        ctx.fillText(`${mision.progreso}/${mision.objetivo}`, x + width - 10, y + 35);
    }
}