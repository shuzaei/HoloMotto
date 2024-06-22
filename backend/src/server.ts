import express from 'express';
import path from 'path';
import cors from 'cors';
import { vtubers } from './data';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/images', (req, res, next) => {
  console.log('Static file request:', req.url);
  next();
}, express.static(path.join(__dirname, '../../frontend/public/images')));

app.get('/api/vtubers', (req, res) => {
  res.json(vtubers);
});

app.get('/api/quote', (req, res) => {
  const randomVTuber = vtubers[Math.floor(Math.random() * vtubers.length)];
  const randomQuote = randomVTuber.quotes[Math.floor(Math.random() * randomVTuber.quotes.length)];
  res.json({ 
    vtuber: randomVTuber.name, 
    quote: randomQuote,
    imageUrl: randomVTuber.imageUrl // この行が存在することを確認
  });
});

app.get('/api/quote/:vtuberId', (req, res) => {
  const vtuberId = req.params.vtuberId;
  const vtuber = vtubers.find(v => v.id === vtuberId);
  
  if (!vtuber) {
    return res.status(404).json({ error: 'VTuber not found' });
  }
  
  const randomQuote = vtuber.quotes[Math.floor(Math.random() * vtuber.quotes.length)];
  res.json({ 
    vtuber: vtuber.name, 
    quote: randomQuote,
    imageUrl: vtuber.imageUrl // ここでimageUrlを必ず含めるようにする
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});