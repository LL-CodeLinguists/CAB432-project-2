import React, { useEffect, useState } from "react"
import { useHistory, useParams, useLocation } from "react-router-dom"
import { Card, Row, Col } from "react-bootstrap";
import "../CSS/searchResult.css"

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }




function SearchResult(){
    
    const query = useQuery()
    const searchTerm = query.get("q")
    const hashtag = query.get("h")
    const type = query.get("t")
    const [loading, setLoading] = useState(true)
    const [tweets, setTweets] = useState([])

    const url = `/api/tweet/search?q=${searchTerm}${hashtag == null ? '' : "&h=" + hashtag}${type == null ? '' : "&t=" + type.toLowerCase()}`
    console.log(url)
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
                    text: tweet.text
                }
                return tweetObj
            }))
            .then(res => setTweets(res))
            .then(res => setLoading(false))
        }
    , [url])


    if (loading){
        return(
            <div>
                <h1 className="loading">Loading...</h1>
            </div>
        )
    }else{
        return(
            <div>
                <h1 className="search-heading">Found {tweets.length} tweets containing '{searchTerm}' {hashtag == null ? '' : "with hashtag #" + hashtag} {type == null ? '' : "in " + type + " order"}! {tweets.length == 0 ? "Please use other terms!" : ""}</h1>
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


}

export default SearchResult