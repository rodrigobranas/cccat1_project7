import RepositoryDatabaseFactory from "../adapter/factory/RepositoryDatabaseFactory";
import EnrollmentRepositoryDatabase from "../adapter/repository/database/EnrollmentRepositoryDatabase";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import EnrollStudent from "../domain/usecase/EnrollStudent";
import GetEnrollment from "../domain/usecase/GetEnrollment";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;

describe("Get Enrollment Test", function () {
    beforeEach(function () {
        // enrollStudent = new EnrollStudent(new RepositoryMemoryFactory());
        // alterar aqui para ativar o banco de dados (não se esqueça de rodar o arquivo create.sql)
        const repositoryDatabaseFactory = new RepositoryDatabaseFactory();
        enrollStudent = new EnrollStudent(repositoryDatabaseFactory);
        getEnrollment = new GetEnrollment(repositoryDatabaseFactory);
    });
    
    test("Should get enrollment with balance", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        });
        await enrollStudent.execute(enrollmentRequest);
        const getEnrollmentOutputData = await getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
        expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
        expect(getEnrollmentOutputData.balance).toBe(16999.99);
    });
    
    test("Should calculate due date and return status open or overdue for each invoice", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        });
        await enrollStudent.execute(enrollmentRequest);
        const getEnrollmentOutputData = await getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
        expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
        expect(getEnrollmentOutputData.invoices[0].dueDate.toISOString()).toBe("2021-01-05T03:00:00.000Z");
        expect(getEnrollmentOutputData.invoices[0].status).toBe("overdue");
        expect(getEnrollmentOutputData.invoices[11].dueDate.toISOString()).toBe("2021-12-05T03:00:00.000Z");
        expect(getEnrollmentOutputData.invoices[11].status).toBe("open");
    });
    
    test("Should calculate penalty and interests", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        });
        await enrollStudent.execute(enrollmentRequest);
        const getEnrollmentOutputData = await getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
        expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
        expect(getEnrollmentOutputData.invoices[0].penalty).toBe(141.67);
        expect(getEnrollmentOutputData.invoices[0].interests).toBe(2337.49);
        expect(getEnrollmentOutputData.invoices[11].penalty).toBe(0);
        expect(getEnrollmentOutputData.invoices[11].interests).toBe(0);
    });
    
    afterEach(async function () {
        const enrollmentRepository = new EnrollmentRepositoryDatabase();
        await enrollmentRepository.clean();
    });
});
