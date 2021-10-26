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




//search recent tweet
app.get('/api/tweet/search', (req, res) => {

  let searchQuery = req.query.q
  let hashtag = null
  let type = null

  if (req.query.hasOwnProperty('h')){
    hashtag = req.query.h
  }
  if (req.query.hasOwnProperty('t')){
    type = req.query.t
  }

  let url = `${twitterAPI}/search/tweets.json?q=${searchQuery == null ? "" : searchQuery}${hashtag == null ? "" : "%23" + hashtag}&count=100&lang=en${type == null ? "" : "&result_type=" + type}`
  console.log(url)
  var searchInRecentTweets = {
    method: "GET",
    url: url,
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
  console.log(`App listening at port:${port}`)
})
