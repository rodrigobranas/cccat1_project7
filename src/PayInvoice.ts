import EnrollmentRepository from "./EnrollmentRepository";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";

export default class PayInvoice {
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    execute (code: string, month: number, year: number, amount: number): any {
        const enrollment = this.enrollmentRepository.get(code);
        if (!enrollment) throw new Error("Enrollment not found");
        enrollment.payInvoice(month, year, amount);
    }
}
