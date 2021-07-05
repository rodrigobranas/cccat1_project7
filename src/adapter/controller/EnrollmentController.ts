import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import EnrollStudentInputData from "../../domain/usecase/data/EnrollStudentInputData";
import EnrollStudentOutputData from "../../domain/usecase/data/EnrollStudentOutputData";
import GetEnrollmentOutputData from "../../domain/usecase/data/GetEnrollmentOutputData";
import GetEnrollmentsOutputData from "../../domain/usecase/data/GetEnrollmentsOutputData";
import EnrollStudent from "../../domain/usecase/EnrollStudent";
import GetEnrollment from "../../domain/usecase/GetEnrollment";
import GetEnrollments from "../../domain/usecase/GetEnrollments";

export default class EnrollmentController {
    repositoryFactory: RepositoryAbstractFactory;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.repositoryFactory = repositoryFactory;
    }

    async enrollStudent (params: any, body: any): Promise<EnrollStudentOutputData> {
        console.log(params, body, this);
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
        const getEnrollments = new GetEnrollments(this.repositoryFactory);
        const getEnrollmentsOutputData = await getEnrollments.execute();
        return getEnrollmentsOutputData;
    }
}
