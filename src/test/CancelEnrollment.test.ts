import RepositoryMemoryFactory from "../adapter/factory/RepositoryMemoryFactory";
import CancelEnrollment from "../domain/usecase/CancelEnrollment";
import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import GetEnrollment from "../domain/usecase/GetEnrollment";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let cancelEnrollment: CancelEnrollment;

beforeEach(function () {
    const repositoryMemoryFactory = new RepositoryMemoryFactory()
    enrollStudent = new EnrollStudent(repositoryMemoryFactory);
    getEnrollment = new GetEnrollment(repositoryMemoryFactory);
    cancelEnrollment = new CancelEnrollment(repositoryMemoryFactory);
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
