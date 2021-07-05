import express from "express";
import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import Router from "./Routes";

export default class HttpServer {

    private constructor () {
    }

    static start (repositoryFactory: RepositoryAbstractFactory) {
        const app = express();
        app.use(express.json());
        app.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type,authentication');
            next();
        });
        app.options("*", function (req, res) {
            res.end();
        });
        app.use(Router.build(repositoryFactory));
        app.listen(3000);
    }
}
