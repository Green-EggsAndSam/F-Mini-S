type Screen = 'menu' | 'teams' | 'matchSchedule' | 'matchResults' | 'match';

type Props = {
  setScreen: (s: Screen) => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  currentScreen: Screen;
};

const SideBar = ({
  setScreen,
  isOpen,
  setIsOpen,
  currentScreen
}: Props) => {

    const items: { screen: Screen; label: string }[] = [
        { screen: 'menu', label: 'Home' },
        { screen: 'teams', label: 'Teams' },
        { screen: 'matchSchedule', label: 'Match Schedule' },
        { screen: 'matchResults', label: 'Match Results' },
        { screen: 'match', label: 'Match Runner' },
    ];

  return (
    <div className={`sidenav ${isOpen ? 'open' : 'closed'}`} onMouseLeave={() => setIsOpen(false)}>

    <button 
        className={`toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
    >
        ☰
    </button>


      {isOpen && (
        <>
          <div className="logo-text">FMS Main Controller</div>

          <ul className="nav-list">
            {items.map(item => (
              <li key={item.label}>
                <button
                  onClick={() => setScreen(item.screen)}
                  className={
                    currentScreen === item.screen ? 'active' : ''
                  }
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

    </div>
  );
};

export default SideBar;