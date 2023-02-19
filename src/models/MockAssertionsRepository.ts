import { IAssertionsRepository } from "./IAssertionsRepository";

class MockAssertionsRepository implements IAssertionsRepository {

    private assertions: any[] = [];

    constructor() { }
    getUsers(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getAssertions(): Promise<any[]> {
        return this.assertions;
    }
}