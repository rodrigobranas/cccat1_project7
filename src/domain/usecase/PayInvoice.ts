import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../repository/EnrollmentRepository";
import PayInvoiceInputData from "./data/PayInvoiceInputData";

export default class PayInvoice {
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    async execute (payInvoiceInputData: PayInvoiceInputData): Promise<void> {
        const enrollment = await this.enrollmentRepository.get(payInvoiceInputData.code);
        if (!enrollment) throw new Error("Enrollment not found");
        enrollment.payInvoice(payInvoiceInputData.month, payInvoiceInputData.year, payInvoiceInputData.amount, payInvoiceInputData.paymentDate);
        await this.enrollmentRepository.update(enrollment);
    }
}
