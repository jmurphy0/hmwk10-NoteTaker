const express = require("express");
const fs = require("fs");
const path = require("path");
//const router = require("../../../html101/expressTutorial/routes/api/members");
const app = express();
const PORT = process.env.PORT || 8080;
const uuid = require("uuid");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let noteList = JSON.parse(fs.readFileSync("./db/db.json"), "utf8");
//getting not data in json form from endpoint "/api/notes"
app.get("/api/notes", (req, res) => {
  return res.json(noteList);
});

//getting index.html from endpoitn '*'
app.get("*", (req, res) => {
  res.send(noteList);
});

//getting notes.html from endpoint '/notes'
app.get("/notes", (req, res) => {
  return res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//recieving info note info in req.body + updating bd.json
app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuid.v4(),
    text: req.body.text,
    title: req.body.title,
  };
  if (!newNote.title || !newNote.text) {
    res
      .status(400)
      .json({ msg: "Please include a note and a title for the note." });
  }
  noteList.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
  res.json(noteList);
});

// delete ability by endpoint '/:id'
app.delete("/api/notes/:id", (req, res) => {
  const deleted = noteList.find((note) => note.id === req.params.id);
  if (deleted) {
    noteList = noteList.filter((note) => note.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.status(200).json({ msg: "deleted the note" });
  } else {
    res.status(404).json({ msg: "Note not found" });
  }
});

//creating server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
