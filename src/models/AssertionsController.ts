// import { Request, Response } from "express";

// import { Service } from "typedi";
// import AssertionsService from "./AssertionsService";

// @Service()
// export class AssertionsController {

//     constructor(private readonly assertionsServiceService: any) { }

//     async getAllUsers(_req: Request, res: Response) {
//         const result = await this.assertionsServiceService.getAllAssertions();
//         return res.json(result);
//     }
// }

// export default AssertionsController;
import { Request, Response } from "express";
import { Service } from "typedi";
import AssertionsService from "./AssertionsService";
import AssertionsRepository from "./AssertionsRepository";
import IAssertionsRepository from "./AssertionsRepository";

/**
 * @class UserController
 * @desc Responsible for handling API requests for the
 * /user route.
 **/

let assertionsRepository: AssertionsController;

// beforeEach(() => {
//     assertionsRepository = new AssertionsController(
//         new AssertionsRepository() // Slows down tests, needs a db running
//     );
// });

@Service()
export class AssertionsController {

    // private assertionsRepository: IAssertionsRepository;

    constructor(private readonly assertionsService: AssertionsService) {}

    async getAssertions(_req: Request, res: Response): Promise<any> {
        const result = await this.assertionsService.getAssertionsResponse();

        return res.json(result);
    }
}
export default AssertionsController;