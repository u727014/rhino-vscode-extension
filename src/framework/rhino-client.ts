/*
 * CHANGE LOG - keep only last 5 threads
 * 
 * RESOURCES
 * 
 * WORK ITEMS
 * TODO: split actions inside different calsses which represents the backend structure.
 */
import { HttpCommand } from "./http-command";
import { HttpClient } from "./http-client";
import { ResourceModel } from "../contracts/register-data-model";

export class RhinoClient {
    // members
    private httpClient: HttpClient;

    /**
     * Summary. Creates a new instance of RhinoClient.
     */
    constructor(baseUrl: string) {
        this.httpClient = new HttpClient(baseUrl);
    }

    public async addEnvironment(environment: any) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(environment)
            .setCommand('/api/v3/environment')
            .addHeader('Content-Type', 'application/json');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async syncEnvironment() {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('GET')
            .setCommand('/api/v3/environment/sync');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Returns a list of available Action Plugins (both Rhino and Code).
     * 
     * use with async-await
     */
    public async getPlugins() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/plugins';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Returns a list of available Action Plugins (both Rhino and Code).
     * 
     * use with async-await
     */
    public async getPluginsByConfiguration(configuration: string) {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = `/api/v3/meta/plugins/configurations/${configuration}`;

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Returns a list of available Macro Plugins.
     * 
     * use with async-await
     */
    public async getMacros() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/macros';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Returns a single available test case annotation.
     * 
     * @param key      The unique identifier by which to find the requested resource.
     * use with async-await
     */
    public async getAnnotation(key: string) {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/annotations/' + key;

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Returns the list of available Rhino log files.
     * 
     */
    public async getServerLogs() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/logs';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Returns a Rhino log.
     * @param logId        The unique identifier by which to find the requested log.
     * @param numberOfLines An optional value to limit the number of lines returned.
     */
    public async getServerLog(logId: string, numberOfLines?: number) {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = numberOfLines ? `/api/v3/logs/${logId}/size/${numberOfLines}` : `/api/v3/logs/${logId}`;

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * 
     * Summary. Returns a list of available test case annotations.
     * use with async/await
     */
    public async getAnnotations() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/annotations';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Returns a single available locator.
     * 
     * @param key      The unique identifier by which to find the requested resource.
     * use with async-await
     */
    public async getLocator(key: string) {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/locators/' + key;

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Returns a list of available locators.
     * 
     * use async-await
     */
    public async getLocators() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/locators';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Returns a collection of available assertions.
     * 
     * use with async-await
     */
    public async getAssertions() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/assertions';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Returns a collection of available assertions.
     * 
     * use with async-await
     */
    public async getOperators() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/operators';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Returns a list of available Plugins (both Rhino and Code).
     * 
     * use with async-await
     */
    public async getPluginsReferences() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/plugins/references';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Gets a collection of RhinoTestSymbolModel based on the RhinoTestCase spec provided.
     * 
     * use with async-await
     */
    public async getSymbols(input: string) {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/Meta/tests/symbols';
        httpCommand.addHeader('Content-Type', 'text/plain');
        httpCommand.method = 'POST';
        httpCommand.body = input;

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Returns a single available Plugin (both Rhino and Code).
     * 
     * @param key      The unique identifier by which to find the requested resource.
     * use with async-await
     */
    public async getPlugin(key: string) {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/plugins/' + key;

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Returns a collection of available element special attributes.
     * 
     * use with async-await
     */
    public async getAttributes() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/attributes';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Returns a single available Plugin (both Rhino and Code).
     * 
     * @param key      The unique identifier by which to find the requested resource.
     * use with async-await
     */
    public async getPluginReference(key: string) {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/plugins/references/' + key;

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Invoke Rhino Configuration against Rhino Server.
     * 
     * @param configuration The Rhino Configuration object to invoke.
     * use with async-await
     */
    public async invokeConfiguration(configuration: any) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(configuration)
            .setCommand('/api/v3/rhino/configurations/invoke')
            .addHeader('Content-Type', 'application/json');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Creates a new Test Case entity on the integrated application.
     * 
     * @param createModel Integrated Test Case create model.
     * use with async-await
     */
    public async createTestCase(createModel: any) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(createModel)
            .setCommand('/api/v3/integration/test/create')
            .addHeader('Content-Type', 'application/json');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Creates a new Test Case entity on the integrated application.
     * 
     * @param integrationModel Integrated Test Case get model.
     * use with async-await
     */
    public async getTestCase(integrationModel: any) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(integrationModel)
            .setCommand('/api/v3/integration/test/spec')
            .addHeader('Content-Type', 'application/json');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Creates a new Test Case entity on the integrated application.
     * 
     * @param integrationModel Integrated Test Case get model.
     * use with async-await
     */
    public async getTestCases(integrationModel: any) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(integrationModel)
            .setCommand('/api/v3/integration/test/spec')
            .addHeader('Content-Type', 'application/json');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Creates a collection of Rhino Plugins using Rhino Plugins spec.
     * 
     * @param createModel Rhino Plugins spec.
     * use with async-await
     */
    public async createPlugins(createModel: string) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(createModel)
            .setCommand('/api/v3/plugins')
            .addHeader('Content-Type', 'text/plain');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
    /**
     * Summary. Creates a collection of Rhino Resources using Rhino Resources spec.
     * 
     * @param createModel Rhino Resources spec.
     */
    public async createResources(createModel: ResourceModel[]) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(createModel)
            .setCommand('/api/v3/resources/bulk')
            .addHeader('Content-Type', 'application/json');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Creates a collection of Rhino Models.
     * 
     * @param createModel Rhino models request (an array of models).
     * use with async-await
     */
    public async createModelsMd(createModel: string) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(createModel)
            .setCommand('/api/v3/models/md')
            .addHeader('Content-Type', 'text/plain');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async createModels(createModel: any[]) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(createModel)
            .setCommand('/api/v3/models')
            .addHeader('Content-Type', 'application/json');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
     * Summary. Returns a list of available Rhino Page Models.
     * 
     * use with async-await
     */
    public async getModels() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/models';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }


    /**
     * Summary. Delete all models under the user domain.
     * 
     * use with async-await
     */
    public async deleteModels() {
        // setup
        let httpCommand = new HttpCommand().setMethod('DELETE').setCommand('/api/v3/models');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    /**
    * Summary. Returns a list of available Rhino Keywords.
    * 
    * use with async-await
    */
    public async getVerbs() {
        // setup
        let httpCommand = new HttpCommand();
        httpCommand.command = '/api/v3/meta/verbs';

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async createConfiguration(configuration: any) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setBody(configuration)
            .setCommand('/api/v3/configurations')
            .addHeader('Content-Type', 'application/json');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async deleteConfiguration(configuration: any) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('DELETE')
            .setCommand(`/api/v3/configurations/${configuration}`);

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async getActions(body: string) {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('POST')
            .setCommand(`/api/v3/meta/tests/actions`)
            .setBody(body)
            .addHeader('Content-Type', 'text/plain');

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }

    public async getStatus() {
        // setup
        let httpCommand = new HttpCommand()
            .setMethod('GET')
            .setCommand(`/api/v3/ping/rhino`);

        // get
        return await this.httpClient.invokeAsyncWebRequest(httpCommand);
    }
}
