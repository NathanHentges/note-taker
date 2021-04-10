
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
      fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(notes), (error, data2) => {
        if (err) {
          console.log(error);
        } else {
          res.json(notes);
        }
      });
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(path.join(__dirname, "../db/db.json"), (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const notes = JSON.parse(data);
      // Delete note with given ID
      const { id } = req.params;
      const filteredNotes = notes.filter((note) => note.id !== id);
      console.log(id);
      console.log(notes);
      console.log(filteredNotes);
      fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(filteredNotes), (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.send("ok");
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
