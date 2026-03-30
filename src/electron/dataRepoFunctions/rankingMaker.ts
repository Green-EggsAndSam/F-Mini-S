import { jsonToString } from '../jsonUtils.js'
import { safeWriteJSON } from '../jsonUtils.js'

const matchResultsPath = './src/electron/dataStorage/matchResults.json'
const teamsPath = './src/electron/dataRepository/teams.json'
const teamRanksPath = './src/electron/dataRepository/teamRanks.json'

/**
 * Updates teamRanks.json based on current matchResults and Teams
 */
export function updateRankingPoints(){

    if(jsonToString(teamsPath).length == 0 || jsonToString(matchResultsPath).length == 0)
        return;

    const teams = JSON.parse(jsonToString(teamsPath));
    const matchResults = JSON.parse(jsonToString(matchResultsPath));

    type TeamRank = {
        teamNum: number,
        rank: number,
        rankingPoints: number,
        epa: number
    }

    type TeamRanks = TeamRank[];

    const teamRanks : TeamRanks = [];

    for(let j = 0; j < teams.length; j++){
        const teamNum = teams[j].number;
        let rankingPoint = 0;
        let pointsScored = 0;
        let matchesAmt = 0;

        for(let i = 0; i < matchResults.length; i++){
            if(matchResults[i].alliance[0].find(teamNum) != -1){
                
                matchesAmt++;
                pointsScored += matchResults[i].alliance[0].points;

                if(matchResults[i].alliance[0].energizedRP)
                    rankingPoint++;

                if(matchResults[i].alliance[0].traversalRP)
                    rankingPoint++;

                if(matchResults[i].alliance[0].superchargedRP)
                    rankingPoint++;

                if(matchResults[i].alliance[0].win && matchResults[i].alliance[1].win)
                    rankingPoint++;
                else if(matchResults[i].alliance[0].win)
                    rankingPoint += 3;
            }
            else if(matchResults[i].alliance[1].find(teamNum) != -1){

                matchesAmt++;
                pointsScored += matchResults[i].alliance[0].points;

                if(matchResults[i].alliance[1].energizedRP)
                    rankingPoint++;

                if(matchResults[i].alliance[1].traversalRP)
                    rankingPoint++;

                if(matchResults[i].alliance[1].superchargedRP)
                    rankingPoint++;

                if(matchResults[i].alliance[0].win && matchResults[i].alliance[1].win)
                    rankingPoint++;
                else if(matchResults[i].alliance[1].win)
                    rankingPoint += 3;
            }
        }

        const teamRankInput : TeamRank = {
            teamNum: teamNum,
            rank: 1,
            rankingPoints: rankingPoint,
            epa: (pointsScored/matchesAmt)
        }

        teamRanks.push(teamRankInput);
    }

    for(let i = 0; i < teamRanks.length; i++){
        const teamNum = teamRanks[i].teamNum;
        const teamRankingPoints = teamRanks[i].rankingPoints
        const teamEpa = teamRanks[i].rankingPoints

        let greatestIndex = i;
        let greatestVal = teamRankingPoints;
        let greatestEpa = teamEpa;

        for(let j = i; j < teamRanks.length; j++){

            if(teamRanks[j].rankingPoints == greatestVal){
                if(teamRanks[j].epa >= greatestVal){
                    greatestIndex = j;
                    greatestVal = teamRanks[j].rankingPoints;
                    greatestEpa = teamRanks[j].epa;
                }
            }
            else if(teamRanks[j].rankingPoints > greatestVal){
                greatestIndex = j;
                greatestVal = teamRanks[j].rankingPoints;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                greatestEpa = teamRanks[j].epa;
            }
        }

        const tempTeam : TeamRank = {
            teamNum: teamNum,
            rank: 0,
            rankingPoints: teamRankingPoints,
            epa: teamRanks[i].epa
        }

        teamRanks[i] = teamRanks[greatestIndex];
        teamRanks[greatestIndex] = tempTeam;
    }

    for(let i = 0; i < teamRanks.length; i++){
        teamRanks[i].rank = i + 1;
    }

    safeWriteJSON(teamRanksPath,teamRanks);
}