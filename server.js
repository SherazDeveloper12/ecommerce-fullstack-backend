const express =  require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();
const PORT = process.env.PORT ;

app.get('/', (req, res) => {
    
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running currently on http://localhost:${PORT}`);
});