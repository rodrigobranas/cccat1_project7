import ClassroomRepository from "./ClassroomRepository";
import Enrollment from "./Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";
import EnrollStudentInputData from "./EnrollStudentInputData";
import EnrollStudentOutputData from "./EnrollStudentOutputData";
import LevelRepository from "./LevelRepository";
import ModuleRepository from "./ModuleRepository";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";
import Student from "./Student";

export default class GetEnrollment {
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    execute (code: string): any {
        const enrollment = this.enrollmentRepository.get(code);
        const balance = enrollment?.getInvoiceBalance();
        return {
            code: enrollment?.code.value,
            balance
        }
    }
}
