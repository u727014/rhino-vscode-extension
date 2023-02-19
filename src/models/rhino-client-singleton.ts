/*
 * CHANGE LOG - keep only last 5 threads
 * 
 * RESOURCES
 * 
 * WORK ITEMS
 * TODO: split actions inside different calsses which represents the backend structure.
 */
import { ResourceModel } from "../contracts/register-data-model";
import { Utilities } from "../extensions/utilities";
import { HttpClient } from "../framework/http-client";
import { HttpCommand } from "../framework/http-command";

export class RhinoClientSingleton {
    // members
    private httpClient: HttpClient;
    private static instance: RhinoClientSingleton;
    private plagins: any;
    private annotations: any;
    private locators: any;
    private assertions: any;
    private operators: any;
    private attributes: any;
    /**
     * Summary. Creates a new instance of RhinoClient.
     */
    private constructor() {
        this.httpClient = new HttpClient(Utilities.getRhinoEndpoint());

        this.getPluginsResponse();
        this.getAnnotationsResponse();
        this.getLocatorsResponse();
        this.getAssertionsResponse();
        this.getOperatorsResponse();
        this.getAttributesResponse();
        // this.getVerbs();
        // this.getActions();
    }

    //currently, will be private.
    public static getInstance() {
        if (RhinoClientSingleton.instance === null) {
            RhinoClientSingleton.instance = new RhinoClientSingleton();
        }
        return RhinoClientSingleton.instance;
    }

    public getPlagins(): any {
        return this.plagins;
    }

    public getAnnotations(): any {
        return this.annotations;
    }

    public getLocators(): any {
        return this.locators;
    }

    public getAssertions(): any {
        return this.assertions;
    }
    
    public getOperators(): any {
        return this.operators;
    }

    public getAttributes(): any {
        return this.attributes;
    }

    private async getPluginsResponse() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/plugins';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async getAnnotationsResponse() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/annotations';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async getLocatorsResponse() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/locators';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async getAssertionsResponse() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/assertions';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async getOperatorsResponse() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/operators';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async getAttributesResponse() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/attributes';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    // public async getVerbs() {
    //     // setup
    //     let httpCommand = new HttpCommand();
    //     httpCommand.command = '/api/v3/meta/verbs';

    //     // get
    //     return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    // }

    // public async getActions(body: string) {
    //     // setup
    //     let httpCommand = new HttpCommand()
    //         .setMethod('POST')
    //         .setCommand(`/api/v3/meta/tests/actions`)
    //         .setBody(body)
    //         .addHeader('Content-Type', 'text/plain');

    //     // get
    //     return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    // }
}