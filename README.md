# NBA-pipeline

Simulacion de ingenieria de datos con datos historicos de la NBA.

## Entregables

- `cuaderno_nba_pipeline.ipynb`: cuaderno de trabajo detallado en espanol.
- `dashboard_nba.html`: dashboard interactivo que intenta cargar automaticamente un dataset publico de la NBA.
- `tutorial.md`: guia paso a paso de lo realizado.
- `data/nba_player_season_clean.csv`: tabla limpia generada por el scraping.
- `scripts/scrape_clean_nba.js`: script reproducible que descarga, limpia y exporta la tabla.

## Fuente de datos

El dashboard, el cuaderno y el script de scraping usan como fuente principal el archivo publico:

`https://raw.githubusercontent.com/illumitata/NBA/master/data/Seasons_Stats.csv`

Ese archivo contiene estadisticas historicas por jugador y temporada. Si no hay conexion, el dashboard y el script usan una muestra interna para que la demostracion siga funcionando.

## Como abrir el dashboard

Abre el archivo `dashboard_nba.html` en el navegador.

No requiere servidor local. Al abrirlo, intenta descargar el CSV automaticamente, limpia los datos en memoria, transforma metricas y presenta KPIs, graficos y tablas.

## Como generar la tabla limpia del scraping

Desde esta carpeta ejecuta:

```bash
node scripts/scrape_clean_nba.js
```

El resultado queda en `data/nba_player_season_clean.csv`.
