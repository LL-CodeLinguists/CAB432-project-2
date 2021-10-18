const path = require('path')
const express = require('express')
const axios = require('axios')
const Twitter = require('twitter');
const app = express()
const port = 3000

// Serve out any static assets correctly
app.use(express.static('../client/build'))


//twitter JWT
var client = new Twitter({
  consumer_key: 'kjIOyV8nga2VTJSZQ7eb8c3ut',
  consumer_secret: '4UgYx9wDjGFrzS4AnGIfXQqnVk6vowdl0Yx8X65iiXIqXy5rQC',
  access_token_key: '1433642779314311171-yFSBGOCtm5qOxQo2rDR4cWyC9X0Wvw',
  access_token_secret: 'A1wPzENn2NfZ209XtIgkeLGm5SUSnTUlV8pIusY3oPRpR'
});



/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
client.stream('statuses/filter', {track: 'twitter'},  function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

// What's your favorite animal?
app.get('/api/question', (req, res) => {
  res.json({ answer: 'Llama' })
})

// New api routes should be added here.
// It's important for them to be before the `app.use()` call below as that will match all routes.

// Any routes that don't match on our static assets or api should be sent to the React Application
// This allows for the use of things like React Router
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
