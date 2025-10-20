const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Reviews = require("./models/review.js");
const listing = require("./models/listing");
const router = require("./routes/listing.js");
require("dotenv/config");
const reviewsrouter = require("./routes/reviewsroutes.js");
const MONGO_URL = process.env.MONGO_URI;
const sessions = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userrouter = require("./routes/user.js");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: "mysupersecretcode"
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in MOGO SESSIONS STORE", err)
})

const sessOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 *1000,
    maxAge: 7 * 24 * 60 *1000,
  }
}
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use(sessions(sessOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get('/demouser', async(req,res) => {
//   let fakeuser = new User({
//     email: "gntu@gmail.com",
//     username: "delta-assis"
//   });

//   const registereduser = await User.register(fakeuser, "helloworld");
//   res.send(registereduser);
// });

app.use("/listings", router);
app.use("/listingsrew", reviewsrouter);
app.use("/", userrouter);

app.all("/random", (req, res, next) => {
  next(new ExpressError((statusCode = 404), (message = "Page Not Found!")));
});

app.all("/", (req, res, next) => {
  next(new ExpressError((statusCode = 404), (message = "Page Not Found!")));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { err });
});
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
