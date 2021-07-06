import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";

export default class IsAuthenticated {

    constructor (repositoryFactory: RepositoryAbstractFactory) {
    }
    
    async execute (token: string): Promise<boolean> {
        if (token !== "123456") throw new Error("Not authenticated");
        return true; // return userSession;
    }
}
