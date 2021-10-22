import React, { useEffect, useState } from "react"
import { useHistory, useParams, useLocation } from "react-router-dom"

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

function SearchResult(){
    
    const query = useQuery()
    const queryString = query.toString()
    

    return(
        <div>
            {query}
        </div>
    )
}

export default SearchResult