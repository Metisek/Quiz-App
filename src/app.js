const express = require('express');
const app = express();
const port = 3000;

// Middleware do obsługi żądań HTTP
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Folder publiczny dla plików statycznych (np. HTML, CSS, JS)

// Obsługa żądania GET dla głównej strony
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Wysyłanie pliku HTML z formularzem
});

// Obsługa żądania POST z formularza
app.post('/submit', (req, res) => {
  const textValue = req.body.text; // Pobranie wartości z pola tekstowego
  res.send(`Odebrano wartość: ${textValue}`);
});

// Start serwera
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
