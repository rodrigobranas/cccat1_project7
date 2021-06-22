import ClassroomRepository from "./ClassroomRepository";
import Enrollment from "./Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";
import EnrollStudentInputData from "./EnrollStudentInputData";
import EnrollStudentOutputData from "./EnrollStudentOutputData";
import LevelRepository from "./LevelRepository";
import ModuleRepository from "./ModuleRepository";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";
import Student from "./Student";

export default class CancelEnrollment {
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    execute (code: string): void {
        const enrollment = this.enrollmentRepository.get(code);
        if (!enrollment) throw new Error("Enrollment not found");
        enrollment.status = "cancelled";
    }
}
