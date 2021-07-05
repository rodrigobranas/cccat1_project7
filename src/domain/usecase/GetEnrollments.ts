import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../repository/EnrollmentRepository";
import GetEnrollmentsOutputData from "./data/GetEnrollmentsOutputData";

export default class GetEnrollments {
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    async execute (): Promise<GetEnrollmentsOutputData[]> {
        const enrollments = await this.enrollmentRepository.getAll();
        const enrollmentsOutputData = [];
        for (const enrollment of enrollments) {
            const balance = enrollment.getInvoiceBalance();
            const getEnrollmentsOutputData = new GetEnrollmentsOutputData({
                code: enrollment.code.value,
                balance,
                status: enrollment.status
            });
            enrollmentsOutputData.push(getEnrollmentsOutputData);
        }
        return enrollmentsOutputData;
    }
}
