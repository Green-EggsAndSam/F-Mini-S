import {app, BrowserWindow} from 'electron';
import path from 'path';

const devTools = true;//dev tools, inspect element

app.on("ready", ()=> {
    //creates mainWindow

    const mainWindow = new BrowserWindow({
        autoHideMenuBar: true,

        webPreferences: {
            devTools: devTools
        }
    });
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'/*Runs on location of main html for window(main)*/));


    //creates managerWindow
    const managerWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            devTools: devTools
        }
    });
    managerWindow.loadFile(path.join(app.getAppPath(),'/dist-react/manager.html'/*Runs on location of main html for window(manager)*/));
})