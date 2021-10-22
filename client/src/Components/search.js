import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import  "../CSS/search.css";







function SearchBar({placeholder}){
    const [filteredData, setFilteredData] = useState([])
    const [query, setQuery] = useState("")
    const history = useHistory()
    const [parameter, setParameter] = useState("")


    function GetTweets(params){
        console.log("ack")
        history.push({
            pathname: "/search",
            search: params})
    
    
    }
    const handleFilter = (event) => {
        const searchWord = event.target.value 
  
        setQuery(searchWord)
    }

    const handleSubmit = e => {
        e.preventDefault()
        GetTweets(parameter)
    }


    useEffect(() => {
        const params = new URLSearchParams()
        if (query){
            params.append("q", query)
            setParameter(params.toString())
        }


    }, [query, history])

    return(
        <div className="search">
            <form 
            className="searchInputs"
            onSubmit={handleSubmit}
            >

                <input type="text" 
                    placeholder={placeholder} 
                    onChange={handleFilter}
                    />

                <button type="submit">dick</button>

            </form>

        </div>
    )
}

export default SearchBar