const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const calendarContent = [
    "Ganzkörper-Massage",
    "Kochen eines Wunschgerichts",
    "Wohnung saugen und wischen",
    "Bad gründlich putzen",
    "Ein gemeinsames heißes Schaumbad vorbereiten mit Kerzen",
    "Filmabend mit einem Film deiner Wahl",
    "Einen Tag komplett nach deinen Wünschen gestalten",
    "Eine Runde Karten- oder Brettspiele zusammen spielen",
    "Fotobuch oder Fotos ausdrucken und zusammen gestalten",
    "Gemeinsames Backen (Plätzchen, Kuchen, etc.)",
    "Spontaner Kurzurlaub oder Tagesausflug planen",
    "Kleidung zusammen aussortieren (und ich kümmere mich um Entsorgung etc.)"
];

let openedDoors = {}; // Speichert die geöffneten Inhalte

app.post("/get-content", (req, res) => {
    const { date } = req.body;
    const requestedDate = new Date(date);
    const today = new Date();

    // Vergleiche nur das Datum ohne Zeit
    const requestedDay = requestedDate.toISOString().split("T")[0];
    const todayDay = today.toISOString().split("T")[0];

    if (requestedDay > todayDay) {
        return res.status(400).json({ error: "You cannot open a future door!" });
    }

    const day = requestedDate.getDate();
    if (day < 13 || day > 24) {
        return res.status(400).json({ error: "Invalid date for Advent calendar!" });
    }

    // Gibt den Inhalt zurück, wenn das Türchen bereits geöffnet wurde
    if (openedDoors[day]) {
        return res.json({ content: openedDoors[day] });
    }

    // Markiere das Türchen als geöffnet und speichere den Inhalt
    const content = calendarContent[day - 13];
    openedDoors[day] = content;
    res.json({ content });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
