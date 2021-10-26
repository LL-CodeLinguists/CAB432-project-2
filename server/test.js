const path = require('path')
const express = require('express')
const responseTime = require('response-time')
const redis = require('redis')
const axios = require('axios').default;
const { response } = require('express');
require('dotenv').config();
const AWS = require('aws-sdk');
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
  function StoreTwitterData(query, responseJSON){

    return client.setex(`twitter:${query}`, 3600, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
  }

    //store data in Redis --- country
    function StoreTwitterData(query, responseJSON){

      return client.setex(`restcountries API: ${query}`, 3600, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
    }





// use response-time as a middleware
app.use(responseTime());
// Serve out any static assets correctly
app.use(express.static('../client/build'))




//Twitter token
const twitterAPI = "https://api.twitter.com/1.1"
const bearToken = `AAAAAAAAAAAAAAAAAAAAABgCUwEAAAAAulp6nbJYV0eZsgfF%2F35nkcbcfxg%3DOZypHZyuxqwyuai3ngiy2ZUiW4pMCgk93c5Qk8M3jxhsLHU0be`




app.get("/api/countries", (req, res) => {

  let country = `https://restcountries.com/v2/all/api/countries`


  const s3Key = `restcountries API: ${country}`; // Check S3
  const params = { Bucket: bucketName, Key: s3Key};
  // Try fetching the result from Redis first in case we have it cached

  const url = "https://restcountries.com/v2/all"

  return client.get(`restcountries API: ${country}`, (err, result) =>{

    if(result){

      const resultJSON = JSON.parse(result);
      // console.log(resultJSON)
      return res.status(200).json(resultJSON);

    }else{
      
      return new AWS.S3({apiVersion: '2006-03-01'}).getObject(params, (err, result2) => { 

        if(result2){

          // Serve from S3
          console.log(result2);
          const resultJSON = JSON.parse(result2.Body);
          StoreData(country, resultJSON) 
          return res.status(200).json(resultJSON);

        }
        else{
  
          axios.get(url)
          .then(response => {
            const responseJSON = response.data;
            // Save the Wikipedia API response in Redis store
            client.setex(`restcountries API: ${country}`, 3600, JSON.stringify({ source: 'Redis Cache',...responseJSON, }));

            const body = JSON.stringify({ source: 'S3 Bucket', ...responseJSON}); 
            const objectParams = {Bucket: bucketName, Key: s3Key, Body: body}; 
            const uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise(); 
            return res.status(200).json({ source: 'restcountries API', ...responseJSON, });
          })
          .catch(e => {
            console.log(e)
          })
        }
      })
    }
  }) 
})
  




//search recent tweet
app.get('/api/tweet/search', (req, res) => {

  let query = req.query
  // console.log(query.q)

  const s3Key = `twitter:${query.q}`; // Check S3
  const params = { Bucket: bucketName, Key: s3Key};
  // Try fetching the result from Redis first in case we have it cached

  var searchInRecentTweets = {
    method: "GET",
    url: `${twitterAPI}/search/tweets.json?q=${query.q}&count=100&lang=en`,
    headers: {
      'Authorization': `Bearer ${bearToken}`
    }
  }

  return client.get(`twitter:${query.q}`, (err, result) =>{
    
    //check redis first
    if(result){
      const resultJSON = JSON.parse(result);
      // console.log(resultJSON)
      return res.status(200).json(resultJSON);
    }
    else{

      //check s3
        return new AWS.S3({apiVersion: '2006-03-01'}).getObject(params, (err, result2) => { 

        if (result2) {
            // Serve from S3
            console.log(result2);
            const resultJSON = JSON.parse(result2.Body);
            StoreTwitterData(query.q, resultJSON) 
            return res.status(200).json(resultJSON);
        }

        //fetch data from twitter api 
        else{
          axios.request(searchInRecentTweets)
          .then(response => {
            const responseJSON = response.data;
            // Save the Wikipedia API response in Redis store
            client.setex(`twitter:${query.q}`, 3600, JSON.stringify({ source: 'Redis Cache',...responseJSON, }));

            const body = JSON.stringify({ source: 'S3 Bucket', ...responseJSON}); 
            const objectParams = {Bucket: bucketName, Key: s3Key, Body: body}; 
            const uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise(); 
            return res.status(200).json({ source: 'Twitter API', ...responseJSON, });
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