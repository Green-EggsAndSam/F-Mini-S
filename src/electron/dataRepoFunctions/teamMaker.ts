import { jsonToString } from '../jsonUtils.js'
import { safeWriteJSON } from '../jsonUtils.js'

const teamsPath = './src/electron/dataRepository/teams.json'

/**
 * Adds a team to the teams.json
 * @param number - Teams Number
 * @param name - Teams Name
 * @param skill - Skill level on a scale from 1 to 5
 */
export function addTeam( number : number, name : string, skill : number){

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

/**
 * Updates a teams name in the team Json according to team number
 * @param teamNum - the team number you want to change
 * @param teamName - the name you would like to cahnge the team to
 */
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

/**
 * Updates a teams skill in the team Json according to team number
 * @param teamNum - the teams number you would like to change
 * @param teamSkill - the teams skill level you would like to change on a scale of 1-5
 */
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

/**
 * Removes a team from the teams.json
 * @param teamNumber - team number you want to remove
 */
export function removeTeam(teamNumber : number){

    const teams = JSON.parse(jsonToString(teamsPath));

    type teamFile = {
        number : number,
        name : string,
        skill : number
    };

    type teamListFile = teamFile[];

    const teamList : teamListFile = [];

    for(let i = 0; i < teams.length; i++){

        const team : teamFile = {
            number : teams[i].number,
            name : teams[i].name,
            skill : teams[i].skill
        }
        if(!(teams[i].number == teamNumber)){
            teamList.push(team);
        }
    }

    safeWriteJSON(teamsPath, teamList);
}

/**
 * returns the name of the team you want
 * @param teamNum - The team number you want the name of
 * @returns - the team name requested
 */
export function getTeamName(teamNum : number){

    const teams = JSON.parse(jsonToString(teamsPath));

    for(let i = 0; i < teams.length; i++){

        if(teams[i].number == teamNum)
            return teams[i].name;
    }

    return null;
}

/**
 * The skill level of the team you want
 * @param teamNum - the team number uou want the skill level of
 * @returns return the skill level requested
 */
export function getTeamSkill(teamNum : number){

    const teams = JSON.parse(jsonToString(teamsPath));

    for(let i = 0; i < teams.length; i++){

        if(teams[i].number == teamNum)
            return teams[i].skill;
    }

    return null;
}