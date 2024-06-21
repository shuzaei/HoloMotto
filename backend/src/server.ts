import express from 'express';
import cors from 'cors';
import { vtubers } from './data';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/vtubers', (req, res) => {
  res.json(vtubers);
});

app.get('/api/quote', (req, res) => {
  const randomVTuber = vtubers[Math.floor(Math.random() * vtubers.length)];
  const randomQuote = randomVTuber.quotes[Math.floor(Math.random() * randomVTuber.quotes.length)];
  res.json({ vtuber: randomVTuber.name, quote: randomQuote });
});

app.get('/api/quote/:vtuberId', (req, res) => {
  const vtuberId = req.params.vtuberId;
  const vtuber = vtubers.find(v => v.id === vtuberId);
  
  if (!vtuber) {
    return res.status(404).json({ error: 'VTuber not found' });
  }
  
  const randomQuote = vtuber.quotes[Math.floor(Math.random() * vtuber.quotes.length)];
  res.json({ vtuber: vtuber.name, quote: randomQuote });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});