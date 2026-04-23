import { useEffect, useState } from "react";

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
  const op2 : MatchOption = {
    matchesPerTeam : 1,
    matchesTotal : 1
  }

  const op3 : MatchOption = {
    matchesPerTeam : 2,
    matchesTotal : 2
  }

  const [matchSchedule, setMatchSchedule] = useState<Match[]>([]);
  const [selected, setSelected] = useState<MatchOption>(op1);
  const [open , setOpen] = useState(false);
  const [amt, setAmt] = useState<number>(5);
  const [options , setOptions] = useState<MatchOption[]>([op1, op2, op3]);

  // const getTeamName = async (teamNumber: number) => {
  //     await window.myAPI.getTeamName(teamNumber).then(setTeamName);
  // }

  const getOptions = async () => {

    const [nums] = await Promise.all([
        window.myAPI.getMatchOptions(amt)
      ]);

    const ops : MatchOption[] = [];

    console.log(nums.length);
    console.log(nums);

    for(let i = 0; i < nums[0].length; i++){

      const op : MatchOption ={
        matchesPerTeam : nums[1][i],
        matchesTotal : nums[0][i]
      }
      console.log(op);
      ops.push(op);
    }


    console.log(ops);
    setOptions(ops);
  }

  const getSchedule = async () => {
    await window.myAPI.getSchedule().then(setMatchSchedule);
  }

  const getAndUpdateSchedule = async (matchesPerTeam : number, matchesTotal : number) => {
    await window.myAPI.getAndUpdateMatchSchedule(matchesPerTeam, matchesTotal).then(setMatchSchedule);
  }

  const expandAmt =(() => {
    setAmt(prev => prev + 5);
  });

  const resetAmt = (() => {
    setAmt(5);
  })

  const toggleOpen = (() => {
    setOpen(!open);
    resetAmt();
  });

  const selectOption = ((match : MatchOption) => {
    resetAmt();
    setSelected(match);
    setOpen(false);
  });

  useEffect(()=> {

    const getO = async () => {

      await getOptions();

    };

    getO();

  }, [amt])

  useEffect(()=> {

    const getS = async () => {

      await getSchedule();

    };

    getS();

  }, [])

    return (
        <>
          <div>
            <h2>Matches Per Team</h2><h2>Matches Total</h2>
            <button onClick={toggleOpen}>{selected.matchesPerTeam} {selected.matchesTotal}</button>
            {open && (
              <div>
                <table className="options-table">
                  <tbody>
                    {options.map((option, index) => (
                      <tr key={index}>
                        <td>
                          <button className={'option-btn'}
                          onClick={() =>selectOption(option)}
                          ><h3>{option.matchesPerTeam}</h3> <h3>{option.matchesTotal}</h3></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={expandAmt}>More Options</button>
              </div>
            )}

            <table className="schedule-table">
                  <tbody>
                    {matchSchedule.map((match, index) => (
                      <tr key={index}>
                        <td>
                          <h3>Match Number: {match.number}</h3><h3> Red Alliance: {match.redAlliance}</h3> <h3> Blue Alliance: {match.blueAlliance}</h3>
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