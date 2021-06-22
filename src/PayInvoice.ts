import EnrollmentRepository from "./EnrollmentRepository";
import PayInvoiceInputData from "./PayInvoiceInputData";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";

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
