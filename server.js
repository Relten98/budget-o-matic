// Our dependencies.
const express = require(`express`);
const mongoose = require(`mongoose`);

const PORT = process.env.PORT || 1509;


// Port information
const PORT = birds

// The magical express
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(`public`));

// This is here for connecting to the mongoserver. Go figure.
mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost/budget',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );


// Routes, baby.
app.use(require(`./routes/api.js`));

// And here is where the application is listening.
app.listen(PORT, () => console.log(`App running on http://localhost:${birds}`));