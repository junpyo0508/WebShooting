import { vec2 } from "gl-matrix";
import { SpriteRenderer } from "../sprite-renderer";
import { Content } from "../content";
import { Player } from "./player";
import { Rect } from "../rect";
import { Color } from "../color";

export class HighScore
{
    public currentScore = 0;

    private scorePosition = vec2.fromValues(10, 10);

    // Heart icon properties
    private heartIconSize = 30;
    private heartIconSpacing = 5;
    private heartIconStartPosition = vec2.fromValues(445, 855);

    constructor() {
    }

    public draw(spriteRenderer: SpriteRenderer, player: Player)
    {
        // Draw score
        spriteRenderer.drawString(
            Content.spriteFont,
            "Score: " + this.currentScore,
            this.scorePosition,
            undefined,
            0.5);

        // Draw health as heart icons
        const maxHearts = 4;
        const currentHearts = Math.floor(player.health / (100 / maxHearts)); // Assuming health is out of 100

        for (let i = 0; i < maxHearts; i++) {
            const heartRect = new Rect(
                this.heartIconStartPosition[0] + i * (this.heartIconSize + this.heartIconSpacing),
                this.heartIconStartPosition[1],
                this.heartIconSize,
                this.heartIconSize
            );

            // Draw full heart if current health allows, otherwise draw an empty/faded heart (or skip)
            if (i < currentHearts) {
                spriteRenderer.drawSprite(Content.heartTexture, heartRect);
            } else {
                // Optionally draw an empty heart or a faded heart
                // For now, we'll just draw a faded one if the texture supports it, or skip.
                // Assuming heartTexture has a full heart. If you have an empty heart texture, use that.
                spriteRenderer.drawSprite(Content.heartTexture, heartRect, new Color(0.5, 0.5, 0.5)); // Faded color
            }
        }
    }
}