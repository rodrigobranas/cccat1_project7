import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../repository/EnrollmentRepository";
import GetEnrollmentOutputData from "./GetEnrollmentOutputData";

export default class GetEnrollment {
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    execute (code: string, currentDate: Date): GetEnrollmentOutputData {
        const enrollment = this.enrollmentRepository.get(code);
        if (!enrollment) throw new Error("Enrollment not found");
        const balance = enrollment?.getInvoiceBalance();
        const getEnrollmentOutputData = new GetEnrollmentOutputData({
            code: enrollment.code.value,
            balance,
            status: enrollment.status,
            invoices: []
        });
        for (const invoice of enrollment.invoices) {
            getEnrollmentOutputData.invoices.push({
                amount: invoice.amount,
                status: invoice.getStatus(currentDate),
                dueDate: invoice.dueDate,
                penalty: invoice.getPenalty(currentDate),
                interests: invoice.getInterests(currentDate),
                balance: invoice.getBalance()
            });
        }
        return getEnrollmentOutputData;
    }
}
