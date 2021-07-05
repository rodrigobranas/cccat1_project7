import express from "express";
import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import Router from "./Routes";

export default class HttpServer {

    private constructor () {
    }

    static start (repositoryFactory: RepositoryAbstractFactory) {
        const app = express();
        app.use(express.json());
        app.use(Router.build(repositoryFactory));
        app.listen(3000);
    }
}
