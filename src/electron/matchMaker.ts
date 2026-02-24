import { jsonToString } from './jsonUtils.js'
import { safeWriteJSON } from './jsonUtils.js'
import { getLastMatchNumber } from './rebuilt/matchResultMaker.js'
import { getTeamSkill } from './teamMaker.js'

const matchSchedulePath = './src/electron/matchSchedule.json'
const teamsPath = './src/electron/teams.json'

//teams -> JSON.parse(jsonToString(teamsPath))
//matchSchedule -> JSON.parse(jsonToString(matchSchedulePath))

export function print(){
    setInterval(()=> {

        console.log(getLastMatchNumber());

    }, 1000);
}

/**
 * Teams team json and returns options for the array based on input amount
 * @param optionsNum - the amount of options in the output array you want
 * @returns Returns possible options for a match in an array made of two arrays, [Matches total, Matches per team]
 */
export function matchOptions( optionsNum : number){
    const teams = JSON.parse(jsonToString(teamsPath));

    const optionAmount = optionsNum;
    const roundsPerTeamOptions = new Array(optionAmount).fill(1);
    const roundsTotalOptions = new Array(optionAmount);
    

    for(let i = 0; i < optionAmount + 1; i++){

        let rounds = 1;
        if(i > 0)
        rounds = roundsPerTeamOptions[i-1]+1;

        search:
        while(true){
            if((teams.length * rounds) % 6 == 0){
                roundsPerTeamOptions[i] = rounds;
                roundsTotalOptions[i] = (teams.length * rounds)/6;
                break search;
            }
            rounds++;
        }
    }

    return [roundsTotalOptions, roundsPerTeamOptions];
}

/**
 * This generates the match schedule based on the matchOptions function. 
 * It automaticly updates the matchSchedule JSON once done loading.
 */
export async function generateMatchSchedule(matchOptionsNum : number) {

    const totalMatches = matchOptions(matchOptionsNum+1)[0][matchOptionsNum];
    const matchesPerTeam = matchOptions(matchOptionsNum+1)[1][matchOptionsNum];

    let end = false;

    let attmepts = 0;

    while(!end && attmepts < 100){
        attmepts++;
        try{
            end = true;
            await generateMatchScheduleAttempt(totalMatches, matchesPerTeam);
        }
        catch{
            end = false;
        }
    }

    new Error("Match Generation Failed");
}

/**
 * Generates the match schecdule for the matchs and updates JSON
 */
async function generateMatchScheduleAttempt(totalMatches : number, matchesPerTeam : number){

    const teams = JSON.parse(jsonToString(teamsPath));

    type Match = {
        number: number,
        redAlliance: number[],
        blueAlliance: number[]
    };

    type MatchFile = Match[];

    const matches : MatchFile = [];

    /* Example
    matches.push({
        number: 2,
        redAlliance: [11,12,13],
        blueAlliance: [11,12,13]
    });
    */

    const teamNumArr = new Array(teams.length);
    //Needs an if statement to check if there are less than 12 teams, if less some teams will have back to back matches
    for(let i = 0; i < teamNumArr.length; i++) { teamNumArr[i] = teams[i].number; }

    const teamsLeft: number[] = [];

    for(let i = 0; i < teams.length; i++){

        for(let j = 0; j < matchesPerTeam; j++){

            teamsLeft.push(teams[i].number);
        }
    }

    for(let i = 0; i < teamsLeft.length; i++){

        const ran = Math.floor(Math.random()*teamsLeft.length);
        const temp = teamsLeft[i];
        teamsLeft[i] = teamsLeft[ran];
        teamsLeft[ran] = temp;
    }

    //first 3 red, second three blue
    let teamsLastMatch : number[] = [0,0,0,0,0,0];

        for(let matchCounter = 1; matchCounter <= totalMatches; matchCounter++){

            const alliance: number[] = [];

            let count = 0;
            while (alliance.length < 6) {

                if(count >= 1000 * (matchesPerTeam/Math.pow(teams.length,0.8))){
                    throw new Error("Generate match stuck in loop");
                }
                const team = teamsLeft[0];

                const duplicate = alliance.includes(team);
                const backToBack =
                    teams.length >= 12 &&
                    teamsLastMatch.includes(team);

                if (!duplicate && !backToBack) {
                    alliance.push(team);
                    teamsLeft.shift();
                } else {
                    teamsLeft.push(teamsLeft.shift()!);
                }
                count++;
            }

            teamsLastMatch = [alliance[0],alliance[1],alliance[2],alliance[3],alliance[4],alliance[5]];

            matches.push({
            number: matchCounter,
            redAlliance: [alliance[0],alliance[1],alliance[2],],
            blueAlliance: [alliance[3],alliance[4],alliance[5]]
            });

            //make work :(
            if(matchCounter > 1){
                const tolerance = 3
                const redSum = getTeamSkill(teamsLastMatch[0]) + getTeamSkill(teamsLastMatch[1]) + getTeamSkill(teamsLastMatch[2]);
                const blueSum = getTeamSkill(teamsLastMatch[3]) + getTeamSkill(teamsLastMatch[4]) + getTeamSkill(teamsLastMatch[5]);
                if(!(redSum + tolerance >= blueSum) && !(redSum - tolerance <= blueSum))
                    throw new Error("Team skill not within tolerance");
            }
        }
    safeWriteJSON(matchSchedulePath, matches);
}