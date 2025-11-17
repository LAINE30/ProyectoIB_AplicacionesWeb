# 🎮 Juego 2D --- ClassicArcade

Este es un juego 2D desarrollado en JavaScript para la materia de **Aplicaciones Web**
El código puede ser escalado y está preparado para escalar.

## 📂 Estructura del Proyecto

    /assets
        /Audio
            menuMusic.wav
            gameMusic.wav
            efecto1.wav
        /Images
            player.png
            tileset.png
            items.png
    /css
        styles.css
    /engine
        Animationjs
        entity.js
        gameLoop.js
        Item.js
        level_data.txt
        loader.js
        NPC.js
        QuestManager.js
    /game
        /rts
          Gameoverstate.js
          Menustate.js
          RTSState.js
          LoadingState.js
      
    index.html
    main.js

## ▶️ Ejecución

Para evitar bloqueos del navegador, **no abras el HTML directamente**.\
Debes usar un servidor local:

### Opción 1 (Recomendado)

    Extensión VSCode: Live Server

### Opción 2 

    npx http-server

### Opción 3

    python -m http.server

Luego abra:

    http://localhost:8080

## 🕹️ Controles

### Movimiento

  Tecla       Acción
  ----------- -------------------------
  **W / ↑**   Moverse arriba / Saltar
  **A / ←**   Moverse izquierda
  **S / ↓**   Agacharse / Bajar
  **D / →**   Moverse derecha

### Interacción y Sistema

  Tecla         Acción
  ------------- -------------
  **E**         Interactuar
  **ESC / U**   Pausar
  **P**         Modo Debug


## 🔊 Sistema de Audio

El audio está sincronizado con los estados del juego:

-   **MenuState:** reproduce `menuMusic`
-   **GameState:** reproduce `gameMusic`

## 🎯 Sistema de Misiones (QuestManager)

Al iniciar el juego aparece una ventana con el objetivo principal.\
Misiones incluidas:

1.  **NIVEL1: Recoger 5 gemas** (speedBoost)
2.  **NIVEL2: Encontrar al anciano** (doubleJump)
3.  **NIVEL3: Entregar objeto al destino** (shield)

Cada misión avanza automáticamente a la siguiente.

## 🧩 Máquina de Estados

    MenuState → GameState → PauseState → GameState

## 💡 Características Principales

-   Motor propio modular
-   Misiones con progreso
-   Editor / Debug integrado
-   Interacción con NPCs y objetos

## 🏗️ Requisitos

-   Navegador moderno\
-   Servidor local

## 📜 Licencia

No hay.

## Autoevaluación

•	Funcionalidad núcleo 20/25%
•	Mecánicas/IA/Pathfinding o puzzles 10/15%
•	Física/Colisiones 5%/10%
•	Rendimiento 10%
•	UX/UI 8/10%
•	Audio 5%
•	Código/arquitectura 10/15%
•	Documentación/presentación 8/10%
•	Bonus 0%/5%: multijugador simple / minimapa / PWA
**TOTAL: 76/100**

