import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../repository/EnrollmentRepository";

export default class CancelEnrollment {
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    async execute (code: string): Promise<void> {
        const enrollment = await this.enrollmentRepository.get(code);
        if (!enrollment) throw new Error("Enrollment not found");
        enrollment.status = "cancelled";
        await this.enrollmentRepository.update(enrollment);
    }
}
