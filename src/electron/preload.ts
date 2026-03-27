
import { contextBridge, ipcRenderer } from "electron/renderer";

export interface IElectronAPI {
    ping: () => Promise<string>;
    getTeamName: (teamNumber: number) => Promise<string>;
}

const api: IElectronAPI = {
    ping: () => ipcRenderer.invoke("ping"),
    getTeamName: (teamNumber: number) => ipcRenderer.invoke("getTeamName", teamNumber)
}

contextBridge.exposeInMainWorld('myAPI', api);