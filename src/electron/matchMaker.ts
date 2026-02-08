import { jsonToString } from './jsonUtils.js'
import { safeWriteJSON } from './jsonUtils.js'

const matchSchedulePath = './src/electron/matchSchedule.json'
const teamsPath = './src/electron/teams.json'

//teams -> JSON.parse(jsonToString(teamsPath))
//matchSchedule -> JSON.parse(jsonToString(matchSchedulePath))

export function print(){
    //setInterval(()=> {}, 10000);
        const arr = new Array(2);
        arr[0] = matchOptions(1)[0];
        arr[1] = matchOptions(1)[1];
        generateMatchSchedule(arr[1],arr[0]);
}

/**
 * Teams team json and returns options for the array based on input amount
 * @param optionsNum - the amount of options in the output array you want
 * @returns Returns possible options for a match in an array made of two arrays, [Matches per team, Matches total]
 */
export function matchOptions( optionsNum : number){
    const teams = JSON.parse(jsonToString(teamsPath));

    const optionAmount = optionsNum;
    const roundsPerTeamOptions = new Array(optionAmount).fill(1);
    const roundsTotalOptions = new Array(optionAmount);
    

    for(let i = 0; i < optionAmount; i++){

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

    return [roundsPerTeamOptions,roundsTotalOptions];
}

/**
 * Generates the match schecdule for the matchs and updates JSON
 */
/*
export function generateMatchSchedule(totalMatches : number, matchesPerTeam : number){

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


    const teamNumArr = new Array(teams.length);
    //Needs an if statement to check if there are less than 12 teams, if less some teams will have back to back matches
    for(let i = 0; i < teamNumArr.length; i++) { teamNumArr[i] = teams[i].number; }

    const teamRoundsArr = new Array(teams.length).fill(0);
    const teamLastRoundArr = new Array(teams.length).fill(false);

    let end = false;
    let matchCounter = 1;

    while(!end){

        //First three teams are red alliance, Second three are blue alliance
        const alliance = new Array(6);

        for(let i = 0; i < 6; i++){

            let enda = false;

            ranTeamLoop : 
            while(!enda){
                const ranTeam = Math.floor(Math.random()*(teams.length));

                if(teams.length < 12){

                    if(teamRoundsArr[ranTeam] < matchesPerTeam && alliance.indexOf(teamNumArr[ranTeam]) == -1){
                    
                        alliance[i] = teamNumArr[ranTeam];
                        teamRoundsArr[ranTeam]++;
                        enda = true;
                    }
                } else {

                    if(teamRoundsArr[ranTeam] < matchesPerTeam && !teamLastRoundArr[ranTeam] && alliance.indexOf(teamNumArr[ranTeam]) == -1){
                    
                        alliance[i] = teamNumArr[ranTeam];
                        teamRoundsArr[i]++;
                        enda = true;
                    }
                }
            }
        }
        
        teamLastRoundArr.fill(false);

        for(let i = 0; i < 6; i++){
            teamLastRoundArr[teamNumArr.findIndex(alliance[i])] = true;
        }

        matches.push({
        number: matchCounter,
        redAlliance: [alliance[0],alliance[1],alliance[2]],
        blueAlliance: [alliance[3],alliance[4],alliance[5]]
        });

        matchCounter++;

        if(matchCounter > totalMatches)
            end = true;
    }

    safeWriteJSON(matchSchedulePath, matches);
}
*/

export function generateMatchSchedule(totalMatches : number, matchesPerTeam : number){

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

            while (alliance.length < 6) {
                const team = teamsLeft[0];

                const duplicate = alliance.includes(team);
                const backToBack =
                    teams.length >= 12 &&
                    matchCounter < totalMatches &&
                    teamsLastMatch.includes(team);

                if (!duplicate && !backToBack) {
                    alliance.push(team);
                    teamsLeft.shift(); // consume
                } else {
                    teamsLeft.push(teamsLeft.shift()!); // rotate
                }
            }


            teamsLastMatch = [alliance[0],alliance[1],alliance[2],alliance[3],alliance[4],alliance[5]];

            matches.push({
            number: matchCounter,
            redAlliance: [alliance[0],alliance[1],alliance[2],],
            blueAlliance: [alliance[3],alliance[4],alliance[5]]
            });
        }
    console.log(JSON.stringify(matches, null, 2));
    safeWriteJSON(matchSchedulePath, matches);
}