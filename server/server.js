// const { instrument } = require('@socket.io/admin-ui');
const path = require('path');
const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
// const axios = require('axios');
const databaseFunction = require('./controllers/databaseController');
const lyricsFunction = require('./controllers/lyricsapiController');
app.use(express.json());
app.use(express.static(path.join(__dirname, './../build')));

const users = {};
let guesses = [];
let songname;
const socketToCookie = {};
let winnerFound = false;

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

app.use('/api', apiRoutes);
app.use('/users', userRoutes);

const server = http.createServer(app);

const io_server = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://admin.socket.io'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io_server.on('connection', (socket_connection) => {
  console.log('user connected', socket_connection.id);

  socket_connection.on('disconnect', async (res) => {
    console.log('user disconnected');

    const userCookie = socketToCookie[socket_connection.id];
    const username = await databaseFunction.getUserName(userCookie);

    if (username in users) {
      delete users[username];
    }

    delete socketToCookie[socket_connection.id];

    console.log('Users logged in:', users);
    io_server.emit('emmiting_to_users', users);
  });

  socket_connection.on('i_have_joined', async (res) => {
    console.log('in user has joined server.js');
    console.log('this user has joined', res.user_cookies);

    const username = await databaseFunction.getUserName(res.user_cookies);

    socketToCookie[socket_connection.id] = res.user_cookies;

    if (!Object.keys(users).includes(username) && username !== undefined) {
      users[username] = 0;
    }
    console.log('users map, :', users);

    io_server.emit('emmiting_to_users', users);
    console.log('Users logged in:', users);
  });

  socket_connection.on('ready_to_play', async () => {
    // call function to get tracks
    const response = await lyricsFunction.getTopSongs();
    // songName = response.song;
    console.log(response);
    winnerFound = false;
    guesses = [];
    io_server.emit('display_guess', guesses);
    console.log(response);
    songname = response.song_name.toLowerCase();
    console.log(songname, 'songname in server.js');
    // console.log(response, 'ready_to_play receiving request');
    // emit lyrics array
    // console.log('about to emit to frontend');
    // console.log('response:', response);
    io_server.emit('get_lyrics_from_server', response.lyrics);
  });

  socket_connection.on('check_answer', async (res) => {
    console.log('inside check answer');
    console.log(res.guess);
    console.log(winnerFound);
    console.log(songname, ' this is the song name');
    const username = await databaseFunction.getUserName(res.user_cookies);
    if (winnerFound !== true && res.guess === songname) {
      console.log(username);
      users[username]++;
      // sort
      // const sortedUsers = {};
      // const sortedArray = [];
      // Object.keys(users)
      // for (let property in users) {
      //   sortedArray.push(property,users[property]);
      // }
      // sortedArray.sort((a,b)=> {
      //   return (b[1] - a[1])
      // })

      const sortedUsers = Object.fromEntries(
        Object.entries(users).sort(([, a], [, b]) => b - a)
      );

      io_server.emit('emmiting_to_users', sortedUsers);
      io_server.emit('display_winner', username);
      winnerFound = true;
    } else {
      guesses.push({ username, guess: res.guess });
      // guesses[username] = res.guess;
      io_server.to(socket_connection.id).emit('you_guessed_wrong');
      io_server.emit('display_guess', guesses);
    }
  });
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = {
    ...defaultErr,
    log: err.log,

    message: err.message,
  };
  console.log(errorObj.log);

  res.status(errorObj.status).json(errorObj.message);
  //   res.locals.message = err.message;
  //   console.log('ERROR: ', err);
  //   const errorStatus = err.status
  //  || 500;
  //   return res.status(errorStatus).send(res.locals.message);
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
