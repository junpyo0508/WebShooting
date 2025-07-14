import { vec2 } from "gl-matrix";
import { Rect } from "../rect";
import { Texture } from "../texture";
import { InputManager } from "../input-manager";
import { Content } from "../content";
import { SpriteRenderer } from "../sprite-renderer";

const SPEED = 0.25;
const INVINCIBILITY_DURATION = 1000; // 1 second of invincibility after being hit

export class Player {
    private movementDirection = vec2.create();
    public drawRect: Rect;
    private sourceRect: Rect;
    private texture: Texture;

    public health = 100; // Max health
    private isInvincible = false;
    private invincibilityTimer = 0;

    // For blinking effect
    private showPlayer = true;
    private blinkTimer = 0;
    private readonly BLINK_INTERVAL = 100;


    constructor(private inputManager: InputManager, private width: number, private height: number) {
        const playerSprite = Content.sprites["playerShip1_blue"];
        this.texture = playerSprite.texture;
        this.drawRect = playerSprite.drawRect.copy();
        this.sourceRect = playerSprite.sourceRect.copy();

        // Center the player at the bottom
        this.drawRect.x = (this.width / 2) - (this.drawRect.width / 2);
        this.drawRect.y = this.height - this.drawRect.height - 20;
    }

    public takeDamage(damage: number) {
        if (this.isInvincible) {
            return;
        }

        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }

        this.isInvincible = true;
        this.invincibilityTimer = INVINCIBILITY_DURATION;
        this.showPlayer = true; // Make sure player is visible when hit
        this.blinkTimer = 0;
    }

    public isDead(): boolean {
        return this.health <= 0;
    }


    public update(dt: number) {
        if (this.isDead()) {
            // If dead, maybe play an animation, for now just do nothing.
            return;
        }

        // Handle invincibility timer
        if (this.isInvincible) {
            this.invincibilityTimer -= dt;

            // Blinking effect
            this.blinkTimer += dt;
            if (this.blinkTimer > this.BLINK_INTERVAL) {
                this.showPlayer = !this.showPlayer;
                this.blinkTimer = 0;
            }

            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.showPlayer = true; // Make sure player is visible when invincibility ends
            }
        }


        this.movementDirection[0] = 0;
        this.movementDirection[1] = 0;

        if (this.inputManager.isKeyDown("ArrowUp")) {
            this.movementDirection[1] = -1;
        }
        if (this.inputManager.isKeyDown("ArrowDown")) {
            this.movementDirection[1] = 1;
        }
        if (this.inputManager.isKeyDown("ArrowLeft")) {
            this.movementDirection[0] = -1;
        }
        if (this.inputManager.isKeyDown("ArrowRight")) {
            this.movementDirection[0] = 1;
        }

        vec2.normalize(this.movementDirection, this.movementDirection);
        vec2.scale(this.movementDirection, this.movementDirection, SPEED * dt);
        this.drawRect.x += this.movementDirection[0];
        this.drawRect.y += this.movementDirection[1];

        // keep player in game bounds
        if(this.drawRect.x < 0)
        {
            this.drawRect.x = 0;
        }
        else if(this.drawRect.x > this.width - this.drawRect.width)
        {
            this.drawRect.x = this.width - this.drawRect.width;
        }

        if(this.drawRect.y < 0)
        {
            this.drawRect.y = 0;
        }
        else if(this.drawRect.y > this.height - this.drawRect.height)
        {
            this.drawRect.y = this.height - this.drawRect.height;
        }
    }

    public draw(spriteRenderer: SpriteRenderer) {
        if (!this.showPlayer) {
            return;
        }
        spriteRenderer.drawSpriteSource(this.texture, this.drawRect, this.sourceRect);
    }
}