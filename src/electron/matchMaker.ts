import fs from 'fs';
import osUtils from 'os-utils';

const matchSchedulePath = './src/electron//matchSchedule.json'
const teamsPath = './src/electron/teams.json'

let teams = JSON.parse(jsonToString(teamsPath));
let matchSchedule = JSON.parse(jsonToString(matchSchedulePath));

export function print(){
    setInterval(()=> {
        console.log(teams[0]);
    }, 1000);
}

export function jsonToString(path : string): string{
    return fs.readFileSync(path,'utf-8');
}

function update(){
    teams = JSON.parse(jsonToString(teamsPath));
    matchSchedule = JSON.parse(jsonToString(matchSchedulePath));
}