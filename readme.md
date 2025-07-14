📌 **This project is an extended and customized version of [luka712's WebGL Space Shooter Game (Part 19)](https://github.com/luka712/youtube_series/tree/main/WebGL/space_shooter_game/part19).**
>
> Built on top of the original foundation to explore advanced graphics, gameplay improvements, and modern tooling.

# Space Shooter

[![Live Demo](https://img.shields.io/badge/Play%20Now-WebShooting-blue?style=for-the-badge)](https://junpyo0508.github.io/WebShooting/)

A classic 2D space shooter game built with WebGL, offering a retro arcade experience with modern rendering techniques.

## Preview

![Game Screenshot](![alt text](image.png))
*A glimpse of the gameplay — dodge meteors, blast enemies, and survive the waves!*

## Features

*   **Classic Arcade Gameplay:** Engage in fast-paced shooting action against waves of enemies.
*   **WebGL Rendering:** Utilizes WebGL for efficient and customizable 2D graphics.
*   **Sprite Animation:** Dynamic sprite rendering for player, enemies, bullets, and explosions.
*   **Sound Effects:** Immersive audio feedback for in-game actions.
*   **Input Management:** Responsive controls for seamless gameplay.
*   **Post-processing Effects:** Includes bloom and blur effects for enhanced visual appeal.
*   **Diverse Entities:** Encounter various enemies, meteors, and manage bullets and explosions.

## Gameplay

**Objective:**  
Survive as long as you can while shooting down enemy ships and avoiding obstacles.

**Controls:**
- `Arrow Keys` or `WASD`: Move the spaceship
- `Mouse`: (if supported) Navigate or interact with UI elements

## Technologies Used

*   **Vite:** A fast build tool for modern web projects.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **WebGL:** The JavaScript API for rendering interactive 2D and 3D graphics within any compatible web browser without the use of plug-ins.
*   **gl-matrix:** A high-performance matrix and vector math library for WebGL.

## How to Run Locally

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/junpyo0508/WebShooting.git
    cd WebShooting
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start a local development server, usually accessible at `http://localhost:5173/`.

4.  **Build the project (for production):**
    ```bash
    npm run build
    ```
    This will compile the project into the `dist` directory, ready for deployment.

## Deployment

You can deploy the game using GitHub Pages:

```bash
npm run build
```

Then push the contents of the `dist/` folder to your `gh-pages` branch or configure Vite's base path for deployment.

## Contributing

Pull requests are welcome! If you have feature suggestions, bug fixes, or performance improvements, feel free to fork this repository and create a PR.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## Credits

Art used and credits to:

*   **Space Shooter (Redux, plus fonts and sounds)** by Kenney Vleugels (www.kenney.nl) - Licensed under CC0 (http://creativecommons.org/publicdomain/zero/1.0/)
*   [https://opengameart.org/content/seamless-ice](https://opengameart.org/content/seamless-ice)

## License

This project is open source and available under the [MIT License](LICENSE).
