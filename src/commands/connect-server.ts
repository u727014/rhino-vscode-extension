/*
 * CHANGE LOG - keep only last 5 threads
 * 
 * RESOURCES
 * 
 * WORK ITEMS
 * TODO: use promises and parallel calls to reduce client creation time
 */
import * as vscode from 'vscode';
import { Utilities } from '../extensions/utilities';
import { RhinoClient } from '../framework/rhino-client';
// import { RhinoClientSingleton } from '../models/rhino-client-singleton';

import { ActionsAutoCompleteProvider } from '../providers/actions-auto-complete-provider';
import { AnnotationsAutoCompleteProvider } from '../providers/annotations-auto-complete-provider';
import { AssertionsAutoCompleteProvider } from '../providers/assertions-auto-complete-provider';
import { DataAutoCompleteProvider } from '../providers/data-auto-complete-provider';
import { MacrosAutoCompleteProvider } from '../providers/macros-auto-complete-provider';
import { ModelsAutoCompleteProvider } from '../providers/models-auto-complete-provider';
import { ParametersAutoCompleteProvider } from '../providers/parameters-auto-complete-provider';
import { Command } from "./command";
import { CreateTm } from './create-tm';
import { RegisterRhinoCommand } from './register-rhino';

import 'reflect-metadata';

// import express from 'express';
import Container from 'typedi';
import AssertionsController from '../models/AssertionsController';
import express = require('express');

export class ConnectServerCommand extends Command {
    /**
     * Summary. Creates a new instance of VS Command for Rhino API.
     * 
     * @param context The context under which to register the command.
     */
    constructor(context: vscode.ExtensionContext) {
        super(context);
        // build
        this.setCommandName('Connect-Server');
    }

    /*┌─[ REGISTER & INVOKE ]──────────────────────────────────
      │
      │ A command registration pipeline to expose the command
      │ in the command interface (CTRL+SHIFT+P).
      └────────────────────────────────────────────────────────*/
    /**
     * Summary. Register a command for connecting the Rhino Server and loading all
     *          Rhino Language metadata.
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

    // invocation routine
    private async invoke() {
        // setup
        let client = this.getRhinoClient();
        let context = this.getContext();

        // clean
        new RegisterRhinoCommand(context).invokeCommand();

        // TODO: optimize calls to run in parallel and create TM when all complete
        // build
        try {
            // RhinoClientSingleton.getInstance().getPlagins();

            await this.registerMacrosAsync(client, context);
            // RhinoClientSingleton.getInstance().getAnnotations();
            // let _annotations = RhinoClientSingleton.getInstance().getAssertions();

            let _annotations = await this.registerAnnotations(client, context);
            await this.registerActions(client, context, _annotations);
            // await this.registerAssertions(client, context, _annotations);
            await this.registerDataDrivenSnippetAsync(client, context, _annotations);
            await this.registerModelsAsync(client, context);
            new CreateTm(context).invokeCommand();

            // this.registerAnnotations(client, context, (client: any, context: any) => {
            // this.registerAssertions(client, context, (client: any, context: any) => {
            // this.registerMacros(client, context, (client: any, context: any) => {
            // this.registerDataDrivenSnippet(client, context, (client: any, context: any) => {
            // this.registerModels(client, context, () => {
            // new CreateTm(context).invokeCommand();
            // });
            // });
            // });
            // });
            // });
            // });

        } catch (error) {
            console.error(error);
            vscode.window.setStatusBarMessage("$(testing-error-icon) Errors occurred connecting to Rhino Server");
        }

        // // TODO: optimize calls to run in parallel and create TM when all complete
        // // build
        // try {
        //     this.registerActions(client, context, (client: any, context: any) => {
        //         // this.registerAnnotations(client, context, (client: any, context: any) => {
        //             this.registerAssertions(client, context, (client: any, context: any) => {
        //                 this.registerMacros(client, context, (client: any, context: any) => {
        //                     this.registerDataDrivenSnippet(client, context, (client: any, context: any) => {
        //                         this.registerModels(client, context, () => {
        //                             new CreateTm(context).invokeCommand();
        //                         });
        //                     });
        //                 });
        //             });
        //         // });
        //     });
        // } catch (error) {
        //     console.error(error);
        //     vscode.window.setStatusBarMessage("$(testing-error-icon) Errors occurred connecting to Rhino Server");
        // }

    }

    private async registerActions(client: RhinoClient, context: vscode.ExtensionContext, annotations: any) {
        // user interface
        vscode.window.setStatusBarMessage('$(sync~spin) Loading action(s)...');

        console.log(`${new Date().getTime()} - Start loading actions`);
        // setup
        let configuration = Utilities.getConfigurationByManifest();

        // build
        client.createConfiguration(configuration).then(async (data: any) => {
            console.log(`${new Date().getTime()} - Start register actions create config`, configuration, data);
            let response = JSON.parse(data);
            let configurationId = Utilities.isNullOrUndefined(response) || Utilities.isNullOrUndefined(response.id)
                ? ''
                : response.id;
            return await client.getPluginsByConfiguration(configurationId).then(async (plugins) => {
                console.log(`${new Date().getTime()} - Getting register actions plugins by config`, configurationId);
                let hasNoPlugins = Utilities.isNullOrUndefined(plugins) || plugins === '';
                if (hasNoPlugins) {
                    return await client.getPlugins().then((plugins: any) => {
                        console.log(`${new Date().getTime()} - NO PLUGINS - Getting register actions metadata by config`, configurationId);
                        this.getAsyncMetadata(client, context, plugins, annotations);
                    });
                }
                else {
                    console.log(`${new Date().getTime()} - Getting register actions metadata by config`, configurationId);
                    this.getAsyncMetadata(client, context, plugins, annotations);
                }
            });

        });
    }

    public async getAsyncMetadata(client: RhinoClient, context: vscode.ExtensionContext, plugins: any, annotations: any): Promise<string[] | undefined> {
        return await client.getAttributes().then((attributes) => {
            // client.getLocators((locators: any) => {
            if (typeof attributes === 'string') {
                let _attributes: string[] = JSON.parse(attributes);
                // let _locators: string[] = JSON.parse(locators);
                let _annotations: string[] = JSON.parse(annotations);
                let actionsManifests: string[] = JSON.parse(plugins);
                let pluginsPattern = Utilities.getPluginsPattern(actionsManifests);

                new ActionsAutoCompleteProvider()
                    .setPattern(pluginsPattern)
                    .setManifests(actionsManifests)
                    .setAttributes(_attributes)
                    // .setLocators(_locators)
                    .setAnnotations(_annotations)
                    .register(context);

                console.info('Get-Plugins -Type Actions = (OK, ' + actionsManifests.length + ')');
                let message = '$(testing-passed-icon) Total of ' + actionsManifests.length + ' action(s) loaded';
                vscode.window.setStatusBarMessage(message);

                return _attributes;
            }
        });
    }

    private async registerAnnotations(client: RhinoClient, context: vscode.ExtensionContext): Promise<string[] | undefined> {
        // user interface
        vscode.window.setStatusBarMessage('$(sync~spin) Loading annotations(s)...');
        console.log(`${new Date().getTime()} - Start loading annotations`);

        // build   
        return await client.getAnnotations().then((annotations) => {
            if (typeof annotations === 'string') {
                let manifests: string[] = JSON.parse(annotations);
                new ModelsAutoCompleteProvider().setManifests(manifests).register(context);
                vscode.window.setStatusBarMessage('$(testing-passed-icon) Page models loaded');
                return manifests;
            }
        });
    }

    public async registerAssertions(client: RhinoClient, context: vscode.ExtensionContext, annotations: any): Promise<string[] | undefined> {
        // user interface
        vscode.window.setStatusBarMessage('$(sync~spin) Loading assertion method(s)...');
        console.log(`${new Date().getTime()} - Start loading assertions`);

        // build  
        // const main = async () => {
        const app = express();

        const assertions = Container.get(AssertionsController);

        app.get('/assertions', (req, res) => assertions.getAssertions(req, res));

        app.listen(3000, () => {
            console.log('Server started');
        });
        // return await client.getAssertions().then((assertions: any) => {
        if (typeof assertions === 'string') {

            // let _annotations: string[] = JSON.parse(annotations);
            let manifests: string[] = JSON.parse(assertions);
            // let _attributes: string[] = JSON.parse(attributes);
            // let _locators: string[] = JSON.parse(locators);
            // let _operators: string[] = JSON.parse(operators);

            new ActionsAutoCompleteProvider()
                // .setAnnotations(_annotations)
                .setManifests(manifests)
                // .setAttributes(_attributes)
                // .setLocators(_locators)
                // .setOperators(_operators)
                .register(context);

            console.info('Get-Plugins -Type AssertionMethod = (OK, ' + manifests.length + ')');
            let message = '$(testing-passed-icon) Total of ' + manifests.length + ' assertion method(s) loaded';
            vscode.window.setStatusBarMessage(message);

            return manifests;
        }
        this.registerAssertions(client, context, annotations).catch(err => {
            console.error(err);
        });
        // });
    }

    public async registerMacrosAsync(client: RhinoClient, context: vscode.ExtensionContext): Promise<string[] | undefined> {
        // user interface
        vscode.window.setStatusBarMessage('$(sync~spin) Loading macros(s)...');
        console.log(`${new Date().getTime()} - Start loading macros`);

        // build  
        return await client.getMacros().then((macros) => {
            if (typeof macros === 'string') {
                let manifests: string[] = JSON.parse(macros);
                new MacrosAutoCompleteProvider().setManifests(manifests).register(context);
                console.info('Get-Plugins -Type Macro = (OK, ' + manifests.length + ')');
                let message = '$(testing-passed-icon) Total of ' + manifests.length + ' macros(s) loaded';
                vscode.window.setStatusBarMessage(message);
                return manifests;
            }
        });
    }

    // private registerMacros(client: RhinoClient, context: vscode.ExtensionContext, callback: any) {
    //     // user interface
    //     vscode.window.setStatusBarMessage('$(sync~spin) Loading macros(s)...');
    //     console.log(`${new Date().getTime()} - Start loading macros`);

    //     // build
    //     client.getMacros((macros: any) => {
    //         let manifests = JSON.parse(macros);
    //         new MacrosAutoCompleteProvider().setManifests(manifests).register(context);

    //         console.info('Get-Plugins -Type Macro = (OK, ' + manifests.length + ')');
    //         let message = '$(testing-passed-icon) Total of ' + manifests.length + ' macros(s) loaded';
    //         vscode.window.setStatusBarMessage(message);

    //         if (callback === null) {
    //             return;
    //         }
    //         callback(client, context);
    //     });
    // }

    public async registerDataDrivenSnippetAsync(client: RhinoClient, context: vscode.ExtensionContext, annotations: any) {
        // user interface
        vscode.window.setStatusBarMessage('$(sync~spin) Loading data-driven snippet(s)...');
        console.log(`${new Date().getTime()} - Start loading data-driven snippet(s)`);

        // build  
        // await client.getAnnotations().then((annotations) => {
        if (typeof annotations === 'string') {
            let _annotations: string[] = JSON.parse(annotations);
            new DataAutoCompleteProvider().setAnnotations(_annotations).register(context);
            vscode.window.setStatusBarMessage('$(testing-passed-icon) Data-Driven snippet(s) loaded');
            return _annotations;
        }
        // });
    }

    // private async registerDataDrivenSnippet(client: RhinoClient, context: vscode.ExtensionContext, callback: any) {
    //     // user interface
    //     vscode.window.setStatusBarMessage('$(sync~spin) Loading data-driven snippet(s)...');
    //     console.log(`${new Date().getTime()} - Start loading data-driven snippet(s)`);

    //     // build
    //     client.getAnnotations((annotations: any) => {
    //         let _annotations = JSON.parse(annotations);
    //         new DataAutoCompleteProvider().setAnnotations(_annotations).register(context);
    //         vscode.window.setStatusBarMessage('$(testing-passed-icon) Data-Driven snippet(s) loaded');

    //         if (callback === null) {
    //             return;
    //         }
    //         callback(client, context);
    //     });
    // }

    // private async registerModels(client: RhinoClient, context: vscode.ExtensionContext, callback: any) {
    //     // user interface
    //     vscode.window.setStatusBarMessage('$(sync~spin) Loading page model(s)...');
    //     console.log(`${new Date().getTime()} - Start loading page model(s)`);

    //     // build
    //     client.getModels((models: any) => {
    //         let _models = JSON.parse(models);
    //         new ModelsAutoCompleteProvider().setManifests(_models).register(context);
    //         vscode.window.setStatusBarMessage('$(testing-passed-icon) Page models loaded');

    //         if (callback === null) {
    //             return;
    //         }
    //         callback(client, context);
    //     });
    // }
    // }
    public async registerModelsAsync(client: RhinoClient, context: vscode.ExtensionContext): Promise<string[] | undefined> {
        // user interface
        vscode.window.setStatusBarMessage('$(sync~spin) Loading page model(s)...');
        console.log(`${new Date().getTime()} - Start loading page model(s)`);

        // build   
        return await client.getModels().then((models) => {
            if (typeof models === 'string') {
                let _models: string[] = JSON.parse(models);
                new ModelsAutoCompleteProvider().setManifests(_models).register(context);
                vscode.window.setStatusBarMessage('$(testing-passed-icon) Page models loaded');
                return _models;
            }
        });
    }
}