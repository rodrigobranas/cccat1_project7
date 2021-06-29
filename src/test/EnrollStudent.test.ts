import RepositoryDatabaseFactory from "../adapter/factory/RepositoryDatabaseFactory";
import EnrollmentRepositoryDatabase from "../adapter/repository/database/EnrollmentRepositoryDatabase";
import EnrollStudentInputData from "../domain/usecase/data/EnrollStudentInputData";
import EnrollStudent from "../domain/usecase/EnrollStudent";

let enrollStudent: EnrollStudent;

describe("Enroll Student Test", function () {
    beforeEach(function () {
        // enrollStudent = new EnrollStudent(new RepositoryMemoryFactory());
        // alterar aqui para ativar o banco de dados (não se esqueça de rodar o arquivo create.sql)
        enrollStudent = new EnrollStudent(new RepositoryDatabaseFactory());
    });
    
    test("Should not enroll without valid student name", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        });
        await expect(() => enrollStudent.execute(enrollmentRequest)).rejects.toThrow(new Error("Invalid name"));  
    });
    
    test("Should not enroll without valid student cpf", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "213.345.654-10",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        });
        await expect(() => enrollStudent.execute(enrollmentRequest)).rejects.toThrow(new Error("Invalid cpf"));
    });
    
    test("Should not enroll duplicated student", async function () {
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
        await expect(() => enrollStudent.execute(enrollmentRequest)).rejects.toThrow(new Error("Enrollment with duplicated student is not allowed"));
    });
    
    test("Should generate enrollment code", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        });
        const enrollment = await enrollStudent.execute(enrollmentRequest);
        expect(enrollment.code).toBe("2021EM1A0001");
    });
    
    test("Should not enroll student below minimum age", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2014-03-12",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        });
        await expect(() => enrollStudent.execute(enrollmentRequest)).rejects.toThrow(new Error("Student below minimum age"));
    });
    
    test("Should not enroll student over classroom capacity", async function () {
        await enrollStudent.execute(new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        }));
        await enrollStudent.execute(new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "240.826.286-06",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        }));
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "670.723.738-10",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        });
        await expect(() => enrollStudent.execute(enrollmentRequest)).rejects.toThrow(new Error("Classroom is over capacity"));
    });
    
    test("Should not enroll after the end of classes", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "B",
            installments: 12
        });
        await expect(() => enrollStudent.execute(enrollmentRequest)).rejects.toThrow(new Error("Class is already finished"));
    });
    
    test("Should not enroll after 25% of the start of the class", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "C",
            installments: 12
        });
        await expect(() => enrollStudent.execute(enrollmentRequest)).rejects.toThrow(new Error("Class is already started"));
    });
    
    test("Should generate invoices", async function () {
        const enrollmentRequest = new EnrollStudentInputData({
            studentName: "Ana Maria",
            studentCpf: "864.464.227-84",
            studentBirthDate: "2002-10-10",
            level: "EM",
            module: "1",
            classroom: "A",
            installments: 12
        });
        const enrollment = await enrollStudent.execute(enrollmentRequest);
        expect(enrollment.invoices).toHaveLength(12);
        expect(enrollment.invoices[0].amount).toBe(1416.66);
        expect(enrollment.invoices[11].amount).toBe(1416.73);
    });
    
    afterEach(async function () {
        const enrollmentRepository = new EnrollmentRepositoryDatabase();
        await enrollmentRepository.clean();
    });
});
