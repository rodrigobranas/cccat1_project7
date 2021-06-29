import CancelEnrollment from "../domain/usecase/CancelEnrollment";
import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import GetEnrollment from "../domain/usecase/GetEnrollment";
import RepositoryDatabaseFactory from "../adapter/factory/RepositoryDatabaseFactory";
import EnrollmentRepositoryDatabase from "../adapter/repository/database/EnrollmentRepositoryDatabase";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let cancelEnrollment: CancelEnrollment;

describe("Cancel Enrollment Test", function () {
    beforeEach(function () {
        // enrollStudent = new EnrollStudent(new RepositoryMemoryFactory());
        // alterar aqui para ativar o banco de dados (não se esqueça de rodar o arquivo create.sql)
        const repositoryDatabaseFactory = new RepositoryDatabaseFactory();
        enrollStudent = new EnrollStudent(repositoryDatabaseFactory);
        getEnrollment = new GetEnrollment(repositoryDatabaseFactory);
        cancelEnrollment = new CancelEnrollment(repositoryDatabaseFactory);
    });
    
    test("Should cancel enrollment", async function () {
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
        await cancelEnrollment.execute("2021EM1A0001");
        const getEnrollmentOutputData = await getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
        expect(getEnrollmentOutputData.status).toBe("cancelled");
    });

    afterEach(async function () {
        const enrollmentRepository = new EnrollmentRepositoryDatabase();
        await enrollmentRepository.clean();
    });
});
