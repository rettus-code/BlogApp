require('dotenv').config();
const express = require('express');
const config = require('./config/config');
const compression = require ('compression');
const helmet = require('helmet');
const https= require("https");
const fs = require('fs')




const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
//var enforce = require('express-sslify');
const session = require("express-session")
let RedisStore = require("connect-redis")(session)
const User = require("./models/user");

const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');
const { hostname } = require('os');


const app = express();

app.set('view engine', 'ejs');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(mongoSanitize());
app.use(express.static('public'));

  
app.set('trust proxy', 1); // trust first proxy

const port = config.get('port') || 3000;
const blogDB = config.get('db.name')

const blog_db_url =
	config.get('db.db_url') +
	config.get('db.password') +
	config.get('db.host') +
	blogDB +
	'?retryWrites=true&w=majority';


const dbConnection = mongoose.connect(blog_db_url, (err) => {
  if(err){
    console.log(err)
  }
});

// app.use(
// 	session({
// 		secret: config.get('secret'),
// 		resave: false,
//     store: MongoStore.create({
//       mongoUrl: blog_db_url,
//       ttl: 2 * 24 * 60 * 60
//     }),
// 		saveUninitialized: false,
// 		cookie: { secure: 'auto' }
// 	})
// );
// const redis_client = new Redis({
//     port: config.get('redis_port'),
//   connectTimeout: 10000,
//     host: config.get('redis_host')
// });
const { createClient } = require("redis")
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)

app.use(
	session({
		secret: config.get('secret'),
		resave: false,
	store: new RedisStore({
		client: redisClient
	}),
		saveUninitialized: false,
	})
);


app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

app.use(function(req, res, next) {
	res.locals.isAuthenticated=req.isAuthenticated();
	next();
});

app.use('/user', userRouter);

app.use('/post', postRouter);

app.all('*', function(req, res) {
  res.redirect("/post/about");
});
//app.use(enforce.HTTPS({ trustProtoHeader: true }));
const server = https.createServer({
	key: fs.readFileSync('host.key'),
	cert: fs.readFileSync('host.cert')
},app).listen(port,() => {
console.log('Listening ...Server started on port ' + port);
})

module.exports = app;
