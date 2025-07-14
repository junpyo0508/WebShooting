import { vec2 } from "gl-matrix";

export class InputManager 
{
    private keyDown: { [key: string]: boolean } = {};
    private _isMouseClicked = false;
    private _mouseClickPosition = vec2.create();

    public initialize() 
    {
        window.addEventListener("keydown", e => this.keyDown[e.key] = true);
        window.addEventListener("keyup",  e => this.keyDown[e.key] = false);
        window.addEventListener("click", (e) => {
            this._isMouseClicked = true;
            this._mouseClickPosition[0] = e.clientX;
            this._mouseClickPosition[1] = e.clientY;
        });
    }

    public isKeyDown(key: string): boolean 
{
        return this.keyDown[key];
    }

    public isKeyUp(key: string): boolean 
    {
        return !this.keyDown[key];
    }

    public get isMouseClicked(): boolean {
        return this._isMouseClicked;
    }

    public get mouseClickPosition(): vec2 {
        return this._mouseClickPosition;
    }

    public resetMouseClicked(): void {
        this._isMouseClicked = false;
    }
}