import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import ClassroomRepositoryDatabase from "../repository/database/ClassroomRepositoryDatabase";
import EnrollmentRepositoryDatabase from "../repository/database/EnrollmentRepositoryDatabase";
import LevelRepositoryDatabase from "../repository/database/LevelRepositoryDatabase";
import ModuleRepositoryDatabase from "../repository/database/ModuleRepositoryDatabase";
import EnrollmentRepositoryMemorySingleton from "../repository/memory/EnrollmentRepositoryMemorySingleton";

export default class RepositoryDatabaseFactory implements RepositoryAbstractFactory {

    constructor () {
    }

    createLevelRepository () {
        return new LevelRepositoryDatabase();
    }

    createModuleRepository () {
        return new ModuleRepositoryDatabase();
    }

    createClassroomRepository () {
        return new ClassroomRepositoryDatabase();
    }

    createEnrollmentRepository () {
        return new EnrollmentRepositoryDatabase();
    }
}
