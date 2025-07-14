import { vec2 } from "gl-matrix";
import { Rect } from "../rect";
import { SpriteRenderer } from "../sprite-renderer";
import { SpriteFont } from "../sprite-font";
import { Color } from "../color";
import { Content } from "../content";

export class Button {
    public rect: Rect;
    private text: string;
    private font: SpriteFont;
    private textColor: Color;
    private bgColor: Color;
    private scale: number;

    constructor(text: string, x: number, y: number, width: number, height: number, font: SpriteFont, textColor: Color, bgColor: Color, scale: number = 1) {
        this.text = text;
        this.rect = new Rect(x, y, width, height);
        this.font = font;
        this.textColor = textColor;
        this.bgColor = bgColor;
        this.scale = scale;
    }

    public draw(spriteRenderer: SpriteRenderer) {
        // Draw button border
        const borderWidth = 2;
        const borderColor = new Color(1, 1, 1); // White border
        const borderRect = new Rect(
            this.rect.x - borderWidth,
            this.rect.y - borderWidth,
            this.rect.width + borderWidth * 2,
            this.rect.height + borderWidth * 2
        );
        const whitePixelSourceRect = new Rect(0, 0, 1, 1); // 1x1 white pixel for solid colors
        spriteRenderer.drawSpriteSource(Content.whitePixelTexture, borderRect, whitePixelSourceRect, borderColor);

        // Draw button background
        spriteRenderer.drawSpriteSource(Content.whitePixelTexture, this.rect, whitePixelSourceRect, this.bgColor);

        // Draw button text
        const textSize = this.font.measureText(this.text, this.scale);
        const textPos = vec2.fromValues(
            this.rect.x + (this.rect.width / 2) - (textSize[0] / 2),
            this.rect.y + (this.rect.height / 2) - (textSize[1] / 2)
        );
        spriteRenderer.drawString(this.font, this.text, textPos, this.textColor, this.scale);
    }

    public isClicked(mouseX: number, mouseY: number): boolean {
        return mouseX >= this.rect.x &&
               mouseX <= this.rect.x + this.rect.width &&
               mouseY >= this.rect.y &&
               mouseY <= this.rect.y + this.rect.height;
    }
}
