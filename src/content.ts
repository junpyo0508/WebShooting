import { vec2 } from "gl-matrix";
import { Rect } from "./rect";
import { Sprite } from "./sprite";
import { Texture } from "./texture";
import { Quad } from "./quad";
import { SpriteFont } from "./sprite-font";
import { Sound } from "./sound";

import spriteSheetImage from "../assets/Spritesheet/sheet.png";
import heartImage from "../assets/heart.png";
import testUvImage from "../assets/test_uv.jpg";
import backgroundImage from "../assets/Backgrounds/purple.png";
import explosionImage from "../assets/explosion.png";
import laserSound from "../assets/Bonus/sfx_laser1.ogg";
import spriteFontXml from "../assets/SpriteFont.xml?url";
import spriteFontImage from "../assets/SpriteFont.png";
import iceImage from "../assets/ice01.jpg";
import sheetXml from "../assets/Spritesheet/sheet.xml?url";

export class Content {
    // sound
    private static audioContext = new AudioContext();
    public static laserSound: Sound;

    private static spriteSheet: Texture;

    public static sprites: { [id: string]: Sprite } = {};
    public static testUvTexture: Texture;
    public static backgroundTexture: Texture;
    public static explosionTexture: Texture;
    public static spriteFont: SpriteFont;
    public static iceTexture: Texture;
    public static heartTexture: Texture; // New: Heart texture for health display
    public static whitePixelTexture: Texture; // New: 1x1 white pixel texture for solid colors

    public static async initialize(gl: WebGL2RenderingContext) {
        this.spriteSheet = await Texture.loadTexture(gl, spriteSheetImage);
        this.heartTexture = await Texture.loadTexture(gl, heartImage); // Load heart texture

        // Create a 1x1 white pixel texture
        const whiteTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, whiteTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        this.whitePixelTexture = new Texture(whiteTexture!, 1, 1);

        this.testUvTexture = await Texture.loadTexture(gl, testUvImage);
        this.backgroundTexture = await Texture.loadTexture(gl, backgroundImage);
        this.explosionTexture = await Texture.loadTexture(gl, explosionImage);

        this.laserSound = await this.loadSound(laserSound);

        this.spriteFont = await this.loadSnowBSpriteFont(gl, 
            spriteFontXml,
            spriteFontImage);

        this.iceTexture = await Texture.loadTexture(gl, iceImage);

        await this.loadSpriteSheet();
    }

    private static async loadSpriteSheet() {
        const sheetXmlReq = await fetch(sheetXml);
        const sheetXmlText = await sheetXmlReq.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(sheetXmlText, "text/xml");

        xmlDoc.querySelectorAll("SubTexture").forEach((subTexture) => {

            const name = subTexture.getAttribute("name")!.replace(".png", "");
            const x = parseInt(subTexture.getAttribute("x")!);
            const y = parseInt(subTexture.getAttribute("y")!);
            const width = parseInt(subTexture.getAttribute("width")!);
            const height = parseInt(subTexture.getAttribute("height")!);

            const drawRect = new Rect(0, 0, width, height);
            const sourceRect = new Rect(x, y, width - 1, height - 1);


            this.sprites[name] = new Sprite(this.spriteSheet, drawRect, sourceRect);
        });
    }

    public static async loadSnowBSpriteFont(gl: WebGL2RenderingContext,
        xmlPath: string, texturePath: string) {
        const texture = await Texture.loadTexture(gl, texturePath);

        const xmlReq = await fetch(xmlPath);
        const xmlText = await xmlReq.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const lineHeight = parseInt(xmlDoc.querySelector("common")!.getAttribute("lineHeight")!);

        const font = new SpriteFont(texture, lineHeight);

        xmlDoc.querySelectorAll("char").forEach((char) => {

            const id = parseInt(char.getAttribute("id")!);
            const x = parseInt(char.getAttribute("x")!);
            const y = parseInt(char.getAttribute("y")!);
            const width = parseInt(char.getAttribute("width")!);
            const height = parseInt(char.getAttribute("height")!);
            const xAdvance = parseInt(char.getAttribute("xadvance")!);
            const xOffset = parseInt(char.getAttribute("xoffset")!);
            const yOffset = parseInt(char.getAttribute("yoffset")!);

            const x1 = x / texture.width;
            const y1 = 1 - (y / texture.height);
            const x2 = (x + width) / texture.width;
            const y2 = 1 - ((y + height) / texture.height);

            const quad = new Quad(
                vec2.fromValues(x1, y1),
                vec2.fromValues(x2, y1),
                vec2.fromValues(x2, y2),
                vec2.fromValues(x1, y2)
            )

            font.createChar(id,
                quad,
                vec2.fromValues(width, height),
                xAdvance,
                vec2.fromValues(xOffset, yOffset));
        });

        return font;
    }

    private static async loadSound(path: string)
    {
        const req = await fetch(path);
        const buffer = await req.arrayBuffer();

        return new Sound(this.audioContext, buffer);
    }
}