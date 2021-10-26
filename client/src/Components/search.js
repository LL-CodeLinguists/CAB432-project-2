import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Dropdown } from 'semantic-ui-react'
import  "../CSS/search.css";




function SearchBar({placeholder}){
    const [query, setQuery] = useState(null)
    const history = useHistory()
    const [parameter, setParameter] = useState("")
    const [type, setType] = useState(null)
    const [hashtag, setHashtag] = useState(null)

    function handleChange(e, {value}){
        setType(e.target.textContent)
    }

    const types = [
        { key: 1, text: 'Recent', value: 1 },
        { key: 2, text: 'Popular', value: 2 },
      ]


    function GetTweets(params){
        history.push({
            pathname: "/search",
            search: params})
    }


    const handleFilter = (event) => {
        const searchWord = event.target.value 
        setQuery(searchWord)
    }

    const handleHashtag = (event) => {
        const tag = event.target.value
        setHashtag(tag)
    }

    const handleSubmit = e => {
        e.preventDefault()
        GetTweets(parameter)
    }

    useEffect(() => {
        const params = new URLSearchParams()


        if (query){
            params.append("q", query)
        }
        if (type){
            params.append("t", type)
        }
        
        if (hashtag){
            params.append("h", hashtag)
        } 
                 
        
        setParameter(params.toString())

    }, [query, history, type, hashtag])

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

            <Dropdown
                className="dropdown"
                placeholder='Select type(Optional)'
                selection
                clearable
                onChange={handleChange} 
                options={types} 
            />

                <button className="submitButton" type="submit"></button>

            

            <input className="hashtag" type="text" 
                    placeholder="Enter a hashtag without #(Optional)"
                    onChange={handleHashtag}
                    />
            </form>
        </div>
    )
}

export default SearchBar