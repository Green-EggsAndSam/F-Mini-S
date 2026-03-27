import { contextBridge, ipcRenderer } from "electron/renderer";

export interface IElectronAPI {
    ping: () => Promise<string>;
    getTeamName: (teamNumber: number) => Promise<string>;
    loadScreenWindow: () => void;
}

const api: IElectronAPI = {
    ping: () => ipcRenderer.invoke("ping"),
    getTeamName: (teamNumber: number) => ipcRenderer.invoke("getTeamName", teamNumber),
    loadScreenWindow: () => ipcRenderer.invoke("loadScreenWindow")
}

contextBridge.exposeInMainWorld('myAPI', api);