const path = require('path')
const express = require('express')
const responseTime = require('response-time')
const redis = require('redis')
const axios = require('axios').default;
const { response } = require('express');
require('dotenv').config();
const AWS = require('aws-sdk');
const natrual = require('natural')
const aposToLexForm = require('apos-to-lex-form');
const SW = require('stopword')
const Analyzer = require('natural').SentimentAnalyzer;
const stemmer = require('natural').PorterStemmer;




const app = express()
const port = 3000



// create and connect redis client to local instance.
const client = redis.createClient();

// Print redis errors to the console
client.on('error', (err) => {
  console.log("Error " + err);
});


// Cloud Services Set-up
// Create unique bucket name
const bucketName = 'n10149899-twitter-store-2';
// Create a promise on S3 service object
const bucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise();

bucketPromise.then(function(data) {
  console.log("Successfully created " + bucketName); })
  .catch(function(err) { console.error(err, err.stack);
  });

  //store data in Redis --- twitter
  function StoreTwitterData(searchQuery, tweetData){

    return client.setex(`twitter:${searchQuery}`, 3600, JSON.stringify({ source: 'Redis Cache',...tweetData}));
  }



// use response-time as a middleware
app.use(responseTime());
// Serve out any static assets correctly
app.use(express.static('../client/build'))




//Twitter token
const twitterAPI = "https://api.twitter.com/1.1"
const bearToken = `AAAAAAAAAAAAAAAAAAAAABgCUwEAAAAAulp6nbJYV0eZsgfF%2F35nkcbcfxg%3DOZypHZyuxqwyuai3ngiy2ZUiW4pMCgk93c5Qk8M3jxhsLHU0be`



//search recent tweet
app.get('/api/tweet/search', (req, res) => {

  // let query = req.query
  // // console.log(query.q)

  // // Try fetching the result from Redis first in case we have it cached

  // var searchInRecentTweets = {
  //   method: "GET",
  //   url: `${twitterAPI}/search/tweets.json?q=${query.q}&count=100&lang=en`,
  //   headers: {
  //     'Authorization': `Bearer ${bearToken}`
  //   }
  // }


  let searchQuery = req.query.q
  let hashtag = null
  let type = null

  if (req.query.hasOwnProperty('h')){
    hashtag = req.query.h
  }
  if (req.query.hasOwnProperty('t')){
    type = req.query.t
  }

  let url = `${twitterAPI}/search/tweets.json?q=${searchQuery == null ? "" : searchQuery}${hashtag == null ? "" : "%23" + hashtag}&count=100&lang=en${type == null ? "" : "&result_type=" + type}&tweet_mode=extended`

  var searchInRecentTweets = {
    method: "GET",
    url: url,
    headers: {
      'Authorization': `Bearer ${bearToken}`
    }
  }


  const s3Key = `twitter:${searchQuery}`; // Check S3
  const params = { Bucket: bucketName, Key: s3Key};




  return client.get(`twitter:${searchQuery}`, (err, result) =>{
    
    //check redis first
    if(result){
      const resultJSON = JSON.parse(result);
      console.log("redis return")
      // console.log(resultJSON)
      // return res.status(200).json(resultJSON);

        //analysis
        const {WordTokenizer} = natrual
        const tokenizer = new WordTokenizer()
        const analyzer = new Analyzer("English", stemmer, "afinn");
        const sentimentAnalysisResults = resultJSON.statuses.map(tweet => analyzer.getSentiment(SW.removeStopwords(tokenizer.tokenize(aposToLexForm(tweet.full_text).toLowerCase().replace(/[^a-zA-Z\s]+/g, '')))))
        const filteredData = resultJSON.statuses.map(tweet => {
          let tweetObj = {
              time: tweet.created_at,
              name: tweet.user.name,
              screen_name: tweet.user.screen_name,
              text: tweet.full_text
          }
          return tweetObj
        })
      // return res.status(200).json(resultJSON);
      res.status(200).json({tweetData: filteredData, sentimentAnalysis: sentimentAnalysisResults});
    }
    else{

      //check s3
        return new AWS.S3({apiVersion: '2006-03-01'}).getObject(params, (err, result2) => { 

        if (result2) {
            // Serve from S3
            console.log("s3 return")
            const resultJSON = JSON.parse(result2.Body);
            StoreTwitterData(searchQuery, resultJSON) 
              //analysis
              const {WordTokenizer} = natrual
              const tokenizer = new WordTokenizer()
              const analyzer = new Analyzer("English", stemmer, "afinn");
              const sentimentAnalysisResults = resultJSON.statuses.map(tweet => analyzer.getSentiment(SW.removeStopwords(tokenizer.tokenize(aposToLexForm(tweet.full_text).toLowerCase().replace(/[^a-zA-Z\s]+/g, '')))))
              const filteredData = resultJSON.statuses.map(tweet => {
                let tweetObj = {
                    time: tweet.created_at,
                    name: tweet.user.name,
                    screen_name: tweet.user.screen_name,
                    text: tweet.full_text
                }
                return tweetObj
              })
            // return res.status(200).json(resultJSON);
            res.status(200).json({tweetData: filteredData, sentimentAnalysis: sentimentAnalysisResults});
        }

        //fetch data from twitter api 
        else{
          axios.request(searchInRecentTweets)
          
          .then(response => {
              //res.json(response.data) raw data
            const tweetData = response.data

            // Save the Wikipedia API response in Redis store
            client.setex(`twitter:${searchQuery}`, 3600, JSON.stringify({ source: 'Redis Cache',...tweetData}));
            //Bucket s3
            const body = JSON.stringify({ source: 'S3 Bucket', ...tweetData}); 
            const objectParams = {Bucket: bucketName, Key: s3Key, Body: body}; 
            const uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise(); 

              //analysis
              const {WordTokenizer} = natrual
              const tokenizer = new WordTokenizer()
              const analyzer = new Analyzer("English", stemmer, "afinn");
              const sentimentAnalysisResults = tweetData.statuses.map(tweet => analyzer.getSentiment(SW.removeStopwords(tokenizer.tokenize(aposToLexForm(tweet.full_text).toLowerCase().replace(/[^a-zA-Z\s]+/g, '')))))
              const filteredData = tweetData.statuses.map(tweet => {
                let tweetObj = {
                    time: tweet.created_at,
                    name: tweet.user.name,
                    screen_name: tweet.user.screen_name,
                    text: tweet.full_text
                }
                return tweetObj
              })

              console.log("api return")
              // return res.status(200).json({ source: 'Twitter API', ...tweetData, });
              res.status(200).json({tweetData: filteredData, sentimentAnalysis: sentimentAnalysisResults});
            }
          )
          .catch(error =>
          {
            console.log(error)
          })
        }
      })
    }
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