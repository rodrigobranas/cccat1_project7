import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import ClassroomRepositoryMemory from "../repository/memory/ClassroomRepositoryMemory";
import EnrollmentRepositoryMemorySingleton from "../repository/memory/EnrollmentRepositoryMemorySingleton";
import LevelRepositoryMemory from "../repository/memory/LevelRepositoryMemory";
import ModuleRepositoryMemory from "../repository/memory/ModuleRepositoryMemory";

export default class RepositoryMemoryFactory implements RepositoryAbstractFactory {

    constructor () {
        EnrollmentRepositoryMemorySingleton.destroy();
    }

    createLevelRepository () {
        return new LevelRepositoryMemory();
    }

    createModuleRepository () {
        return new ModuleRepositoryMemory();
    }

    createClassroomRepository () {
        return new ClassroomRepositoryMemory();
    }

    createEnrollmentRepository () {
        return EnrollmentRepositoryMemorySingleton.getInstance();
    }
}
