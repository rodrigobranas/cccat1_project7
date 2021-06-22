import EnrollStudent from "./EnrollStudent";
import EnrollStudentInputData from "./EnrollStudentInputData";
import GetEnrollment from "./GetEnrollment";
import RepositoryMemoryFactory from "./RepositoryMemoryFactory";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;

beforeEach(function () {
    const repositoryMemoryFactory = new RepositoryMemoryFactory()
    enrollStudent = new EnrollStudent(repositoryMemoryFactory);
    getEnrollment = new GetEnrollment(repositoryMemoryFactory);
});

test("Should get enrollment with balance", function () {
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
    const getEnrollmentOutputData = getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
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
    const getEnrollmentOutputData = getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
    expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
    expect(getEnrollmentOutputData.invoices[0].dueDate.toISOString()).toBe("2021-01-05T03:00:00.000Z");
    expect(getEnrollmentOutputData.invoices[0].status).toBe("overdue");
    expect(getEnrollmentOutputData.invoices[11].dueDate.toISOString()).toBe("2021-12-05T03:00:00.000Z");
    expect(getEnrollmentOutputData.invoices[11].status).toBe("open");
});

test("Should calculate penalty and interests", function () {
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
    const getEnrollmentOutputData = getEnrollment.execute("2021EM1A0001", new Date("2021-06-20"));
    expect(getEnrollmentOutputData.code).toBe("2021EM1A0001");
    expect(getEnrollmentOutputData.invoices[0].penalty).toBe(141.67);
    expect(getEnrollmentOutputData.invoices[0].interests).toBe(2337.49);
    expect(getEnrollmentOutputData.invoices[11].penalty).toBe(0);
    expect(getEnrollmentOutputData.invoices[11].interests).toBe(0);
});
