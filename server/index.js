const path = require('path')
const express = require('express')
const axios = require('axios').default;
const Twitter = require('twitter');
const { response } = require('express');
const app = express()
const port = 3000

// Serve out any static assets correctly
app.use(express.static('../client/build'))


let query = "Apple"
let bearToken = `AAAAAAAAAAAAAAAAAAAAABgCUwEAAAAAulp6nbJYV0eZsgfF%2F35nkcbcfxg%3DOZypHZyuxqwyuai3ngiy2ZUiW4pMCgk93c5Qk8M3jxhsLHU0be`


var all_tweets = {
  method: "GET",
  url: `https://api.twitter.com/2/tweets/search/all?query=${query}`,
  headers: {
    'Authorization': `Bearer ${bearToken}`
  }
}


//search recent tweet
app.get('/tweet/search', (req, res) => {
  axios.request(recent_tweet)
    .then(response => {
      res.json(response.data)
      }
    )
    .catch(err =>
    {
      console.log(err)
    })
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
