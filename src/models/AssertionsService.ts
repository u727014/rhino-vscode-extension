import { Utilities } from "../extensions/utilities";
import { HttpClient } from "../framework/http-client";
import { HttpCommand } from "../framework/http-command";
import 'reflect-metadata';
import { Service } from "typedi";
import AssertionsRepository from "./AssertionsRepository";
// import AssertionsRepository from "../models/AssertionsRepository";

@Service()
export class AssertionsService {

    constructor(private readonly assertionsRepository: AssertionsRepository) { }

    public async getAssertionsResponse(): Promise<any> {
        // let httpClient = new HttpClient(Utilities.getRhinoEndpoint());
        // // setup
        // let httpCommand = new HttpCommand(); 
        // httpCommand.command = '/api/v3/meta/assertions';

        // // get
        // return await httpClient.invokeAsyncWebRequest(httpCommand);
        return await this.assertionsRepository.getAssertions();
    }
    
}
export default AssertionsService;