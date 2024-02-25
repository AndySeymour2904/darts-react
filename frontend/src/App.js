import React from 'react'
import styled from 'styled-components'

import DartBoard from './DartBoard.jsx'
import { fetchUrl } from './fetch-utils'

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Score = styled.div`
  padding: 10px;
  font-size: 20px;
  background: grey;
  margin: 20px;
  min-width: 50px;
  text-align: center;
`

const PrevScore = styled(Score)`
  opacity: 0.5;
`

const TotalScore = styled.div`
  padding: 30px
  margin: 20px;
  background: red;
  color: white;
  font-size: 50px;
  text-align: center;
  min-width: 75px;
`

const Button = styled.button`
  background: grey;
  color: white;
  font-size: 20px;
  text-align: center;
  min-width: 75px;
`

function App() {
  const [currentThrow, setCurrentThrow] = React.useState([])
  const [prevThrows, setPrevThrows] = React.useState([])
  const [score, setScore] = React.useState(501)
  const [name, setName] = React.useState('');
  const [user, setUser] = React.useState(null);

  const onDartRegistered = (dart) => {
    const newDarts = [...currentThrow, dart]
    const newScore = score - dart.score

    setScore(newScore)

    if (newDarts.length === 3 || newScore <= 1) {
      setPrevThrows([...prevThrows, newDarts])
      setCurrentThrow([])

      // BUST OR WIN
      if (newScore <= 1) {
        if (newScore === 0 && (dart.name[0] === 'D' || dart.name[0] === 'B')) { // WIN
          console.log("GAME FINISHED")
        } else { // BUST
          setScore(newScore + newDarts.reduce((acc, cur) => acc + cur.score, 0))
        }
      }
    } else {
      setCurrentThrow(newDarts)
    }
  }

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleGameOver = () => {
    setScore(501)

    try {
      fetchUrl('/api/save_darts', {
        method: 'POST',
        body: JSON.stringify({darts: prevThrows, user}),
        headers: {
        'Content-Type': 'application/json'
        }
      })
    } catch {
      alert("saving failed")
      return
    }

    setCurrentThrow([])
    setPrevThrows([])
  }

  const handleUndo = () => {
    let newDarts
    if (currentThrow.length > 0) {
      // Copy and remove last element
      newDarts = [...currentThrow]
    } else {
      let newPrevThrows = [...prevThrows]
      newDarts = newPrevThrows.pop()
      setPrevThrows(newPrevThrows)
    }

    const dartUndone = newDarts.pop()
    setCurrentThrow(newDarts)
    setScore(score + dartUndone.score)
  }

  const submitForm = () => {
    // Basic validation - check if the name is not empty
    if (name.trim() === "") {
      alert("Please enter your name.");
      return;
    }

    setUser(name);
  };


  return (
    <div className="App">
      {!user && (
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            required
          />
          <button type="button" onClick={submitForm}>Submit</button>
        </div>
      )}
      {user && (
        <React.Fragment>
          <DartBoard onDartRegistered={onDartRegistered} />
          <ScoreContainer>
            <TotalScore>{score}</TotalScore>
            <Button onClick={handleGameOver}>Game {score === 0 ? 'won?' : 'lost?'}</Button>
            {(prevThrows.length !== 0 || currentThrow.length !== 0) && <Button onClick={handleUndo}>Undo</Button>}
          </ScoreContainer>
          <ScoreContainer>
            {currentThrow.map(dart => (
              <Score>
                {dart.name}
              </Score>
            ))}
          </ScoreContainer>
          <ScoreContainer>
            {prevThrows.length !== 0 && prevThrows[prevThrows.length - 1].map(dart => (
              <PrevScore>
                {dart.name}
              </PrevScore>
            ))}
          </ScoreContainer>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
