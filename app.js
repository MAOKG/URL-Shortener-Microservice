var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    validUrl = require('valid-url');

mongoose.Promise = global.Promise;
// Connect database
db_url = process.env.DATABASEURL || 'mongodb://localhost/url_shortener';
mongoose.connect(db_url, {
  useMongoClient: true
})

// Schema setup
var urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String
})

var Url = mongoose.model('Url', urlSchema);

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('landing');
});


// Pass URL
app.get('/new/*', function(req, res) {
  var original_url = req.params[0];

  // Validate URL
  if (validUrl.isUri(original_url)) {
    Url.findOne({originalUrl: original_url}).exec(function(err, foundUrl) {
      if (!foundUrl) {

        var newUrl = {originalUrl: original_url, shortCode: createShortCode().toString()};

        Url.create(newUrl, function(err, createdUrl) {
          if (err) {
            res.send('Error, fail to create shortened url');
          } else {
            console.log('Create new url');
            res.send({
              original_url: original_url,
              shortened_url: req.protocol+'://'+req.get('host')+'/'+createdUrl.shortCode
            });
          }
        });
      } else {
        console.log('Already exist');
        res.send({
          original_url: original_url,
          shortened_url: req.protocol+'://'+req.get('host')+'/'+foundUrl.shortCode
        });
      }
    });
  } else {
    res.send({error: 'Invalid URL'});
  }
})

// Visit shortened URL/undefined
app.get('/:short', function(req,res) {
  Url.findOne({shortCode: req.params.short}).exec(function(err, foundUrl) {
    if(!foundUrl) {
      res.send({error: 'URL is not in the database'});
      // console.log(Url.find({shortCode: '778'}));
    } else {
      res.redirect(foundUrl.originalUrl);
    }
  });
});

// app.listen(3000, function() {
//   console.log('The server has started!');
// });
app.listen(process.env.PORT, process.env.IP, function() {
   console.log('The Server Has Started!');
})


// Helper method to create shortened code
function createShortCode() {
  var code = Math.round(Math.random()*10000);
  Url.findOne({shortCode: code}).exec(function(err, foundUrl) {
    if (foundUrl){
      return createShortCode();
    }
  })
  return code;
}
