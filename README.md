# Examen Final — HTML5 Game
Estructura base para iniciar el proyecto.

## Ejecutar
Use un servidor estático (p.ej. VS Code Live Server) para abrir `index.html`.

## Arquetipos (elige uno)
- `game/rts`   : RTS-Lite (paneo + selección)
- `game/arcade`: Shooter/Side-Scrolling
- `game/puzzle`: Puzzle física

## Entregables
- Build jugable + capturas + video
- README con controles e instrucciones


## Logica
QuestManager
 ├── lista de misiones
 ├── misión activa
 ├── cumplir requisitos
 ├── desbloquear recompensas (power-ups)
 └── avanzar a la siguiente misión

## mision
{
  id: "gemas1",
  descripcion: "Recoge 5 gemas",
  tipo: "coleccion", // o "npc" o "entrega"
  objetivo: 5,       // # gemas, o id de npc, etc
  progreso: 0,
  completada: false,
  recompensa: "speedBoost" // power-up desbloqueado
}
