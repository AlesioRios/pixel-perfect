# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Reporte Abalone: cómo actualizar

- **Datos:** todo el contenido experimental vive en `src/data/resultados.ts`. Reemplazá los valores ahí; la página se actualiza sola. `MODO_DISENO = false` oculta la vista previa de la sección 6. Para mostrarla con datos reales, agregá `por_sexo: [{ grupo, n, mae, rmse, r2 }, ...]`.
- **Gráficos:** copiá los PNG en `public/graficos/` con estos nombres: `real_vs_predicho.png`, `residuos_vs_predicho.png`, `hist_residuos.png`, `mae_por_sexo.png`, `pdp.png`, `shap_cascada.png`, `lime.png`. Mientras falten se muestra "Figura pendiente".
- **Efectos:** `src/efectos.ts` (sin librerías). La página se lee completa sin JavaScript.
