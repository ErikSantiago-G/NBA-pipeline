# Simulación de ingeniería de datos: NBA

Entregables de la actividad:

- `cuaderno_nba_pipeline.ipynb`: cuaderno de trabajo detallado en español.
- `dashboard_nba.html`: dashboard interactivo que intenta cargar automáticamente un dataset público de la NBA.
- `tutorial.md`: guía paso a paso de lo realizado.
- `data/nba_player_season_clean.csv`: tabla limpia generada por el scraping.
- `scripts/scrape_clean_nba.js`: script reproducible que descarga, limpia y exporta la tabla.

## Fuente de datos

El dashboard y el cuaderno usan como fuente principal el archivo público:

`https://raw.githubusercontent.com/illumitata/NBA/master/data/Seasons_Stats.csv`

Ese archivo contiene estadísticas históricas por jugador y temporada. Si no hay conexión, el dashboard usa una muestra interna para que la visualización siga funcionando.

## Cómo abrir el dashboard

Abre el archivo `dashboard_nba.html` en el navegador.

No requiere servidor local. Al abrirlo, intenta descargar el CSV automáticamente, limpia los datos en memoria, transforma métricas y presenta KPIs, gráficos y tablas.

## Cómo generar la tabla limpia del scraping

Desde esta carpeta ejecuta:

```bash
node scripts/scrape_clean_nba.js
```

El resultado queda en `data/nba_player_season_clean.csv`.
