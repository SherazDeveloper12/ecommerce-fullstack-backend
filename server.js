const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const main = require('./src/config/db');
const jwt = require('jsonwebtoken');
const productRouter = require('./src/routes/productRoutes');
const dotenv = require('dotenv');
dotenv.config()
const app = express();
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const authRouter = require('./src/routes/authRoutes');
const orderRouter = require('./src/routes/orderRoutes');
const adminRouter = require('./src/routes/AdminRoutes');
const notificationRouter = require('./src/routes/NotificationRoutes');
const authModel = require('./src/models/authmodel');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// connect to database
main()

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

global.io = io;
global.userSockets = new Map();

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);

  
  socket.on('authenticate', async(data) => {
    const { token } = data;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded._id;
      const user = await authModel.findById(userId);
      if (!user) {
        socket.emit('authenticationError', { message: 'User not found' });
        return;
      }
      socket.userId = userId;  
      global.userSockets.set(userId, socket.id);
      console.log("global",global.userSockets);
      const role = user.role;
      if (role === 'admin') {}

    } catch (error) {
      socket.emit('authenticationError', { message: 'Invalid token' });
    }
  })
  socket.on('authenticateGuest', (data) => {
    console.log("guest data",data);
    const { userId } = data;
      socket.userId = userId;
      global.userSockets.set(userId, socket.id);
      console.log("global",global.userSockets);
  })
 
 
   setInterval(() => {
      const liveUsers = Array.from(global.userSockets.keys());
    io.to(global.userSockets.get('69843421d30a0ace506d9172')).emit("liveUsers", { liveUsers });
   }, 1000);
    


  socket.on("newOrder", (order) => {
    // broadcast the new order to all 
    socket.emit('newOrder',{ message: 'Your order has been received!' });
    // broadcast the new order confirmation with the specific socket id to the client that placed the order
    io.to(global.userSockets.get('69843421d30a0ace506d9172')).emit('newOrder',  { message: 'A new order has been placed!', order: order });
  })

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);
      global.userSockets.delete(socket.userId);
      console.log("global after disconnect",global.userSockets);

  });
})

    

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/admin', adminRouter);
app.use('/notifications', notificationRouter);


server.listen(PORT, () => {
  console.log(`Server is running currently on http://localhost:${PORT}`);
  console.log("socket io is running on http://localhost:" + PORT);
});