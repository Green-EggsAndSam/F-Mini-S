import { jsonToString } from '../jsonUtils.js';
import { safeWriteJSON } from '../jsonUtils.js';

const matchSchedulePath = './src/electron/matchSchedule.json';
const matchResultsPath = './src/electron/matchResults.json';

/**
 * Makes a match result based on the 2026 Rebuilt game, and puts into the matchResults.json
 * @param matchNum - what num the match was
 * @param redPoints 
 * @param redFuelScored 
 * @param redEndClimbsL1
 * @param redEndClimbsL2
 * @param redEndClimbsL3
 * @param redAutoClimbs 
 * @param bluePoints 
 * @param blueFuelScored 
 * @param blueEndClimbsL1
 * @param blueEndClimbsL2 
 * @param blueEndClimbsL3 
 * @param blueAutoClimbs 
 */
export function addRebuiltMatchResult(matchNum : number,
    redPoints : number,  redFuelScored : number, redEndClimbsL1 : number, redEndClimbsL2 : number, redEndClimbsL3 : number, redAutoClimbs : number,
    bluePoints : number,  blueFuelScored : number, blueEndClimbsL1 : number, blueEndClimbsL2 : number, blueEndClimbsL3 : number, blueAutoClimbs : number
){

    let matchResults = [];

    const rawResults = jsonToString(matchResultsPath);

    if (rawResults && rawResults.trim().length > 0) {
        matchResults = JSON.parse(rawResults);
    }

    const matchSchedule = JSON.parse(jsonToString(matchSchedulePath));
    

    type matchResultFile = {
        matchNumber: number,
        time: [{day:number},{month:number},{year:number},{hour:number},{minute:number}],
        alliance:[

            {
                color: "red",
                teams: [number, number, number],
                points: number,
                fuelScored: number,
                autoClimbs: number,
                endClimbsL1: number,
                endClimbsL2: number,
                endClimbsL3: number,
                energizedRP: boolean,
                superchargedRP: boolean,
                traversalRP: boolean,
                win: boolean
            },
            {
                color: "blue",
                teams: [number, number, number],
                points: number,
                fuelScored: number,
                autoClimbs: number,
                endClimbsL1: number,
                endClimbsL2: number,
                endClimbsL3: number,
                energizedRP: boolean,
                superchargedRP: boolean,
                traversalRP: boolean,
                win: boolean
            }
            ]
    }

    const time = new Date();

    time.setMinutes(time.getMinutes() - 2, time.getSeconds() - 40);

    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();
    const hour = time.getHours();
    const minute = time.getMinutes();
    
    let redEnergizedRP = false

    if(redFuelScored >= 100)
        redEnergizedRP = true;

    let redSuperChargedRP = false

    if(redFuelScored >= 360)
        redSuperChargedRP = true;

    const redClimbPoints = 15*redAutoClimbs + 10*redEndClimbsL1 + 20*redEndClimbsL2 + 30*redEndClimbsL3;

    let redTraversalRP = false

    if(redClimbPoints >= 50)
        redTraversalRP = true;

    let redWin = false;
    let blueWin = false;

    if(redPoints > bluePoints){
        redWin = true;
    } else if( bluePoints > redPoints){
        blueWin = true;
    }



    let blueEnergizedRP = false

    if(blueFuelScored >= 100)
        blueEnergizedRP = true;

    let blueSuperChargedRP = false

    if(blueFuelScored >= 360)
        blueSuperChargedRP = true;

    const blueClimbPoints = 15*blueAutoClimbs + 10*blueEndClimbsL1 + 20*blueEndClimbsL2 + 30*blueEndClimbsL3;

    let blueTraversalRP = false

    if(blueClimbPoints >= 50)
        blueTraversalRP = true;



    const matchIndex = findMatchIndex(matchNum);


    if(matchIndex == -1)
        return;

    const matchResult : matchResultFile = {
        matchNumber: matchNum,
        time: [{day:day},{month:month},{year:year},{hour:hour},{minute:minute}],
        alliance:[

            {
                color: "red",
                teams: [matchSchedule[matchIndex].redAlliance[0], matchSchedule[matchIndex].redAlliance[1], matchSchedule[matchIndex].redAlliance[2]],
                points: redPoints,
                fuelScored: redFuelScored,
                autoClimbs: redAutoClimbs,
                endClimbsL1: redEndClimbsL1,
                endClimbsL2: redEndClimbsL2,
                endClimbsL3: redEndClimbsL3,
                energizedRP: redEnergizedRP,
                superchargedRP: redSuperChargedRP,
                traversalRP: redTraversalRP,
                win: redWin
            },
            {
                color: "blue",
                teams: [matchSchedule[matchIndex].blueAlliance[0], matchSchedule[matchIndex].blueAlliance[1], matchSchedule[matchIndex].blueAlliance[2]],
                points: bluePoints,
                fuelScored: blueFuelScored,
                autoClimbs: blueAutoClimbs,
                endClimbsL1: blueEndClimbsL1,
                endClimbsL2: blueEndClimbsL2,
                endClimbsL3: blueEndClimbsL3,
                energizedRP: blueEnergizedRP,
                superchargedRP: blueSuperChargedRP,
                traversalRP: blueTraversalRP,
                win: blueWin
            }
            ]
    }

    if(matchResults.length === 0){

        type matchResultListFile = matchResultFile[];

        const matchResultList : matchResultListFile = [];

        matchResultList.push(matchResult);

        safeWriteJSON(matchResultsPath,matchResultList);
        return;
        
    } else{

        for(let i = 0; i < matchResults.length; i++){

            if(matchResults[i].matchNumber == matchResult.matchNumber)
                return;
        }

        matchResults.push(matchResult);

        safeWriteJSON(matchResultsPath, matchResults);
    }
}

/**
 * returns which color alliance won
 * @param matchNum - number of the match you want the winner of
 * @returns - a string saying red or blue, depending on winner, or tie if tie
 */
export function getWinningColor(matchNum : number){

    const matchIndex = findMatchIndex(matchNum);

    if(matchIndex == -1)
        return null;

    const matchResults = JSON.parse(jsonToString(matchResultsPath));

    if(matchResults[matchIndex].alliance[0].win)
        return "red";
    else if(matchResults[matchIndex].alliance[1].win)
        return "blue";

    return "tie";
}

/**
 * returns the teams in alliance 
 * @param matchNum - number of the match you want the winners of
 * @returns - an array of the 3 winning teams on alliance
 */
export function getWinningAlliance(matchNum : number){

    const matchIndex = findMatchIndex(matchNum);

    if(matchIndex == -1)
        return null;

    const matchResults = JSON.parse(jsonToString(matchResultsPath));

    let winningAlliance = 0;
    if(!matchResults[matchIndex].alliance[0].win)
        winningAlliance = 1;
        


    return matchResults[matchIndex].alliance[winningAlliance].teams;
}

/**
 * returns the teams in alliance 
 * @param matchNum - number of the match you want the losers of
 * @returns - an array of the 3 losing teams on alliance
 */
export function getLosingAlliance(matchNum : number){

    const matchIndex = findMatchIndex(matchNum);

    if(matchIndex == -1)
        return null;

    const matchResults = JSON.parse(jsonToString(matchResultsPath));

    let losingAlliance = 1;
    if(!matchResults[matchIndex].alliance[0].win)
        losingAlliance = 0;
        


    return matchResults[matchIndex].alliance[losingAlliance].teams;
}

/**
 * Updates the time the match was played
 * @param matchNum - the num of the match you want to change
 * @param day - the day you want to change to
 * @param month - the month you want to change to
 * @param year - the year you want to change to
 * @param hour - the hour you want to change to
 * @param minute - the minute you want to change to
 */
export function updateTime(matchNum : number, day : number, month : number, year : number, hour :number, minute : number){

    const matchIndex = findMatchIndex(matchNum);

    if(matchIndex == -1)
        return;

    const matchResults = JSON.parse(jsonToString(matchResultsPath));

    matchResults[matchIndex].time[0] = day;
    matchResults[matchIndex].time[1] = month;
    matchResults[matchIndex].time[2] = year;
    matchResults[matchIndex].time[3] = hour;
    matchResults[matchIndex].time[4] = minute;

    safeWriteJSON(matchResultsPath, matchResults);
}

/**
 * Updates the amount of fueled score for a match
 * @param color - color alliance to change to, string either saying "blue" or "red"
 * @param matchNum - the match num you want to change
 * @param newFuelScored - the new amount of fuel scored
 */
export function updateFuelScored(color : string, matchNum : number, newFuelScored : number){

    const matchIndex = findMatchIndex(matchNum);

    if(matchIndex == -1)
        return;

    const matchResults = JSON.parse(jsonToString(matchResultsPath));

    let colorIndex = 0;

    if(color == "blue")
        colorIndex = 1;

    matchResults[matchIndex].alliance[colorIndex].fuelScored = newFuelScored;

    safeWriteJSON(matchResultsPath, matchResults);
}

/**
 * Updates the amount of climbs for a level and match
 * @param color - color alliance to change to, string either saying "blue" or "red"
 * @param level - the level of climb, either 1,2,3
 * @param matchNum - the mantch num ytou want to make a change to
 * @param newClimbsScored - the amount of climbvsw alliance has now
 */
export function updateClimbs(color : string, level : number, matchNum : number, newClimbsScored : number){

     const matchIndex = findMatchIndex(matchNum);

    if(matchIndex == -1)
        return;

    const matchResults = JSON.parse(jsonToString(matchResultsPath));

    let colorIndex = 0;

    if(color == "blue")
        colorIndex = 1;

    if(level == 1){
        matchResults[matchIndex].alliance[colorIndex].endClimbsL1 = newClimbsScored;
    }   else if ( level == 2){
        matchResults[matchIndex].alliance[colorIndex].endClimbsL2 = newClimbsScored;
    }   else if (level == 3){
        matchResults[matchIndex].alliance[colorIndex].endClimbsL3 = newClimbsScored;
    }

    safeWriteJSON(matchResultsPath, matchResults);
}

/**
 * The match that was last recorded in matchResults.json
 * @returns the match number of last played match, if there arn't returns 0;
 */
export function getLastMatchNumber(){

    const raw = jsonToString(matchResultsPath);

    if (!raw || raw.trim().length === 0) {
        return 0;
    }

    const matchResults = JSON.parse(raw);

    return matchResults[matchResults.length-1].matchNumber;
}

function findMatchIndex(matchNum : number){

    const raw = jsonToString(matchSchedulePath);

    if (!raw || raw.trim().length === 0) {
        return -1;

    }

    const matchSchedule = JSON.parse(raw);

    for (let i = 0; i < matchSchedule.length; i++) {
        if (matchSchedule[i].number == matchNum) {
            return i;
        }
    }

    return -1;
}

