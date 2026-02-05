import fs from 'fs';
import { jsonToString } from './jsonUtils.js'

const matchSchedulePath = './src/electron//matchSchedule.json'
const teamsPath = './src/electron/teams.json'

let teams = JSON.parse(jsonToString(teamsPath));
let matchSchedule = JSON.parse(jsonToString(matchSchedulePath));

export function print(){
    setInterval(()=> {
        console.log(matchOptions(5));
    }, 1000);
}

/**
 * Teams team json and returns options for the array based on input amount
 * @param optionsNum - the amount of options in the output array you want
 * @returns Returns possible options for a match in an array made of two arrays, [Matches per team, Matches total]
 */
export function matchOptions( optionsNum : number){
    const teams = JSON.parse(jsonToString(teamsPath));

    const optionAmount = optionsNum;
    let roundsPerTeamOptions = new Array(optionAmount).fill(1);
    let roundsTotalOptions = new Array(optionAmount);
    

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
export function generateMatchSchedule(){
    const teams = JSON.parse(jsonToString(teamsPath));
    const matchScheduleJSON = JSON.parse(jsonToString(matchSchedulePath));
    let result = "[\n\n\t";

    let teamNumArr = new Array(teams.length);

    for(let i = 0; i < teamNumArr.length; i++) { teamNumArr[i] = teams[i].number; }

    let teamRoundsArr = new Array(teams.length).fill(0);
    let teamLastRoundArr = new Array(teams.length).fill(false);
}