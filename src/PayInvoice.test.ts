import EnrollStudent from "./EnrollStudent";
import EnrollStudentInputData from "./EnrollStudentInputData";
import GetEnrollment from "./GetEnrollment";
import PayInvoice from "./PayInvoice";
import RepositoryMemoryFactory from "./RepositoryMemoryFactory";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;

beforeEach(function () {
    const repositoryMemoryFactory = new RepositoryMemoryFactory()
    enrollStudent = new EnrollStudent(repositoryMemoryFactory);
    getEnrollment = new GetEnrollment(repositoryMemoryFactory);
    payInvoice = new PayInvoice(repositoryMemoryFactory);
});

test.only("Should pay enrollment invoice", function () {
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

    payInvoice.execute("2021EM1A0001", 1, 2021, 1416.66);

    const getEnrollmentOutputData = getEnrollment.execute("2021EM1A0001");
    expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
    expect(getEnrollmentOutputData.balance).toBe(15583.33);
});
