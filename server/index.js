const path = require('path')
const express = require('express')
const axios = require('axios').default;
const Twitter = require('twitter');
const { response } = require('express');
const app = express()
const port = 3000

// Serve out any static assets correctly
app.use(express.static('../client/build'))


const twitterAPI = "https://api.twitter.com/1.1"
const bearToken = `AAAAAAAAAAAAAAAAAAAAABgCUwEAAAAAulp6nbJYV0eZsgfF%2F35nkcbcfxg%3DOZypHZyuxqwyuai3ngiy2ZUiW4pMCgk93c5Qk8M3jxhsLHU0be`


app.get("/api/countires", (req, res) => {

  const url = "https://restcountries.com/v3.1/all"

  axios.get(url)
    .then(response => res.json(response))
})



//search recent tweet
app.get('/api/tweet/search', (req, res) => {

  let query = req.query
  console.log(query)
  var searchInRecentTweets = {
    method: "GET",
    url: `${twitterAPI}/search/tweets.json?q=${query.q}&count=100&lang=en`,
    headers: {
      'Authorization': `Bearer ${bearToken}`
    }
  }
  axios.request(searchInRecentTweets)
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
