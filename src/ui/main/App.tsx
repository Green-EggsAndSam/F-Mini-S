import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [teamName, setTeamName] = useState("");

  const getTeamName = async (teamNumber: number) => {
      await window.myAPI.getTeamName(teamNumber).then(setTeamName);
  }

  useEffect(() => {
    window.myAPI.getTeamName(1).then(setTeamName);
  }, []);

  return (
    <>
      <div>
      </div>
      <h1>This is the main window</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
          <br></br>
        </button>
      </div>
      <p className="read-the-docs">
        This is the main window
      </p>
      <p>Team Name is {teamName}</p>
      <button onClick={() => getTeamName(2)}>
          Load New Team
      </button>
    </>
  )
}

export default App
