import React, { useEffect, useState } from 'react';
import './App.css';

const FavoriteAnimal = ({ url }) => {
  const [ favoriteAnimal, setFavoriteAnimal ] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => setFavoriteAnimal(res))
			.catch(() => null);
	}, []);

  if (favoriteAnimal !== null) {
    return (
      <p>Your favorite animal is a {favoriteAnimal.answer}!</p>
    )
  }

  return null;
}


const GetComment = ({ url }) => {
  const [ Comment, setComment ] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => setComment(res))
			.catch(() => null);
	}, []);

  if (Comment !== null) {
    return (
      <p>Your favorite animal is a {Comment.tweet}!</p>
    )
  }

  return null;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <GetComment url="/tweet/search" />
        </p>
      </header>
    </div>
  );
}

export default App;
