import { Engine } from "./engine";
import { Background } from "./game/background";
import { BulletManager } from "./game/bullet-manager";
import { EnemyManager } from "./game/enemy-manager";
import { ExplosionManager } from "./game/explosion-manager";
import { Player } from "./game/player";
import { HighScore } from "./game/high-score";
import { vec2 } from "gl-matrix";
import { Content } from "./content";
import { Button } from "./ui/button"; // Import the new Button class
import { Color } from "./color"; // Import Color for button styling

enum GameState {
    Playing,
    GameOver
}

const engine = new Engine();
engine.initialize().then(() =>
{
    let gameState = GameState.Playing;

    // Initialize game entities (use `let` for reinitialization)
    let player = new Player(engine.inputManager, engine.clientBounds[0], engine.clientBounds[1]);
    let background = new Background(engine.clientBounds[0], engine.clientBounds[1]);
    let explosionManager = new ExplosionManager();
    let bulletManager = new BulletManager(player);
    let highScore = new HighScore();
    let enemyManager = new EnemyManager(engine.clientBounds[0],
        engine.clientBounds[1],
        player,
        explosionManager,
        bulletManager,
        highScore);

    const bloomEffect = engine.effectsFactory.createBloomEffect();

    // Define the retry button
    const retryButtonWidth = 200;
    const retryButtonHeight = 65;
    const retryButtonScale = 0.7; // Scale for button text
    const retryButtonText = "RETRY";
    const retryButtonTextColor = new Color(1, 1, 1); // White text
    const retryButtonBgColor = new Color(0.2, 0.5, 0.8); // Blue background

    let retryButton: Button; // Declare retryButton here

    // Function to reset the game state
    const resetGame = () => {
        gameState = GameState.Playing;
        player = new Player(engine.inputManager, engine.clientBounds[0], engine.clientBounds[1]); // Reinitialize player
        background = new Background(engine.clientBounds[0], engine.clientBounds[1]); // Reinitialize background
        explosionManager = new ExplosionManager(); // Reinitialize explosion manager
        bulletManager = new BulletManager(player); // Reinitialize bullet manager with new player
        highScore = new HighScore(); // Reset score
        enemyManager = new EnemyManager(engine.clientBounds[0],
            engine.clientBounds[1],
            player,
            explosionManager,
            bulletManager,
            highScore); // Reinitialize enemy manager with new player and score
    };

    engine.onUpdate = (dt) => {
        background.update(dt); // Always update background for a moving effect

        if (gameState === GameState.Playing) {
            player.update(dt);
            enemyManager.update(dt);
            explosionManager.update(dt);
            bulletManager.update(dt);

            if (player.isDead()) {
                gameState = GameState.GameOver;
            }
        } else if (gameState === GameState.GameOver) {
            // Handle retry button click
            if (engine.inputManager.isMouseClicked) {
                const mouseX = engine.inputManager.mouseClickPosition[0];
                const mouseY = engine.inputManager.mouseClickPosition[1];

                // Convert mouse coordinates to canvas coordinates
                const canvasRect = engine.canvas.getBoundingClientRect();
                const canvasX = mouseX - canvasRect.left;
                const canvasY = mouseY - canvasRect.top;

                if (retryButton.isClicked(canvasX, canvasY)) {
                    resetGame();
                }
                engine.inputManager.resetMouseClicked(); // Reset click state after checking
            }
        }
    }

    engine.onDraw = () => {

        bloomEffect.bind();

        engine.spriteRenderer.begin();

        background.draw(engine.spriteRenderer);
        player.draw(engine.spriteRenderer);
        enemyManager.draw(engine.spriteRenderer);
        bulletManager.draw(engine.spriteRenderer);
        explosionManager.draw(engine.spriteRenderer);
        highScore.draw(engine.spriteRenderer, player);

        if (gameState === GameState.GameOver) {
            const gameOverText = "GAME OVER";
            const scoreText = `Final Score: ${highScore.currentScore}`;

            // Adjust scales for better fit
            const gameOverScale = 1.0; // Reduced from 1.5
            const scoreScale = 0.75;   // Reduced from 1.0

            const gameOverTextSize = Content.spriteFont.measureText(gameOverText, gameOverScale);
            const scoreTextSize = Content.spriteFont.measureText(scoreText, scoreScale);

            // Adjust vertical positions for better spacing
            const gameOverYOffset = -50; // Move up from center
            const scoreYOffset = 20;    // Move down from center

            const gameOverPos = vec2.fromValues(
                (engine.clientBounds[0] / 2) - (gameOverTextSize[0] / 2),
                (engine.clientBounds[1] / 2) - (gameOverTextSize[1] / 2) + gameOverYOffset
            );

            const scorePos = vec2.fromValues(
                (engine.clientBounds[0] / 2) - (scoreTextSize[0] / 2),
                (engine.clientBounds[1] / 2) - (scoreTextSize[1] / 2) + scoreYOffset
            );

            engine.spriteRenderer.drawString(Content.spriteFont, gameOverText, gameOverPos, undefined, gameOverScale);
            engine.spriteRenderer.drawString(Content.spriteFont, scoreText, scorePos, undefined, scoreScale);

            // Draw the retry button
            const buttonX = (engine.clientBounds[0] / 2) - (retryButtonWidth / 2);
            const buttonY = scorePos[1] + scoreTextSize[1] + 30; // Position below score text

            retryButton = new Button(
                retryButtonText,
                buttonX,
                buttonY,
                retryButtonWidth,
                retryButtonHeight,
                Content.spriteFont,
                retryButtonTextColor,
                retryButtonBgColor,
                retryButtonScale
            );
            retryButton.draw(engine.spriteRenderer);
        }

        engine.spriteRenderer.end();

        bloomEffect.draw();
    }

    engine.draw();
});

