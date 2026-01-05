const express = require("express");
const cors = require("cors");
const db = require("./db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

app.use("/audio", express.static(UPLOAD_DIR));
app.use("/uploads", express.static(UPLOAD_DIR));

app.post("/recordings", upload.single("audio"), (req, res) => {
  const { id, tags, transcript, sentiment, duration, createdAt } = req.body;

  const sql = `
    INSERT INTO recordings
    (id, blob_path, tags, transcript, sentiment, duration, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      id,
      req.file.path,
      tags,
      transcript,
      sentiment,
      duration,
      createdAt
    ],
    err => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Saved" });
    }
  );
});

app.get("/recordings", (_, res) => {
  db.query(
    "SELECT * FROM recordings ORDER BY created_at DESC",
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

app.put("/recordings/:id", (req, res) => {
  const { tags, transcript, sentiment, duration } = req.body;

  db.query(
    `
    UPDATE recordings
    SET tags = ?, transcript = ?, sentiment = ?, duration = ?
    WHERE id = ?
    `,
    [tags, transcript, sentiment, duration, req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated" });
    }
  );
});

app.delete("/recordings/:id", (req, res) => {
  db.query(
    "DELETE FROM recordings WHERE id = ?",
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
});

app.get("/uploads", (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR).map((name) => {
      const fp = path.join(UPLOAD_DIR, name);
      const stat = fs.statSync(fp);
      return { name, size: stat.size, mtime: stat.mtime };
    });

    files.sort((a, b) => b.mtime - a.mtime);

    const rows = files
      .map((f) => {
        const url = `/uploads/${encodeURIComponent(f.name)}`;
        const sizeKb = Math.round(f.size / 1024);
        const audioPreview =
          /\.(mp3|wav|ogg|m4a|flac)$/i.test(f.name)
            ? `<div><audio controls src="${url}"></audio></div>`
            : "";
        return `<li>
          <a href="${url}" target="_blank" rel="noopener noreferrer">${f.name}</a>
          — ${sizeKb} KB — ${f.mtime.toLocaleString()}
          ${audioPreview}
        </li>`;
      })
      .join("\n");

    res.send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Uploads</title>
  <style>body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial} li{margin:10px 0}</style>
</head>
<body>
  <h1>Uploads</h1>
  <ul>${rows}</ul>
</body>
</html>`);
  } catch (err) {
    res.status(500).send("Unable to read uploads directory");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Backend running on ${PORT}`)
);
