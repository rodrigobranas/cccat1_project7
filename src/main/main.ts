import RepositoryDatabaseFactory from "../adapter/factory/RepositoryDatabaseFactory";
import HttpServer from "../infra/http/HttpServer";

const repositoryFactory = new RepositoryDatabaseFactory();
HttpServer.start(repositoryFactory);
