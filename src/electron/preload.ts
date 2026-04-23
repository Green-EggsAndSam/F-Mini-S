import { contextBridge, ipcRenderer } from "electron/renderer";

type TeamInput = {
  number: string;
  name: string;
  skill: string;
};

type Match = {
        number: number,
        redAlliance: number[],
        blueAlliance: number[]
    };

export interface IElectronAPI {
    ping: () => Promise<string>;
    getTeamName: (teamNumber: number) => Promise<string>;
    loadScreenWindow: () => void;
    loadRanksWindow: () => void;
    openLinkExternally: (url : string) => void;
    getTeamNumberList: () => Promise<number[]>;
    getTeamNameList: () => Promise<string[]>;
    getTeamSkillList: () => Promise<number[]>;
    updateTeamsJson: (teams : TeamInput[]) => void;
    getMatchOptions: (amt : number) => Promise<number[][]>;
    getAndUpdateMatchSchedule: (matchesPerTeam : number, matchesTotal : number) => Promise<Match[]>;
    getMatchSchedule: () => Promise<Match[]>;
}

const api: IElectronAPI = {
    ping: () => ipcRenderer.invoke("ping"),
    getTeamName: (teamNumber: number) => ipcRenderer.invoke("getTeamName", teamNumber),
    loadScreenWindow: () => ipcRenderer.invoke("loadScreenWindow"),
    loadRanksWindow: () => ipcRenderer.invoke("loadRanksWindow"),
    openLinkExternally: (url : string) => ipcRenderer.invoke("openLinkExternally", url),
    getTeamNameList: () => ipcRenderer.invoke("getTeamNameList"),
    getTeamNumberList: () => ipcRenderer.invoke("getTeamNumberList"),
    getTeamSkillList: () => ipcRenderer.invoke("getTeamSkillList"),
    updateTeamsJson: (teams : TeamInput[]) => ipcRenderer.invoke('updateTeamsJson', teams),
    getMatchOptions: (amt : number) => ipcRenderer.invoke('getMatchOptions', amt),
    getAndUpdateMatchSchedule: (matchesPerTeam : number, matchesTotal : number) => ipcRenderer.invoke('getAndUpdateMatchSchedule', matchesPerTeam, matchesTotal),
    getMatchSchedule: () => ipcRenderer.invoke('getMatchSchedule')
}

contextBridge.exposeInMainWorld('myAPI', api);