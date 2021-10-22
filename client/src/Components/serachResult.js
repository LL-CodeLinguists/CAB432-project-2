import React, { useEffect, useState } from "react"
import { useHistory, useParams, useLocation } from "react-router-dom"
import { Card, Row, Col } from "react-bootstrap";
import "../CSS/searchResult.css"

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }


function SearchAllTweets(searchTerm){
    const url = "/api/tweet/search?q=" + searchTerm
    const [tweetArray, setTweetArray] = useState([])

    useEffect(
        () => {
            fetch(url)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                return res.statuses})
            .then(res => res.map(tweet => {
                let tweetObj = {
                    time: tweet.created_at,
                    name: tweet.user.name,
                    screen_name: tweet.user.screen_name,
                    text: tweet.text,
                    source: tweet.source
                }
                return tweetObj
            }))
            .then(res => setTweetArray(res))
        }
    , [url])

    return tweetArray
}

function SearchResult(){
    
    const query = useQuery()
    const searchTerm = query.get("q")

    const tweets = SearchAllTweets(searchTerm)

    return(
        <div>
            <div className="results">
            <Row xs={1} md={4} className="g-4">
            {tweets.map(tweet => (
                    <Col>
                    <Card border="secondary" className="card">
                        <Card.Header> 
                            <Card.Title>{tweet.name}</Card.Title>
                            <Card.Subtitle style={{color: "gray"}}>@{tweet.screen_name}</Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                {tweet.text}
                            </Card.Text>
                            <a type="button" href={tweet.source}>View original tweet</a>
                        </Card.Body>
                        <Card.Footer>
   
                            <small className="text-muted">{tweet.time}</small>
                        </Card.Footer>
                    </Card>
                    </Col>


            ))}
        </Row>

        </div>
        </div>
    )
}

export default SearchResult