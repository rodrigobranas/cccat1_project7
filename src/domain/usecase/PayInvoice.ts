import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../repository/EnrollmentRepository";
import PayInvoiceInputData from "./PayInvoiceInputData";

export default class PayInvoice {
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    execute (payInvoiceInputData: PayInvoiceInputData): any {
        const enrollment = this.enrollmentRepository.get(payInvoiceInputData.code);
        if (!enrollment) throw new Error("Enrollment not found");
        enrollment.payInvoice(payInvoiceInputData.month, payInvoiceInputData.year, payInvoiceInputData.amount, payInvoiceInputData.paymentDate);
    }
}
