import React, { useEffect, useState } from 'react';
import Home from "./home"
import Nav from './Components/navbar';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./CSS/App.css"
import SearchResult from './Components/serachResult';
const GetComment = ({ url }) => {
  const [ comment, setComment ] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => console.log(res))
			.catch(() => null);
	}, []);


  return (
    <p>Dick!</p>
  )
}

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/search"  component={SearchResult} />
        </Switch>
      </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
