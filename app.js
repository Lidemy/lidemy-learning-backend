require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bearerToken = require('express-bearer-token');

const routes = require('./routes')
const db = require('./models')
const auth = require('./middlewares/auth')

const app = express()
const port = process.env.PORT || 4002

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bearerToken())
app.post('/v1/register', auth.register)
app.use(auth.checkAuth)

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Listening on port ${port}!`)
})

app.options('*', cors())
app.use('/v1', routes)
