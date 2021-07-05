import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import CancelEnrollment from "../../domain/usecase/CancelEnrollment";
import EnrollStudentInputData from "../../domain/usecase/data/EnrollStudentInputData";
import EnrollStudentOutputData from "../../domain/usecase/data/EnrollStudentOutputData";
import GetEnrollmentOutputData from "../../domain/usecase/data/GetEnrollmentOutputData";
import GetEnrollmentsOutputData from "../../domain/usecase/data/GetEnrollmentsOutputData";
import PayInvoiceInputData from "../../domain/usecase/data/PayInvoiceInputData";
import EnrollStudent from "../../domain/usecase/EnrollStudent";
import GetEnrollment from "../../domain/usecase/GetEnrollment";
import GetEnrollments from "../../domain/usecase/GetEnrollments";
import PayInvoice from "../../domain/usecase/PayInvoice";

export default class EnrollmentController {
    repositoryFactory: RepositoryAbstractFactory;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.repositoryFactory = repositoryFactory;
    }

    async enrollStudent (params: any, body: any): Promise<EnrollStudentOutputData> {
        const enrollStudent = new EnrollStudent(this.repositoryFactory);
        const enrollStudentInputData = new EnrollStudentInputData(body);
        const enrollStudentOutputData = await enrollStudent.execute(enrollStudentInputData);
        return enrollStudentOutputData;
    }

    async getEnrollment (params: any, body: any): Promise<GetEnrollmentOutputData> {
        const code = params.code;
        const currentDate = new Date();
        const getEnrollment = new GetEnrollment(this.repositoryFactory);
        const getEnrollmentOutputData = await getEnrollment.execute(code, currentDate);
        return getEnrollmentOutputData;
    }

    async getEnrollments (params: any, body: any): Promise<GetEnrollmentsOutputData[]> {
        const currentDate = new Date();
        const getEnrollments = new GetEnrollments(this.repositoryFactory);
        const getEnrollmentsOutputData = await getEnrollments.execute(currentDate);
        return getEnrollmentsOutputData;
    }

    async cancelEnrollment (params: any, body: any): Promise<void> {
        const cancelEnrollment = new CancelEnrollment(this.repositoryFactory);
        await cancelEnrollment.execute(params.code);
        return;
    }

    async payInvoice (params: any, body: any): Promise<void> {
        const payInvoice = new PayInvoice(this.repositoryFactory);
        const payInvoiceInputData = new PayInvoiceInputData(body);
        await payInvoice.execute(payInvoiceInputData);
        return;
    }
}
