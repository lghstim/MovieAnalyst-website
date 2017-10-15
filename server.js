var express = require('express');
var request = require('superagent');

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

app.use(express.static(__dirname + '/public'));

var NON_INTERACTIVE_CLIENT_ID = 'vTsIQ5i5tAWlX1z3fz2kHnm2Pex8t3jC'
var NON_INTERACTIVE_CLIENT_SECRET = 'QgdYMzFAQ6sOgug8fBXR2dtrH6piOVNKINRmYC6zCzkxuS5SNR0MyhY6C5peZCNZ'

var authData = {
  client_id: NON_INTERACTIVE_CLIENT_ID,
  client_secret: NON_INTERACTIVE_CLIENT_SECRET,
  grant_type: 'client_credentials',
  audience: 'com.movieanalyst.timgorer'
}

// First, authenticate this client and get an access_token
// This could be cached
function getAccessToken(req, res, next){
  request
    .post('https://timgorer.auth0.com/oauth/token')
    .send(authData)
    .end(function(err, res) {
      req.access_token = res.body.access_token
      next();
    })
}

app.get('/', function(req, res){
  res.render('index');
})

app.get('/movies', getAccessToken, function(req, res){
  request
    .get('http://localhost:8080/movies')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      console.log(data);
      if(data.status == 403){
        res.send(403, '403 Forbidden');
      } else {
        var movies = data.body;
        res.render('movies', { movies: movies} );
      }
    })
})

app.get('/authors', getAccessToken, function(req, res){
  request
    .get('http://localhost:8080/reviewers')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if(data.status == 403){
        res.send(403, '403 Forbidden');
      } else {
        var authors = data.body;
        res.render('authors', {authors : authors});
      }
    })
})

app.get('/publications', getAccessToken, function(req, res){
  request
    .get('http://localhost:8080/publications')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if(data.status == 403){
        res.send(403, '403 Forbidden');
      } else {
        var publications = data.body;
        res.render('publications', {publications : publications});
      }
    })
})

app.get('/pending', getAccessToken, function(req, res){
  request
    .get('http://localhost:8080/pending')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if(data.status == 403){
        res.send(403, '403 Forbidden');
      } else {
        var movies = data.body;
        res.render('pending', {movies : movies});
      }
    })
})

app.listen(3000);

