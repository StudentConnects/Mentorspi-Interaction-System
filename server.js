const debug = require('debug')('mentorship:server:app.js');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const {
//   Pool
// } = require('pg');

const { redisDatabase:redisClient, postgreDatabase:pool , loginUser } = require('./tools/database');
const helmet = require("helmet");
const compression = require("compression");
const session = require('express-session');
// const redis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const {
  RateLimiterRedis
} = require('rate-limiter-flexible');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;

// Required Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const { countReset } = require('console');

// Variables Required
const app = express();
const ONE_DAY = 1000 * 60 * 60 * 24;
const hrs_2 = 1000 * 60 * 60 * 2;
try {
  debug("Trial");

  // const redisClient = new redis(process.env.STACKHERO_REDIS_URL_TLS);
  // (async () => {
  //   debug("into IIFE");
  //   // console.log(redisClient);
  //   debug(await redisClient.get("abcd"));
  // })()
  const sessionStore = new RedisStore({
    client: redisClient,
    ttl: ONE_DAY
  });
  // const pool = new Pool({
  //   connectionString: process.env.DATABASE_URL
  // });

  // attach all the middleware
  app.use(compression());
  // app.use(helmet());
  // app.use(
  //   helmet.contentSecurityPolicy({
  //     directives: {
  //       defaultSrc: ["'self'", "maxcdn.bootstrapcdn.com", "fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
  //       scriptSrc: ["'self'", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],
  //       // "style-src-elem": ["'self'", "cdnjs.cloudflare.com", "maxcdn.bootstrapcdn.com", "cdn.jsdelivr.net", "fonts.googleapis.com"],
  //       "img-src": ["data:", "'self'"]
  //     },
  //   })
  // );

  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(cookieParser(process.env.sessionSecret));
  app.use(express.static(path.join(__dirname, 'public')));

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    // sess.cookie.secure = true // serve secure cookies
    // const csurf = require('csurf');
    // app.use(csurf);

    app.use(session({
      name: "cookie_id",
      secret: process.env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: ONE_DAY,
        sameSite: true,
        secure: true,
        httpOnly: true
      },
      // unset: 'destroy',
      // rolling: true
    }));
  } else {
    const cors = require('cors');
    app.use(cors());
    app.use(session({
      name: "cookie_id",
      secret: process.env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: ONE_DAY,
        sameSite: true,
        // secure: true,
        httpOnly: true
      },
      // unset: 'destroy',
      // rolling: true
    }));
  }

  app.use((req, res, next) => {
    req.db = pool;
    next();
  });



  passport.use(new passportLocal({
    usernameField: 'email',
    passwordField: 'password'
  }, async function (email, givenPassword, done) {
    debug("LINE 20");
    debug(email, givenPassword);
    // return pool.query(`Select * from user_table where email = '${email}'`)
    // pool.query('Select * from user_table')  
    return loginUser(email)
    .then(results => {
      if(results){
        console.log(results.rows)
      }else{
        debug("Invalid Email");
          done(null, false);
      }
      
        if (results.rows.length > 0) {
          const {id,password,user_name,user_type,isActive,isVerified,verificationLink} = results.rows[0];
          if (password == givenPassword) {
            console.log("Success");
            done(null, {id,user_name,user_type,isActive,isVerified,verificationLink});
          } 
          else {
            debug("Invalid Password");
            done(null, false);
          }
        } else {
          debug("Invalid Email");
          done(null, false);
        }
      })
      .catch(err => {
        debug(err);
        done(err);
      });
  }));

  passport.serializeUser(function (user, done) {
    debug("LINE 153");
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    debug("LINE 158");
    return done(null, user);

  });
  app.use(passport.initialize());
  app.use(passport.session());


  // app.use('/users',(req, res, next) => {if(req.isAuthenticated()){debug("IN /users while Authenticated");next();} else {debug("IN /users while UnAuthenticated"); res.redirect("/login");}}, usersRouter);
  app.use('/users', usersRouter);
  app.use('/', indexRouter);


} catch (e) {
  debug(e);
}
process.on('unhandledRejection', (reason) => {
  // I just caught an unhandled promise rejection,
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  debug(reason);
  return reason;
});
module.exports = app;