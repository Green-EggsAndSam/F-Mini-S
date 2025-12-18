import {app, BrowserWindow} from 'electron';
import path from 'path';

app.on("ready", ()=> {
    //creates mainWindow
    const mainWindow = new BrowserWindow();
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'/*Runs on location of main html for window(main)*/));

    //creates managerWindow
    const managerWindow = new BrowserWindow();
    managerWindow.loadFile(path.join(app.getAppPath(),'/dist-react/manager.html'/*Runs on location of main html for window(manager)*/));
})