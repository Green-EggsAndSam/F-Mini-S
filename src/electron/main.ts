import {app, BrowserWindow} from 'electron';
import path from 'path';
import { print } from './matchMaker.js';
import { isDev } from './util.js';

const devTools = true;//dev tools #inspect element Change to false before dist.

//creates mainWindow
let mainWindow: BrowserWindow | null = null;

//creates managerWindow
let managerWindow: BrowserWindow| null = null;

app.on("ready", ()=> {

    //set mainWindow actual browser
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,

        webPreferences: {
            devTools: devTools
        }
    });

    //sets the application to whatever mode it is, "dev:editor, or dev:electron in package.json"
    if(isDev())
        mainWindow.loadURL("http://localhost:5123");//port for vite website
    else
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'/*Runs on location of main html for window(main)*/));


    //sets managerWindow actual browser
    managerWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            devTools: devTools
        }
    });

    if(isDev())
        managerWindow.loadURL("http://localhost:5123/manager");//port for vite website
    else
        managerWindow.loadFile(path.join(app.getAppPath(),'/dist-react/manager.html'/*Runs on location of main html for window(manager)*/));

    mainWindow.on('closed', () => {

        mainWindow = null
        app.quit()
    })

    managerWindow.on('closed', () => {
        managerWindow = null
        app.quit()
    })

    print();

});