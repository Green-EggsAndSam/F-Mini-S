import IElectronAPI from "../../../dist-electron";

declare global {
    interface Window {
        myAPI: IElectronAPI;
    }
}