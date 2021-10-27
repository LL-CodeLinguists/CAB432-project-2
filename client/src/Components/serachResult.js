import React, { useEffect, useState } from "react"
import { useHistory, useParams, useLocation } from "react-router-dom"
import { Card, Row, Col } from "react-bootstrap";
import "../CSS/searchResult.css"
import * as d3 from 'd3'

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }


function ConstructSentimentData(sentiment){
    let positives = 0
    let negatives = 0
    let neutruals = 0

    sentiment.map(value => {
        if(value > 0) {positives++}
        if(value == 0){neutruals++}
        if(value < 0) {negatives++}
    })

    return [
        {subject: "Positive",  count: positives},
        {subject: "Neutrual", count: neutruals},
        {subject: "Negative", count: negatives}
    ]
}

function SentimentBarchart(props){
    const dataSet = ConstructSentimentData(props.sentiment)

    var color = ["#FE8F8F", "#FFFD95", "#B5DEFF"]

    useEffect(() => {
        d3.select('#pgraphs')
        .selectAll('p')
        .data(dataSet)
        .enter()
        .append('p')
        .text(dt => dt.subject + ": " + dt.count)

        // Bar chart:
        const getMax = () => {
            let max = 0;
            dataSet.forEach( (dt) => {
                if(dt.count > max) {max = dt.count}
                }
            )
            return max
        }

        d3.select('#BarChart').selectAll('div').data(dataSet)
        .enter().append('div').classed('bar', true).style('height', `${getMax()}px`)

        d3.select('#BarChart').selectAll('.bar')
        .transition().duration(1000).style('height', bar => `${bar.count * 6}px`)
        .style('width','50px')
        .style("background", function(d, i){return color[i]})
        .delay(300)
    }, [])
    return(
    <div className="graph">
        <h1>Sentiment Analysis</h1>
        <div id='BarChart'></div>
        <div id="pgraphs"> </div>
    </div>
    )
}



function SearchResult(){
    
    const query = useQuery()
    const searchTerm = query.get("q")
    const hashtag = query.get("h")
    const type = query.get("t")
    const [tweetLoading, setTweetLoading] = useState(true)
    const [tweets, setTweets] = useState([])
    const [sentiment, setSentiment] = useState([])
    const [loading, setLoading] = useState(true)

    const url = `/api/tweet/search?q=${searchTerm}${hashtag == null ? '' : "&h=" + hashtag}${type == null ? '' : "&t=" + type.toLowerCase()}`
    console.log(url)
    useEffect(
        () => {
            fetch(url)
            .then(res => res.json())
            .then(res => {
                setSentiment(res.sentimentAnalysis)
                setLoading(false)
                return res.tweetData.statuses})
            .then(res => res.map(tweet => {
                let tweetObj = {
                    time: tweet.created_at,
                    name: tweet.user.name,
                    screen_name: tweet.user.screen_name,
                    text: tweet.full_text
                }
                return tweetObj
            }))
            .then(res => {
                setTweets(res)
                setTweetLoading(false)
            })
    
        }
    , [url])


    if (tweetLoading && loading){
        return(
            <div>
                <h1 className="loading">Loading Tweets and Sentiment Analysis...</h1>
            </div>
        )
        }
    else{
        return(
            <div>
                <h1 className="search-heading">Found {tweets.length} tweets containing '{searchTerm}' {hashtag == null ? '' : "with hashtag #" + hashtag} {type == null ? '' : "in " + type + " order"}! {tweets.length == 0 ? "Please use other terms!" : ""}</h1>
                
                {tweets.length == 0 ? <div></div> : <SentimentBarchart sentiment={sentiment}/>}

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