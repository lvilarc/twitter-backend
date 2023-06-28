const express = require('express');
require('./config/dotenv')();
require('./config/sequelize');

// const User = require('./models/User');
// const Tweet = require('./models/Tweet');



const app = express();
const port = process.env.PORT;
const cors = require('cors');
const routes = require('./routes/routes');




app.use(cors());
const passport = require("passport");
require("./middlewares/jwtPassport")(passport);
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.use('/uploads', express.static('uploads'));


app.listen(port, () => {
  console.log(`${process.env.APP_NAME} app listening at http://localhost:${port}`);
});
