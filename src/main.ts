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
import { Rect } from "./rect";

enum GameState {
    Start,
    Playing,
    GameOver
}

const engine = new Engine();
engine.initialize().then(() =>
{
    let gameState = GameState.Start;

    // Initialize game entities (use `let` for reinitialization)
    let player: Player;
    let background: Background;
    let explosionManager: ExplosionManager;
    let bulletManager: BulletManager;
    let highScore: HighScore;
    let enemyManager: EnemyManager;

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
        gameState = GameState.Playing;
    };

    engine.onUpdate = (dt) => {
        if (gameState === GameState.Start) {
            if (engine.inputManager.isMouseClicked) {
                resetGame();
                engine.inputManager.resetMouseClicked();
            }
        } else if (gameState === GameState.Playing) {
            background.update(dt);
            player.update(dt);
            enemyManager.update(dt);
            explosionManager.update(dt);
            bulletManager.update(dt);

            if (player.isDead()) {
                gameState = GameState.GameOver;
            }
        } else if (gameState === GameState.GameOver) {
            background.update(dt); // Keep background moving in game over screen
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

        if (gameState === GameState.Start) {
            const startText = "READY FOR LAUNCH";
            const subText = "CLICK TO BEGIN";
        
            const startScale = 0.65;
            const subScale = 0.55;
        
            const startTextSize = Content.spriteFont.measureText(startText, startScale);
            const subTextSize = Content.spriteFont.measureText(subText, subScale);
        
            const startPos = vec2.fromValues(
                (engine.clientBounds[0] / 2) - (startTextSize[0] / 2),
                (engine.clientBounds[1] / 2) - (startTextSize[1] / 2) - 40
            );
        
            const subPos = vec2.fromValues(
                (engine.clientBounds[0] / 2) - (subTextSize[0] / 2),
                (engine.clientBounds[1] / 2) - (subTextSize[1] / 2) + 40
            );
        
            const alpha = 0.6 + 0.4 * Math.sin(performance.now() / 400);
            const neonBlue = new Color(0.4, 0.8, 1.0, alpha);
        
            engine.spriteRenderer.drawString(Content.spriteFont, startText, startPos, neonBlue, startScale);
            engine.spriteRenderer.drawString(Content.spriteFont, subText, subPos, neonBlue, subScale);
        } else if (gameState === GameState.Playing) {
            background.draw(engine.spriteRenderer);
            player.draw(engine.spriteRenderer);
            enemyManager.draw(engine.spriteRenderer);
            bulletManager.draw(engine.spriteRenderer);
            explosionManager.draw(engine.spriteRenderer);
            highScore.draw(engine.spriteRenderer, player);
        } else if (gameState === GameState.GameOver) {
            // Draw semi-transparent overlay
            // Note: This requires a texture or a way to draw solid colors. Assuming whitePixelTexture exists in Content.
            const overlayColor = new Color(0, 0, 0, 0.6);
            engine.spriteRenderer.drawSprite(Content.whitePixelTexture, new Rect(0, 0, engine.clientBounds[0], engine.clientBounds[1]), overlayColor);

            background.draw(engine.spriteRenderer); // Draw background under the text
            highScore.draw(engine.spriteRenderer, player); // Draw final score and health

            const gameOverText = "GAME OVER";
            const scoreText = `Final Score: ${highScore.currentScore}`;

            const gameOverScale = 1.0;
            const scoreScale = 0.75;

            const gameOverTextSize = Content.spriteFont.measureText(gameOverText, gameOverScale);
            const scoreTextSize = Content.spriteFont.measureText(scoreText, scoreScale);

            const gameOverYOffset = -50;
            const scoreYOffset = 20;

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

            const buttonX = (engine.clientBounds[0] / 2) - (retryButtonWidth / 2);
            const buttonY = scorePos[1] + scoreTextSize[1] + 30;

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

