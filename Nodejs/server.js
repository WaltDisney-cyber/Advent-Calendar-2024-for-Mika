const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Advent calendar content
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

let openedDoors = {}; // Track opened doors

app.use(express.json());

app.post("/get-content", (req, res) => {
    const { date } = req.body;
    const requestedDate = new Date(date);
    const today = new Date();

    // Validate date
    if (requestedDate > today) {
        return res.status(400).json({ error: "You cannot open a future door!" });
    }

    const day = requestedDate.getDate();
    if (day < 13 || day > 24) {
        return res.status(400).json({ error: "Invalid date for Advent calendar!" });
    }

    // Check if the door is already opened
    if (openedDoors[day]) {
        return res.status(400).json({ error: "This door is already opened!" });
    }

    // Mark door as opened and return the content
    const content = calendarContent[day - 13];
    openedDoors[day] = true;
    res.json({ content });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
