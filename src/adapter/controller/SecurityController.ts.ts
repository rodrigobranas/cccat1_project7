import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import IsAuthenticated from "../../domain/usecase/IsAuthenticated";
import IsAuthorized from "../../domain/usecase/IsAuthorized";

export default class SecurityController {
    repositoryFactory: RepositoryAbstractFactory;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.repositoryFactory = repositoryFactory;
    }

    async isAuthenticated (params: any, body: any, headers: any): Promise<boolean> {
        const token = headers.authentication;
        const isAuthenticated = new IsAuthenticated(this.repositoryFactory);
        return isAuthenticated.execute(token);
    }

    async isAuthorized (params: any, body: any, headers: any): Promise<boolean> {
        const token = headers.authentication;
        const isAuthenticated = new IsAuthorized(this.repositoryFactory);
        return isAuthenticated.execute(token);
    }
}
