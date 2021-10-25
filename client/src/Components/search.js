import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import  "../CSS/search.css";





function Dropdown(props){
    const countries = props.countries
    const [open, setOpen] = useState(false)


    return(
        <div className="dropdown">
            <div className="control" onClick={() => setOpen((prev) => !prev)}>
                <div className="selected-value">{props.prompt}</div>
                <div  className={`arrow ${open ? "open" : null}`}/>
            </div> 
            <div className={`options ${open ? "open" : null}`}>
             {
                 countries.map(country => <div className="option">{country.name.common}</div>)
             }
            </div>
        </div>
    )
}

function GetCountries(){
    const url = "/api/countries"
    const [countries, setCountries] = useState([])

    useEffect(
        () => {
            fetch(url)
            .then(res => res.json())
            .then(res => {
                setCountries(res)
            })
        }
    , [])

    return countries
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


    const countries = GetCountries()

    console.log(countries)

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

                <Dropdown countries={countries} 
                          prompt='Select country...'
                          
                          />

                <button className="submitButton" type="submit"></button>

            </form>

        </div>
    )
}

export default SearchBar