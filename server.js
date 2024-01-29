const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.post('/api/save-price', (req, res) => {
    const ducoPrice = req.body.price;

    if (!ducoPrice) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    // Charger les données existantes du fichier JSON
    let existingData = [];
    try {
        const jsonData = fs.readFileSync('ducoPrices.json', 'utf-8');
        existingData = JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading existing data:', error);
    }

    // Ajouter le nouveau prix aux données existantes
    existingData.push({ timestamp: new Date().toISOString(), price: ducoPrice });

    // Enregistrer les données mises à jour dans le fichier JSON
    try {
        fs.writeFileSync('ducoPrices.json', JSON.stringify(existingData));
    } catch (error) {
        console.error('Error writing data to file:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ success: true });
});

app.get('/prices', (req, res) => {
    // Charger les données existantes du fichier JSON
    let existingData = [];
    try {
        const jsonData = fs.readFileSync('ducoPrices.json', 'utf-8');
        existingData = JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading existing data:', error);
    }

    // Rendre la page avec les données
    res.render('prices', { prices: existingData });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
