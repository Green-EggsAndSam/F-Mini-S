import {app, BrowserWindow, shell} from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { ipcMain } from "electron/main"
import { getTeamName, getTeamNamesList, getTeamNumList, getTeamSkillList, writeNewTeamJson } from './dataRepoFunctions/teamMaker.js';
import { getAndUpdateMatchSchedule, getMatchSchedule, matchOptions } from './dataRepoFunctions/matchMaker.js';

const devTools = true;//dev tools #inspect element Change to false before dist.

//creates mainWindow
let mainWindow: BrowserWindow | null = null;

let ranksWindow: BrowserWindow | null = null;

//creates screenWindow
let screenWindow: BrowserWindow| null = null;

function openLink(url: string) {
  shell.openExternal(url);
}

app.on("ready", ()=> {
    ipcMain.handle("ping", () => "pong");
    ipcMain.handle("getTeamName", (_, teamNumber) => getTeamName(teamNumber));
    ipcMain.handle("loadScreenWindow", () => loadScreenWindow());
    ipcMain.handle("loadRanksWindow", () => loadRanksWindow());
    ipcMain.handle("openLinkExternally", (_, url) => openLink(url));
    ipcMain.handle("getTeamNameList", () => getTeamNamesList());
    ipcMain.handle("getTeamNumberList", () => getTeamNumList());
    ipcMain.handle("getTeamSkillList", () => getTeamSkillList());
    ipcMain.handle("updateTeamsJson", (_, teams) => writeNewTeamJson(teams));
    ipcMain.handle("getMatchOptions", (_, amt) => matchOptions(amt));
    ipcMain.handle("getAndUpdateMatchSchedule", (_, matchesPerTeam, matchesTotal) => getAndUpdateMatchSchedule(matchesPerTeam, matchesTotal));
    ipcMain.handle("getMatchSchedule", () => getMatchSchedule());
    //set mainWindow actual browser
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,

        webPreferences: {
            devTools: devTools,
            preload: path.join(app.getAppPath(), 'dist-electron/preload.js'),
            contextIsolation: true
        }
    });

    //sets the application to whatever mode it is, "dev:editor, or dev:electron in package.json"
    if(isDev())
        mainWindow.loadURL("http://localhost:5123");//port for vite website
    else
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'/*Runs on location of main html for window(main)*/));

    mainWindow.on('closed', () => {

        mainWindow = null;
        app.quit();
    })
});

function loadScreenWindow(){

        screenWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            devTools: devTools,
            preload: path.join(app.getAppPath(), 'dist-electron/preload.js'),
            contextIsolation: true
        }
    });

         if(isDev())
        screenWindow.loadURL("http://localhost:5123/screen");//port for vite website
    else
        screenWindow.loadFile(path.join(app.getAppPath(),'/dist-react/screen.html'/*Runs on location of main html for window(screen)*/));
}

function loadRanksWindow(){

        ranksWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            devTools: devTools,
            preload: path.join(app.getAppPath(), 'dist-electron/preload.js'),
            contextIsolation: true
        }
    });

         if(isDev())
        ranksWindow.loadURL("http://localhost:5123/ranks");//port for vite website
    else
        ranksWindow.loadFile(path.join(app.getAppPath(),'/dist-react/ranks.html'/*Runs on location of main html for window(screen)*/));
}