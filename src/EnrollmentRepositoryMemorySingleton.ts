import EnrollmentRepository from "./EnrollmentRepository";
import EnrollmentRepositoryMemory from "./EnrollmentRepositoryMemory";

export default class EnrollmentRepositoryMemorySingleton {
    static instance: EnrollmentRepository | undefined;

    private constructor () {
    }

    static getInstance (): EnrollmentRepository {
        if (!EnrollmentRepositoryMemorySingleton.instance) {
            EnrollmentRepositoryMemorySingleton.instance = new EnrollmentRepositoryMemory();
        }
        return EnrollmentRepositoryMemorySingleton.instance;
    }

    static destroy () {
        EnrollmentRepositoryMemorySingleton.instance = undefined;
    }
}
