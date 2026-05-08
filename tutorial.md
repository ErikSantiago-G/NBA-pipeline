# Tutorial: pipeline de ingeniería de datos con datos de la NBA

## 1. Tema elegido

El tema de la simulación es el rendimiento histórico de jugadores de la NBA por temporada. El objetivo es construir un pipeline que tome estadísticas crudas, las limpie, las organice, las mueva entre capas de almacenamiento y las transforme en indicadores listos para análisis y dashboard.

## 2. Origen y obtención de datos

La fuente principal es un CSV público alojado en GitHub:

`https://raw.githubusercontent.com/illumitata/NBA/master/data/Seasons_Stats.csv`

El archivo incluye datos por jugador y temporada, como año, equipo, posición, edad, partidos jugados, minutos, puntos, rebotes, asistencias, robos, bloqueos y métricas avanzadas.

En una arquitectura real, esta etapa corresponde a la capa de extracción. El dashboard hace la búsqueda/carga automáticamente con `fetch`. El cuaderno usa Python con `urllib.request` y, si la descarga falla, trabaja con una muestra de respaldo para demostrar el flujo.

Además, se incluye el script `scripts/scrape_clean_nba.js`, que ejecuta el scraping automáticamente y entrega una tabla limpia en `data/nba_player_season_clean.csv`.

## 3. Limpieza y organización

Las reglas principales de limpieza son:

- Eliminar filas sin jugador, año o equipo.
- Convertir columnas numéricas desde texto a número.
- Estandarizar nombres de columnas para que sean fáciles de usar.
- Quitar registros duplicados.
- Reemplazar valores vacíos en métricas numéricas con `0` cuando sea razonable.
- Conservar una tabla limpia de hechos con una fila por jugador, equipo y temporada.

Resultado esperado: una tabla `player_season_clean` lista para agregaciones analíticas.

La tabla exportada contiene estas columnas limpias:

| Columna | Descripción |
| --- | --- |
| `season` | Temporada o año del registro |
| `player` | Nombre limpio del jugador |
| `position` | Posición del jugador |
| `age` | Edad |
| `team` | Equipo |
| `games` | Partidos jugados |
| `player_efficiency_rating` | Indicador PER |
| `points` | Puntos totales |
| `rebounds` | Rebotes totales |
| `assists` | Asistencias totales |
| `steals` | Robos |
| `blocks` | Bloqueos |

## 4. Movimiento de datos entre sistemas

La simulación mueve los datos por tres capas:

1. `CSV externo`: fuente cruda descargada desde GitHub.
2. `SQLite staging`: base temporal donde se guarda la tabla cruda.
3. `SQLite analytics`: base analítica donde se guardan tablas limpias y agregadas.

Este movimiento representa un flujo común de ingeniería de datos:

`fuente externa -> zona raw/staging -> zona curada/analytics -> dashboard`

## 5. Transformaciones

Las transformaciones principales son:

- `player_season_clean`: tabla limpia a nivel jugador-temporada.
- `team_season_summary`: resumen por equipo y temporada.
- `season_summary`: resumen por temporada.
- `top_players`: ranking de jugadores por puntos, rebotes, asistencias o eficiencia.

También se crean métricas derivadas como:

- Puntos por partido.
- Rebotes por partido.
- Asistencias por partido.
- Participación ofensiva usando puntos, asistencias y rebotes.

## 6. Dashboard

El archivo `dashboard_nba.html` presenta:

- KPIs generales: temporadas, jugadores, equipos, puntos promedio.
- Filtros por temporada, equipo y posición.
- Gráfico de tendencia por temporada.
- Ranking de jugadores.
- Resumen por equipo.
- Estado del pipeline: extracción, limpieza, transformación y carga.

El dashboard está hecho con HTML, CSS y JavaScript puro. No requiere instalar librerías.

## 7. Resultados finales

Al final del pipeline se obtiene una capa analítica lista para responder preguntas como:

- ¿Qué temporadas tienen mayor promedio de puntos por jugador?
- ¿Qué equipos concentran más producción ofensiva?
- ¿Quiénes son los jugadores líderes según la métrica seleccionada?
- ¿Cómo cambian puntos, rebotes y asistencias a través del tiempo?

## 8. Aprendizajes

Esta simulación muestra que un pipeline de datos no consiste solo en descargar información. También requiere revisar calidad, definir reglas de limpieza, mover datos entre capas, transformar estructuras crudas en modelos analíticos y presentar resultados de forma entendible. Además, el dashboard evidencia por qué una buena preparación de datos facilita la exploración visual y la toma de decisiones.
