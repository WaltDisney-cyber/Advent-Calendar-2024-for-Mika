app.post("/get-content", (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({ error: "Kein Datum angegeben!" });
    }

    const requestedDate = dayjs(date);
    const today = dayjs();

    // Verhindere das Öffnen zukünftiger Türen
    if (requestedDate.isAfter(today, "day")) {
        return res.status(400).json({ error: "Du kannst keine zukünftige Tür öffnen!" });
    }

    const day = requestedDate.date();
    if (day < 13 || day > 24) {
        return res.status(400).json({ error: "Ungültiges Datum für den Adventskalender!" });
    }

    // Tür 13 hat immer denselben Inhalt
    if (day === 13) {
        const content = "Eine Runde Karten- oder Brettspiele zusammen spielen";
        openedDoors[day] = content;

        // Speichern
        try {
            fs.writeFileSync(dataFile, JSON.stringify(openedDoors, null, 2));
        } catch (error) {
            console.error("Fehler beim Speichern der Datei:", error);
            return res.status(500).json({ error: "Interner Fehler beim Speichern des Inhalts." });
        }

        return res.json({ content });
    }

    // Prüfen, ob die Tür schon geöffnet wurde
    if (openedDoors[day]) {
        return res.json({ content: openedDoors[day] });
    }

    // Tür öffnen und Inhalt speichern
    const content = calendarContent.filter(c => c !== "Eine Runde Karten- oder Brettspiele zusammen spielen")[day - 14];
    openedDoors[day] = content;

    try {
        fs.writeFileSync(dataFile, JSON.stringify(openedDoors, null, 2));
    } catch (error) {
        console.error("Fehler beim Speichern der Datei:", error);
        return res.status(500).json({ error: "Interner Fehler beim Speichern des Inhalts." });
    }

    res.json({ content });
});
