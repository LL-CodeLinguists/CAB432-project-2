import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Dropdown } from 'semantic-ui-react'
import  "../CSS/search.css";


function CountryDropDown(props){
    const [values, setValue] = useState(null)
    function handleChange(e, {value}){
        setValue(e.target.textContent)
    }
    return(
        <div>
            <Dropdown
            placeholder='Select Country(Optional)'
            search
            selection
            clearable
            lazyLoad
            button
            onChange={handleChange}
            options={props.countries}
            />
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

    const countryOptions = countries.map(country => (        {
        key: country.alpha2Code.toLowerCase(),
        value: country.alpha2Code.toLowerCase(),
        flag: country.alpha2Code.toLowerCase(),
        text: country.name
    }))

    return countryOptions
}


function SearchBar({placeholder}){
    const [query, setQuery] = useState("")
    const history = useHistory()
    const [parameter, setParameter] = useState("")

    const countries = GetCountries()

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

                <CountryDropDown className="dropdown" countries={countries}/>

                <button className="submitButton" type="submit"></button>

            </form>


        </div>
    )
}

export default SearchBar