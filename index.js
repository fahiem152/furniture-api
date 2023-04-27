const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const seesion = require('express-session')


const app = express();
// const port = 8080;
const port = 8080;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(seesion({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    res.send('Hello ini adalah Api dari Furniture buatanku ssendiri')
  })
routes(app)

app.listen(port, () => {
    // console.log(`Server is running on http://192.168.43.121:${port}`)
    console.log(`Server is running on http://192.168.43.121:${port}`)
    // console.log(`Server is running on http://localhost:${port}`)
});