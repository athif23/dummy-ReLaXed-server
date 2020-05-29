import HTML2PDF from './lib/HTML2PDF.js';

const express = require('express');
const path = require('path');
const { performance } = require('perf_hooks');

const HOST = 'localhost';
const PORT = 3000;

const app = express();

app.use(express.json());

app.post('/generate', async (req, res) => {
  const perStart = performance.now()
  await HTML2PDF.pdf('./templates/template.html', {}, path.resolve('./output/temp.html'), path.resolve('./output/output.pdf'));
  const time = (performance.now() - perStart) / 1000;
  res.send("Finished in " + time);
})

app.listen(PORT, () => console.log('Starting server in: ' + `${HOST}:${PORT}`));