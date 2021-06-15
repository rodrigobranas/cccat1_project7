import ClassroomRepositoryMemory from "./ClassroomRepositoryMemory";
import EnrollmentRepositoryMemory from "./EnrollmentRepositoryMemory";
import EnrollmentRepositoryMemorySingleton from "./EnrollmentRepositoryMemorySingleton";
import LevelRepositoryMemory from "./LevelRepositoryMemory";
import ModuleRepositoryMemory from "./ModuleRepositoryMemory";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";

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
