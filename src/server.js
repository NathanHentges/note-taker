
const express = require("express");
const path = require("path");
const fs = require("fs");
const nanoid = require("nanoid");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes ---------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/notes.html"));
});


// API Routes ---------
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "../db/db.json"), (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = nanoid.nanoid();
  console.log(newNote);
  fs.readFile(path.join(__dirname, "../db/db.json"), (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);
      fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(notes), (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.json(notes);
        }
      });
    }
  });
});

// Default route
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Listen
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
