import { jsonToString } from './jsonUtils.js'
import { safeWriteJSON } from './jsonUtils.js'

const teamsPath = './src/electron/teams.json'

/**
 * Adds a team to the teams.json
 * @param number - Teams Number
 * @param name - Teams Name
 * @param skill - Skill level on a scale from 1 to 5
 */
export function addTeam( number : number, name : string, skill : number){

    console.log("Working");

    type teamFile = {
        number : number,
        name : string,
        skill : number
    };

    const team : teamFile = ({
        number : number,
        name : name,
        skill : skill
    });

    if(number == 0 || name == ("") || !(skill > 0 && skill < 6)){
        return;
    }

    const teamsString = jsonToString(teamsPath);

    type teamListFile = teamFile[];

    if(teamsString.length == 0){
        const teamList : teamListFile = [];
        teamList.push(team);
        safeWriteJSON(teamsPath,teamList);
        return;
    }

    const teams = JSON.parse(jsonToString(teamsPath));

    // if(teams.length == 1){
    //     teams.push(team);
    //     return;
    // }
    
        if(number > teams[teams.length-1].number){
            teams.push(team);

    } else {

    for(let i = 0; i < teams.length; i++){
        
        if(teams[i].number == number){
            return;
        }
        if(teams[i].number > number){
            teams.splice(i,0,team);
            
            break;
        }
    }
    }

    safeWriteJSON(teamsPath, teams);
}

export function updateTeamName( teamNum : number, teamName : string){

    if(teamName == ""){return}
    const teams = JSON.parse(jsonToString(teamsPath));

    let index = 0;

    for(let i = 0; i < teams.length; i++){
        if(teams[i].number == teamNum){
            index = i;
            break;
        }

        if(i == teams.length-1)
            return;
    }

    teams[index].name = teamName;

    safeWriteJSON(teamsPath, teams);
}

export function updateTeamSkill( teamNum : number, teamSkill : number){

    if(!(teamSkill > 0 && teamSkill < 6)){return}

    const teams = JSON.parse(jsonToString(teamsPath));

    let index = 0;

    for(let i = 0; i < teams.length; i++){
        if(teams[i].number == teamNum){
            index = i;
            break;
        }

        if(i == teams.length-1)
            return;
    }

    teams[index].skill = teamSkill;

    safeWriteJSON(teamsPath, teams);
}