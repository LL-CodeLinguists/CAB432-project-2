import React, { useEffect, useState } from 'react';
import SearchBar from './search';
import "../CSS/home.css"




function Home(){
    return(
        <div className="home">
            <SearchBar placeholder="Search anything..."/>
   
        </div>
    )
}

export default Home

