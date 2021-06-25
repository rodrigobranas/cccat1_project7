import RepositoryMemoryFactory from "../adapter/factory/RepositoryMemoryFactory";
import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/EnrollStudentInputData";
import GetEnrollment from "../domain/usecase/GetEnrollment";
import PayInvoice from "../domain/usecase/PayInvoice";
import PayInvoiceInputData from "../domain/usecase/PayInvoiceInputData";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;

beforeEach(function () {
    const repositoryMemoryFactory = new RepositoryMemoryFactory()
    enrollStudent = new EnrollStudent(repositoryMemoryFactory);
    getEnrollment = new GetEnrollment(repositoryMemoryFactory);
    payInvoice = new PayInvoice(repositoryMemoryFactory);
});

test("Should pay enrollment invoice", function () {
    const enrollmentRequest = new EnrollStudentInputData({
        studentName: "Ana Maria",
        studentCpf: "864.464.227-84",
        studentBirthDate: "2002-10-10",
        level: "EM",
        module: "1",
        classroom: "A",
        installments: 12
    });
    enrollStudent.execute(enrollmentRequest);
    payInvoice.execute(new PayInvoiceInputData({
        code: "2021EM1A0001", 
        month: 7, 
        year: 2021, 
        amount: 1416.66,
        paymentDate: new Date("2021-06-20")
    }));
    const getEnrollmentOutputData = getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
    expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
    expect(getEnrollmentOutputData.balance).toBe(15583.33);
});

test("Should pay overdue invoice", function () {
    const enrollmentRequest = new EnrollStudentInputData({
        studentName: "Ana Maria",
        studentCpf: "864.464.227-84",
        studentBirthDate: "2002-10-10",
        level: "EM",
        module: "1",
        classroom: "A",
        installments: 12
    });
    enrollStudent.execute(enrollmentRequest);
    const getEnrollmentOutputDataBefore = getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
    payInvoice.execute(new PayInvoiceInputData({
        code: "2021EM1A0001", 
        month: 1, 
        year: 2021, 
        amount: 3895.82,
        paymentDate: new Date("2021-06-20")
    }));
    const getEnrollmentOutputDataAfter = getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
    expect(getEnrollmentOutputDataAfter.code).toBe("2021EM1A0001");
    expect(getEnrollmentOutputDataAfter.invoices[0].balance).toBe(0);
});
