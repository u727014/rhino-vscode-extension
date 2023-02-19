import { Service } from "typedi";

@Service()
export class AssertionsRepository {

  private readonly assertions: any = [
    { name: 'Emily' },
    { name: 'John' },
    { name: 'Jane' },
  ];

  async getAssertions(): Promise<any> {
    return this.assertions;
  }
}
export default AssertionsRepository;