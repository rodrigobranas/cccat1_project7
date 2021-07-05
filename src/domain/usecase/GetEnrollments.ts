import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../repository/EnrollmentRepository";
import GetEnrollmentsOutputData from "./data/GetEnrollmentsOutputData";

export default class GetEnrollments {
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    async execute (currentDate: Date): Promise<GetEnrollmentsOutputData[]> {
        const enrollments = await this.enrollmentRepository.getAll();
        const enrollmentsOutputData = [];
        for (const enrollment of enrollments) {
            const balance = enrollment.getInvoiceBalance();
            const getEnrollmentsOutputData = new GetEnrollmentsOutputData({
                studentName: enrollment.student.name.value,
                studentCpf: enrollment.student.cpf.value,
                studentBirthDate: enrollment.student.birthDate.toISOString(),
                levelDescription: enrollment.level.description,
                moduleDescription: enrollment.module.description,
                classroomCode: enrollment.classroom.code,
                code: enrollment.code.value,
                balance,
                status: enrollment.status
            });
            for (const invoice of enrollment.invoices) {
                getEnrollmentsOutputData.invoices.push({
                    month: invoice.month,
                    year: invoice.year,
                    amount: invoice.amount,
                    status: invoice.getStatus(currentDate),
                    dueDate: invoice.dueDate,
                    penalty: invoice.getPenalty(currentDate),
                    interests: invoice.getInterests(currentDate),
                    balance: invoice.getBalance()
                });
            }
            enrollmentsOutputData.push(getEnrollmentsOutputData);
        }
        return enrollmentsOutputData;
    }
}
