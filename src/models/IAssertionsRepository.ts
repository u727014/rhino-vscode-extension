/**
 * @interface IAssertionsRepository
 * @desc Responsible for pulling users from persistence.
 **/

export interface IAssertionsRepository {          // Exported
    getAssertions(): Promise<any>
}

class AssertionsRepository implements IAssertionsRepository { // Not exported

    constructor() { }

    async getAssertions(): Promise<any> {
        return this.getAssertions;
    }
}