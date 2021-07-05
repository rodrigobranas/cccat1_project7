import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";

export default class IsAuthorized {

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        
    }
    
    async execute (token: string): Promise<boolean> {
        if (token !== "123456") throw new Error("Not authorized");
        return true;
    }
}
