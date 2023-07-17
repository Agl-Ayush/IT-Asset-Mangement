// import module/package
const express = require("express");
const bodyParser = require("body-parser");
const cookieparser = require('cookie-parser')
const app = express();
const config = require("config");
const cors = require("cors");
const AppError = require("./utils/appError");
const Routes = require("./routes/indexRoutes");
const errorController = require("./utils/errorController");
const authJwt=require("./middleware/authJwt");

// setting middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());
app.use(express.static("public"));

app.use(cors({
    origin: config.frontURL,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));


// Routes
app.use('/api/',Routes.loginRoutes)
app.use('/api/user',authJwt.verifyToken,authJwt.isAdmin,Routes.userRoutes);
app.use('/api/role',authJwt.verifyToken,authJwt.isAdmin,Routes.roleRoutes);

// setting error path
app.use('*',(req, res, next) => {
    throw new AppError('Requested Url '+req.originalUrl+' not found!',404);
});

// setting another error program
app.use(errorController);

// export app
module.exports = app;