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
const { connected } = require('process');

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
global.UserActivaties = new Map();
const last60Seconds = [];
const last60minutes = [];
io.on('connection', (socket) => {
    
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
      global.UserActivaties.set(userId, { socketId: socket.id,
        userId: userId,
        connectedAt: new Date(),
      })
      console.log("global",global.userSockets);
  })
 
 
   
    


 

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);
      global.userSockets.delete(socket.userId);
      console.log("global after disconnect",global.userSockets);

  });
})


    setInterval(() => {
      const liveUsers = Array.from(global.userSockets.keys());
      const liveUsersCount = liveUsers.length;
      last60Seconds.push(liveUsersCount-1);
      if (last60Seconds.length > 60) {
        last60Seconds.shift();
      }
      
    io.to(global.userSockets.get('69843421d30a0ace506d9172')).emit("liveUsers", { liveUsers });
    io.to(global.userSockets.get('69843421d30a0ace506d9172')).emit("liveUsersCount", last60Seconds );
   }, 1000);

setInterval(() => {
  
  const liveUsersCount = last60Seconds.reduce((total, single) => single>total ? total = single : total, 0) ;
  if (liveUsersCount === 0)
  {
    last60minutes.push(0);
    }
  else
  {
     last60minutes.push(liveUsersCount);
  }
  
 
  if (last60minutes.length > 60) {
    last60minutes.shift();
  }
  console.log("Live users count last 60 minutes:", last60minutes);
  io.to(global.userSockets.get('69843421d30a0ace506d9172')).emit("liveUsersCount60Min", last60minutes );
}, 60000);

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/admin', adminRouter);
app.use('/notifications', notificationRouter);


server.listen(PORT, () => {
  console.log(`Server is running currently on http://localhost:${PORT}`);
  console.log("socket io is running on http://localhost:" + PORT);
});