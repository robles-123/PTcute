import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


let items = [];
let nextId = 1;

app.post('/items', (req, res) => {
  const { name, author, year } = req.body;
  if (!name || !author || !year) {
    return res.status(400).json({ error: 'Name, author and year are required' });
  }

  // Ensure year is stored as a number
  const newItem = { 
    id: nextId++, 
    name, 
    author, 
    year: parseInt(year)
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.get('/items', (req, res) => {
  res.json(items);
});


app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});


app.put('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const { name, author, year } = req.body;
  if (!name || !author || !year) {
    return res.status(400).json({ error: 'Name, author and year are required' });
  }

  item.name = name;
  item.author = author;
  item.year = parseInt(year);

  res.json(item);
});


app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  const deletedItem = items.splice(index, 1);
  res.json(deletedItem[0]);
});


app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
