import React, { useEffect, useState } from "react"
import { useHistory, useParams, useLocation } from "react-router-dom"

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }


function SearchAllTweets(searchTerm){
    const url = "/api/tweet/search?q=" + searchTerm

    useEffect(
        () => {
            fetch(url)
            .then(res => res.json())
            .then(res => console.log(res))
        }
    , [url])

}

function SearchResult(){
    
    const query = useQuery()
    const searchTerm = query.get("q")

    SearchAllTweets(searchTerm)
    
    return(
        <div>
            {searchTerm}
        </div>
    )
}

export default SearchResult