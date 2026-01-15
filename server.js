const express =  require('express');
const cors = require('cors');
const main = require('./src/config/db');
const productRouter = require('./src/routes/productRoutes');
const dotenv = require('dotenv').config();
const app = express();
const PORT = process.env.PORT ;
const bodyParser = require('body-parser')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// connect to database
main()
global.clients = [];
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/products', productRouter);

app.listen(PORT, () => {
  console.log(`Server is running currently on http://localhost:${PORT}`);
});