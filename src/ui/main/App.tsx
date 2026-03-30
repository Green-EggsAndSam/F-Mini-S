import { useState } from 'react'
import './App.css'

import SideBar from './sideBar';
import Menu from './menu'
import Teams from './teams';
import MatchResults from './matchResults';
import MatchSchedule from './matchSchedule';
import Match from './match';

type Screen = 'menu' | 'teams' | 'matchSchedule' | 'matchResults' | 'match';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [isOpen, setIsOpen] = useState(true); 

  const screens = {
    menu: <Menu />,
    teams: <Teams />,
    matchSchedule: <MatchSchedule />,
    matchResults: <MatchResults />,
    match: <Match />,
  };

  // const getTeamName = async (teamNumber: number) => {
  //     await window.myAPI.getTeamName(teamNumber).then(setTeamName);
  // }

  // const loadScreenWindow = async () => {
  //   await window.myAPI.loadScreenWindow();
  // }

  // const loadRanksWindow = async () => {
  //   await window.myAPI.loadRanksWindow();
  // }

  return (
    <div style={{ display: 'flex' }}>
      <SideBar 
        setScreen={setCurrentScreen} 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        currentScreen={currentScreen}
      />

      <div className={`main-content ${isOpen ? 'shifted' : ''}`}>
        {screens[currentScreen]}
      </div>
    </div>
  );
}

export default App;
