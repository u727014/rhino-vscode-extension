/*
 * CHANGE LOG - keep only last 5 threads
 * 
 * RESOURCES
 */
import * as vscode from 'vscode';
import path = require('path');
import { Utilities } from '../extensions/utilities';
import { Command } from "./command";
import { RhinoClient } from '../framework/rhino-client';


export class RegisterEnvironmentCommand extends Command {
    /**
     * Summary. Creates a new instance of VS Command for Rhino API.
     * 
     * @param context The context under which to register the command.
     */
    constructor(context: vscode.ExtensionContext) {
        super(context);

        // build
        this.setCommandName('Register-Environment');
    }

    /*┌─[ REGISTER & INVOKE ]──────────────────────────────────
      │
      │ A command registration pipeline to expose the command
      │ in the command interface (CTRL+SHIFT+P).
      └────────────────────────────────────────────────────────*/
    /**
     * Summary. Register a command for creating an integrated test case.
     */
    public register(): any {
        // build
        let command = vscode.commands.registerCommand(this.getCommandName(), () => {
            this.invoke();
        });

        // set
        this.getContext().subscriptions.push(command);
    }

    /**
     * Summary. Implement the command invoke pipeline.
     */
    public invokeCommand() {
        this.invoke();
    }
    isFunction(functionToCheck: any): boolean {
        // Possibly won't work for async functions - needs further testing
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';

        // return functionToCheck instanceof Function;
    }
    private async invoke(){
        // setup
        let client = this.getRhinoClient();
        let options = {
            placeHolder: 'Environment file name w/o extension (e.g., Production)'
        };
        vscode.window.showInputBox(options).then((value) => {
            RegisterEnvironmentCommand.getEnvironments(value, async (requests:JSON[]) => {

                // setup
                let mergedJson:JSON = requests[0];
            
                // merge requests
                for (let request of requests) {
                    mergedJson = {...mergedJson, ...request};
                }
                
                // bad request
                if (Utilities.isNullOrUndefined(mergedJson)) {
                    vscode.window.setStatusBarMessage('$(testing-error-icon) Environment file not found or not valid.');
                    return;
                }

                // user interface
                vscode.window.setStatusBarMessage('$(sync~spin) Registering environment...');
                // get
                return await client.addEnvironment(mergedJson);
                return await client.syncEnvironment();
                vscode.window.setStatusBarMessage('$(testing-passed-icon) Environment registered');

                // client.addEnvironment(mergedJson, () => {
                    // client.syncEnvironment((response: any) => {
                    //     vscode.window.setStatusBarMessage('$(testing-passed-icon) Environment registered');
                        // if(this.isFunction(callback)){
                        //     callback(response);
                        // }
            //         });
                // }); 
            }); 
        });
    }


    public async getLocatorsMetadata(client: RhinoClient, locators: any, ): Promise<string[] | undefined> {
        return await client.addEnvironment(locators).then((mergedJson) => {
            if (typeof mergedJson === 'string') {
                let _locators: string[] = JSON.parse(locators);
                let functions = [];
                functions.push(..._locators.map((i: any) => '(?<=\\{)' + i.literal + '(?=})'));
                return _locators;
            }
        }); 
    }

    private static getEnvironments(environment: string | undefined, callback: any) {
        // setup
        let listOfEnviorments = environment?.split(/\s*,\s*/);
        
        // check if undefined 
        if(!listOfEnviorments) {
            vscode.window.setStatusBarMessage('$(testing-error-icon) Environment file not found or not valid.');
            return;
        }

        // setup
        let workspace = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
        workspace = workspace === undefined ? '' : workspace;
        let environmetsFolder = path.join(workspace, 'Environments');
        environmetsFolder = environmetsFolder.startsWith('\\')
            ? environmetsFolder.substring(1, environmetsFolder.length)
            : environmetsFolder;

        Utilities.getFilesByFileNames(environmetsFolder, listOfEnviorments, (listOfPaths: string[]) => {
            
            // setup 
            let requests:JSON[] = []; 

            for (let curPath of listOfPaths) {
                // build
                let data = "{}";
                const fs = require('fs');
                try {
                    data = fs.readFileSync(curPath, 'utf8');
                    requests.push(JSON.parse(data));
                } catch (e: any) {
                    console.log('Error:', e.stack);
                    return;
                }
            }
            // callback(requests);
        });
    }
}