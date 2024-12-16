const fs = require("fs"); // Zum Lesen und Schreiben von Dateien
const dayjs = require("dayjs"); // Für zuverlässige Datumsvergleiche
const express = require("express"); // Webserver
const cors = require("cors"); // Für Cross-Origin-Anfragen

const app = express();
const port = process.env.PORT || 3000;
const dataFile = "./openedDoors.json";

// Example adjustment
const day = requestedDate.date();
const contentIndex = day - 13; // Adjust this calculation as needed
const content = calendarContent[contentIndex];

// Middleware
app.use(cors());
app.use(express.json());

// Adventskalender-Inhalte
const calendarContent = [
    "Ganzkörper-Massage",
    "Kochen eines Wunschgerichts",
    "Wohnung saugen und wischen",
    "Bad gründlich putzen",
    "Ein gemeinsames heißes Schaumbad vorbereiten mit Kerzen",
    "Filmabend mit einem Film deiner Wahl",
    "Einen Tag komplett nach deinen Wünschen gestalten",
    "Fotobuch oder Fotos ausdrucken und zusammen gestalten",
    "Gemeinsames Backen (Plätzchen, Kuchen, etc.)",
    "Spontaner Kurzurlaub oder Tagesausflug planen",
    "Kleidung zusammen aussortieren (und ich kümmere mich um Entsorgung etc.)"
];

// Geladene geöffnete Türchen
let openedDoors = {};
if (fs.existsSync(dataFile)) {
    try {
        openedDoors = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    } catch (error) {
        console.error("Fehler beim Laden der Datei. Starte mit einem leeren Speicher.");
        openedDoors = {};
    }
}

// API-Endpunkt, um Inhalte für ein Türchen zu erhalten
app.post("/get-content", (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({ error: "Kein Datum angegeben!" });
    }

    const requestedDate = dayjs(date);
    const today = dayjs();

    // Allow access to today's date and any past dates
    if (requestedDate.isAfter(today, "day")) {
        return res.status(400).json({ error: "Du kannst keine zukünftige Tür öffnen!" });
    }

    const day = requestedDate.date();
    if (day < 13 || day > 24) {
        return res.status(400).json({ error: "Ungültiges Datum für den Adventskalender!" });
    }

    // Declare content variable once
    let content;

    // Handle Türchen 13 with fixed content
    if (day === 13) {
        content = "Eine Runde Karten- oder Brettspiele zusammen spielen";
    } else {
        // Tür öffnen und Inhalt speichern
        const filteredContent = calendarContent.filter(
            (c) => c !== "Eine Runde Karten- oder Brettspiele zusammen spielen"
        );
        content = filteredContent[day - 14]; // Adjusted index to match the correct content
    }

    // Save the opened door content
    openedDoors[day] = content;

    try {
        fs.writeFileSync(dataFile, JSON.stringify(openedDoors, null, 2));
    } catch (error) {
        console.error("Fehler beim Speichern der Datei:", error);
        return res.status(500).json({ error: "Interner Fehler beim Speichern des Inhalts." });
    }

    return res.json({ content });
});

// Fehlerbehandlungsmiddleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut." });
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
