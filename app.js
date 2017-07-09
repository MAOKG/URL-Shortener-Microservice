var express = require('express')
    app = express()
    mongoose = require('mongoose')
    validUrl = require('valid-url')

// Connect database
db_url = process.env.DATABASEURL || 'mongodb://localhost/url_shortener'
mongoose.connect(db_url, {
  useMongoClient: true
})

// Schema setup
var urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String
})

var Url = mongoose.model('Url', urlSchema)

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  res.render('landing')
})

// Pass URL
app.get('/new/*', function(req, res) {
  res.send(req.url)
})

// Visit shortened URL
app.get('/:short', function(req,res) {

})

app.listen(3000, function() {
  console.log('The server has started!')
})

// app.listen(process.env.PORT, process.env.IP, function() {
//    console.log('The Server Has Started!');
// })
