require('rootpath')();
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('middlewares/error-handler');
const logger = require('utils/logger');
const swagger = require('utils/swagger');
const accountsRoutes = require('routes/accounts.routes');
const userDataRoutes = require('routes/user-data.routes');
const mealPlanRoutes = require('routes/meal-plan.routes');
const foodsRoutes = require('routes/foods.routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const whiteList = ['http://localhost:8080', 'http://192.168.31.112:8080']

const corsOptions = {
  origin: (origin, callback) => whiteList.indexOf(origin) !== -1 ? callback(null, true) : callback(null, false),
  credentials: true,
  exposedHeaders: ["set-cookie"]
}

// allow cors requests from origin white list with credentials and exposed header set-cookie
app.use(cors(corsOptions));

// api routes
app.use('/accounts', accountsRoutes);
app.use('/user-data', userDataRoutes);
app.use('/meal-plan', mealPlanRoutes);
app.use('/foods', foodsRoutes);

// swagger docs routes
app.use('/api-docs', swagger);

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => {
  const date = new Date().toLocaleTimeString()
  logger.info('[' + date + ']' + ' Express running, listening on port ' + port);
});
