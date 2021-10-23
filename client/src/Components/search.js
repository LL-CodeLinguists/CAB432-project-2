import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import  "../CSS/search.css";





function Dropdown({countries}){

    return(
        <div className="dropdown">
            <div className="selected-value"> Select location</div>
            <div className="arrow" />

            <div className="options">
             {
                 countries.map(country => <div className="option">{country.name}</div>)
             }
            </div>
        </div>
    )
}



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

    function GetCountries(){
        const url = "/api/countires"

        
        useEffect(
            () => {
                fetch(url)
                .then(res => res.json())
                .then(res => console.log(res))
            }
        , [])

    }

    GetCountries()

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

                <button className="submitButton" type="submit"></button>

            </form>

        </div>
    )
}

export default SearchBar