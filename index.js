const bodyParser = require('body-parser');
const express = require('express'),
  morgan = require('morgan'),
  swaggerUI = require("swagger-ui-express"),
  swaggerJsDoc = require("swagger-jsdoc"),
  moviesRouter = require("./routes/movies.js"),
  genresRouter = require("./routes/genres.js"),
  directorsRouter = require("./routes/directors.js"),
  usersRouter = require("./routes/users.js"),
  mongoose = require('mongoose'),
  Models = require('./js/models.js'),
  Movies = Models.Movie,
  Users = Models.User,
  passport = require('passport'),
  cors = require('cors'),
  {
    check,
    validationResult
  } = require('express-validator');

require('./js/passport.js');

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://brunoza-flix.netlify.app'];
// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    }
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./routes/auth.js')(app);

app.use(express.json());
app.use(morgan("dev"));

app.use("/documentation", swaggerUI.serve, swaggerUI.setup(specs));

app.get('/', (req, res) => {
  res.redirect('/documentation');
});

app.use("/movies", moviesRouter);
app.use("/genres", genresRouter);
app.use("/directors", directorsRouter);
app.use("/users", usersRouter);

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
