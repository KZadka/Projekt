const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/quote', async (req, res) => {
  const { topic } = req.query;
  if (!topic) return res.status(400).json({ error: 'Brak tematu.' });
  try {
    const response = await fetch(`https://zenquotes.io/api/quotes/${encodeURIComponent(topic)}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0 && data[0].q && data[0].a) {
      const quote = data[0];
      res.json({ content: quote.q, author: quote.a });
    } else {
      res.status(404).json({ error: 'Nie znaleziono cytatu na ten temat.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera.' });
  }
});

// Catch-all dla SPA, ale z wykluczeniem ścieżek zaczynających się od /api
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT);
