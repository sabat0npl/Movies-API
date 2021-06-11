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

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const port = process.env.port || 8080;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [{
      url: "http://localhost:8080",
    }, ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use(cors());

let auth = require('./routes/auth.js')(app);

app.use("/documentation", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());
app.use(morgan("dev"));

app.use("/movies", moviesRouter);
app.use("/genres", genresRouter);
app.use("/directors", directorsRouter);
app.use("/users", usersRouter);

app.listen(port, () => console.log(`The server is running on port ${port}`));