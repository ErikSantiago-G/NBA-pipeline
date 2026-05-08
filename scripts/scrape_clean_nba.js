const fs = require("fs");
const path = require("path");

const DATA_URL = "https://raw.githubusercontent.com/illumitata/NBA/master/data/Seasons_Stats.csv";
const projectDir = path.resolve(__dirname, "..");
const dataDir = path.join(projectDir, "data");
const outputPath = path.join(dataDir, "nba_player_season_clean.csv");

const fallbackCsv = `Year,Player,Pos,Age,Tm,G,PER,PTS,TRB,AST,STL,BLK
2022,Nikola Jokic,C,26,DEN,74,32.8,2004,1019,584,109,63
2022,Giannis Antetokounmpo,PF,27,MIL,67,32.1,2002,778,388,72,91
2022,Luka Doncic,PG,22,DAL,65,25.1,1847,593,568,75,36
2021,Stephen Curry,PG,32,GSW,63,26.3,2015,345,363,77,8
2021,Joel Embiid,C,26,PHI,51,30.3,1451,539,145,50,69
2020,James Harden,SG,30,HOU,68,29.1,2335,446,512,125,60
2019,Paul George,SF,28,OKC,77,23.3,2159,628,318,170,34
2018,LeBron James,SF,33,CLE,82,28.6,2251,709,747,116,71
2017,Russell Westbrook,PG,28,OKC,81,30.6,2558,864,840,132,31
2016,Kevin Durant,SF,27,OKC,72,28.2,2029,589,361,69,85`;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some(value => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const headers = rows.shift().map(header => header.trim());
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function numberValue(value) {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function cleanRecords(records) {
  const seen = new Set();
  const clean = [];

  for (const record of records) {
    const row = {
      season: numberValue(record.Year),
      player: String(record.Player || "").replace("*", "").trim(),
      position: String(record.Pos || "NA").trim() || "NA",
      age: numberValue(record.Age),
      team: String(record.Tm || "NA").trim() || "NA",
      games: numberValue(record.G),
      player_efficiency_rating: numberValue(record.PER),
      points: numberValue(record.PTS),
      rebounds: numberValue(record.TRB),
      assists: numberValue(record.AST),
      steals: numberValue(record.STL),
      blocks: numberValue(record.BLK)
    };

    if (!row.season || !row.player || !row.team || row.team === "TOT") continue;

    const key = `${row.season}|${row.player}|${row.team}`;
    if (seen.has(key)) continue;
    seen.add(key);
    clean.push(row);
  }

  return clean.sort((a, b) => b.season - a.season || a.player.localeCompare(b.player));
}

function toCsv(rows) {
  const headers = [
    "season",
    "player",
    "position",
    "age",
    "team",
    "games",
    "player_efficiency_rating",
    "points",
    "rebounds",
    "assists",
    "steals",
    "blocks"
  ];
  const escape = value => {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  return [headers.join(","), ...rows.map(row => headers.map(header => escape(row[header])).join(","))].join("\n");
}

async function main() {
  let csvText = fallbackCsv;
  let source = "muestra interna";

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    csvText = await response.text();
    source = DATA_URL;
  } catch (error) {
    source = `${source} (${error.message})`;
  }

  const clean = cleanRecords(parseCsv(csvText));
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(outputPath, toCsv(clean), "utf8");

  console.log(`Fuente: ${source}`);
  console.log(`Tabla limpia generada: ${outputPath}`);
  console.log(`Filas limpias: ${clean.length}`);
  console.table(clean.slice(0, 10));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
