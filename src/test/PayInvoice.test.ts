import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import EnrollStudent from "../domain/usecase/EnrollStudent";
import GetEnrollment from "../domain/usecase/GetEnrollment";
import PayInvoice from "../domain/usecase/PayInvoice";
import PayInvoiceInputData from "../domain/usecase/data/PayInvoiceInputData";
import RepositoryDatabaseFactory from "../adapter/factory/RepositoryDatabaseFactory";
import EnrollmentRepositoryDatabase from "../adapter/repository/database/EnrollmentRepositoryDatabase";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;

describe("Pay Invoice Test", function () {
    beforeEach(function () {
        // enrollStudent = new EnrollStudent(new RepositoryMemoryFactory());
        // alterar aqui para ativar o banco de dados (não se esqueça de rodar o arquivo create.sql)
        const repositoryDatabaseFactory = new RepositoryDatabaseFactory();
        enrollStudent = new EnrollStudent(repositoryDatabaseFactory);
        getEnrollment = new GetEnrollment(repositoryDatabaseFactory);
        payInvoice = new PayInvoice(repositoryDatabaseFactory);
    });
    
    test("Should pay enrollment invoice", async function () {
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
        await payInvoice.execute(new PayInvoiceInputData({
            code: "2021EM1A0001", 
            month: 7, 
            year: 2021, 
            amount: 1416.66,
            paymentDate: new Date("2021-06-20")
        }));
        const getEnrollmentOutputData = await getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
        expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
        expect(getEnrollmentOutputData.balance).toBe(15583.33);
    });
    
    test("Should pay overdue invoice", async function () {
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
        const getEnrollmentOutputDataBefore = await getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
        await payInvoice.execute(new PayInvoiceInputData({
            code: "2021EM1A0001", 
            month: 1, 
            year: 2021, 
            amount: 3895.82,
            paymentDate: new Date("2021-06-20")
        }));
        const getEnrollmentOutputDataAfter = await getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
        expect(getEnrollmentOutputDataAfter.code).toBe("2021EM1A0001");
        expect(getEnrollmentOutputDataAfter.invoices[0].balance).toBe(0);
    });
    
    afterEach(async function () {
        const enrollmentRepository = new EnrollmentRepositoryDatabase();
        await enrollmentRepository.clean();
    });
});
