import { useEffect, useState } from "react";
import "./matchSchedule.css"

type MatchOption = {
  matchesPerTeam : number,
  matchesTotal : number
}

type Match = {
  number: number,
  redAlliance: number[],
  blueAlliance: number[]
};

function MatchSchedule(){

  const op1 : MatchOption = {
    matchesPerTeam : 0,
    matchesTotal : 0
  }

  const [matchSchedule, setMatchSchedule] = useState<Match[]>([]);
  const [selected, setSelected] = useState<MatchOption>(op1);
  const [open , setOpen] = useState(false);
  const [newOpen , setNewOpen] = useState(false);
  const [amt, setAmt] = useState<number>(5);
  const [options , setOptions] = useState<MatchOption[]>([op1]);

  // const getTeamName = async (teamNumber: number) => {
  //     await window.myAPI.getTeamName(teamNumber).then(setTeamName);
  // }

  const getOptions = async (newAmt : number) => {

    const [nums] = await Promise.all([
        window.myAPI.getMatchOptions(newAmt)
      ]);

    const ops : MatchOption[] = [];

    for(let i = 0; i < nums[0].length; i++){

      const op : MatchOption ={
        matchesPerTeam : nums[1][i],
        matchesTotal : nums[0][i]
      }

      ops.push(op);
    }

    setOptions(ops);

    if(options[0].matchesPerTeam == 0 && options[0].matchesTotal == 0){
      setSelected(ops[0]);
    }
  }

  const getSchedule = async () => {
    await window.myAPI.getMatchSchedule().then(setMatchSchedule);
  }

  const getAndUpdateSchedule = async (matchesPerTeam : number, matchesTotal : number) => {
    await window.myAPI.getAndUpdateMatchSchedule(matchesPerTeam, matchesTotal).then(setMatchSchedule);
  }

  const expandAmt =(() => {
    const newAmt = amt + 5;
    setAmt(newAmt);
    getOptions(newAmt);
  });

  const resetAmt = (() => {
    setAmt(5);
    getOptions(5);
  })

  const toggleOpen = (() => {
    setOpen(!open);
    resetAmt();
  });

  const toggleNewOpen = (() => {
    setNewOpen(!newOpen);
    resetAmt();
  });

  const selectOption = ((match : MatchOption) => {
    resetAmt();
    setSelected(match);
    setOpen(false);
  });

  useEffect(()=> {

    const startUp = async () => {

      await getSchedule();
      await getOptions(5);

    };

    startUp();

  }, [])

  const handleGenerate = (()=> {

    getAndUpdateSchedule(selected.matchesPerTeam, selected.matchesTotal);
    toggleNewOpen();
  })

    return (
        <>
          <div>
            <button onClick={toggleNewOpen}>Generate New Match Schedule</button>
            {newOpen && (
              <div onClick={toggleNewOpen} className="popUp">
                <div onClick={(e) => e.stopPropagation()} className="popUp-content">
                    <div>
                      <button onClick={toggleOpen}>Matches Per Team: {selected.matchesPerTeam} Matches Total: {selected.matchesTotal}</button>
                      {open && (
                        <div>
                          <table className="options-table">
                            <tbody>
                              {options.map((option, index) => (
                                <tr key={index}>
                                  <td>
                                    <button className={'option-btn'}
                                    onClick={() =>selectOption(option)}
                                    ><h3>Matches Per Team: {option.matchesPerTeam}</h3> <h3>Matches Total: {option.matchesTotal}</h3></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button onClick={expandAmt}>More Options</button>
                        </div>
                      )}
                    <button onClick={handleGenerate}>Generate Schedule</button>
                  </div>
                </div>
              </div>
            )}

            <table className="schedule-table">
                  <tbody>
                    {matchSchedule.map((match, index) => (
                      <tr key={index}>
                        <td>
                          <h3>Match Number: {match.number}</h3>
                          <h3> Red Alliance: {match.redAlliance[0]} {match.redAlliance[1]} {match.redAlliance[2]}</h3> 
                          <h3> Blue Alliance: {match.blueAlliance[0]} {match.blueAlliance[1]} {match.blueAlliance[2]}</h3>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>
        </>
      )
}

export default MatchSchedule;