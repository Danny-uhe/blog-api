import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server as IOServer } from "socket.io";
import { connectDB } from "./config/db.js";
import app from "./app.js";

connectDB();

const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: "*", // change later when frontend is ready
  },
});

// map of userId -> socket ids
const online = new Map();

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;

  if (userId) {
    const set = online.get(userId) || new Set();
    set.add(socket.id);
    online.set(userId, set);
  }

  socket.on("disconnect", () => {
    if (userId) {
      const set = online.get(userId);
      set?.delete(socket.id);
      if (!set || set.size === 0) online.delete(userId);
    }
  });
});

export { io, online };

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});









// import http from "http";
// import { Server as IOServer } from "socket.io";
// import app from "./app.js";

// const server = http.createServer(app);
// const io = new IOServer(server, {
//   cors: { origin: process.env.FRONTEND_URL, credentials: true }
// });

// // map of userId -> socket id(s)
// const online = new Map();

// io.on("connection", (socket) => {
//   const { userId } = socket.handshake.query;
//   if (userId) {
//     const set = online.get(userId) || new Set();
//     set.add(socket.id);
//     online.set(userId, set);
//   }

//   socket.on("disconnect", () => {
//     if (userId) {
//       const set = online.get(userId);
//       set?.delete(socket.id);
//       if (!set || set.size === 0) online.delete(userId);
//     }
//   });
// });

// // export io for controllers to use
// export { io, online };

// server.listen(process.env.PORT || 5000, () => {
//   console.log("Server running ");
// });
















// // import dotenv from 'dotenv';
// // dotenv.config();
// // import { connectDB } from "./config/db.js";
// // import app from "./app.js";

// // connectDB();

// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));