import { vec2 } from "gl-matrix";
import { Quad } from "./quad";
import { Texture } from "./texture";


export class SpriteFontChar {
    constructor(public textureCoords: Quad,
        public size: vec2,
        public advance: number,
        public offset: vec2
        ) {

    }
}

export class SpriteFont {
    private chars: { [id: number]: SpriteFontChar } = {};

    constructor(public readonly texture: Texture,
        public readonly lineHeight: number) {
    }

    public getChar(unicode: number) : SpriteFontChar 
    {
        return this.chars[unicode];
    }

    public createChar(unicode: number, textureCoords: Quad, size: vec2, advance: number, offset: vec2) {
        this.chars[unicode] = new SpriteFontChar(textureCoords, size, advance, offset);
    }

    public measureText(text: string, scale = 1): vec2 {
        let width = 0;
        let height = this.lineHeight * scale;

        for (const stringChar of text) {
            const charCode = stringChar.charCodeAt(0);
            const char = this.getChar(charCode);
            if (char) {
                width += char.advance * scale;
            }
        }

        return vec2.fromValues(width, height);
    }

}