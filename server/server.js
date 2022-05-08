require('rootpath')();
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('middlewares/error-handler');
const accountsRoutes = require('routes/accounts.routes')
const foodsRoutes = require('routes/foods.routes')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const whiteList = ['http://localhost:8080']

const corsOptions = {
  origin: (origin, callback) => whiteList.indexOf(origin) !== -1 ? callback(null, true) : callback(null, true),
  credentials: true,
  exposedHeaders: ["set-cookie"]
}

// allow cors requests from origin white list with credentials and exposed header set-cookie
app.use(cors(corsOptions));

// api routes
app.use('/accounts', accountsRoutes);
app.use('/foods', foodsRoutes);

// swagger docs route
app.use('/api-docs', require('helpers/swagger.helper'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => {
  const date = new Date().toLocaleTimeString()
  console.log('[' + date + ']' + ' Server listening on port ' + port);
});
