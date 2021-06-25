import RepositoryMemoryFactory from "../adapter/factory/RepositoryMemoryFactory";
import EnrollStudent from "../domain/usecase/EnrollStudent";
import EnrollStudentInputData from "../domain/usecase/EnrollStudentInputData";

let enrollStudent: EnrollStudent;

beforeEach(function () {
    enrollStudent = new EnrollStudent(new RepositoryMemoryFactory());
});

test("Should not enroll without valid student name", function () {
    const enrollmentRequest = new EnrollStudentInputData({
        studentName: "Ana",
        studentCpf: "864.464.227-84",
        studentBirthDate: "2002-10-10",
        level: "EM",
        module: "1",
        classroom: "A",
        installments: 12
    });
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid name"));  
});

test("Should not enroll without valid student cpf", function () {
    const enrollmentRequest = new EnrollStudentInputData({
        studentName: "Ana Maria",
        studentCpf: "213.345.654-10",
        studentBirthDate: "2002-10-10",
        level: "EM",
        module: "1",
        classroom: "A",
        installments: 12
    });
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid cpf"));
});

test("Should not enroll duplicated student", function () {
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
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Enrollment with duplicated student is not allowed"));
});

test("Should generate enrollment code", function () {
    const enrollmentRequest = new EnrollStudentInputData({
        studentName: "Ana Maria",
        studentCpf: "864.464.227-84",
        studentBirthDate: "2002-10-10",
        level: "EM",
        module: "1",
        classroom: "A",
        installments: 12
    });
    const enrollment = enrollStudent.execute(enrollmentRequest);
    expect(enrollment.code).toBe("2021EM1A0001");
});

test("Should not enroll student below minimum age", function () {
    const enrollmentRequest = new EnrollStudentInputData({
        studentName: "Ana Maria",
        studentCpf: "864.464.227-84",
        studentBirthDate: "2014-03-12",
        level: "EM",
        module: "1",
        classroom: "A",
        installments: 12
    });
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Student below minimum age"));
});

test("Should not enroll student over classroom capacity", function () {
    enrollStudent.execute(new EnrollStudentInputData({
        studentName: "Ana Maria",
        studentCpf: "864.464.227-84",
        studentBirthDate: "2002-10-10",
        level: "EM",
        module: "1",
        classroom: "A",
        installments: 12
    }));
    enrollStudent.execute(new EnrollStudentInputData({
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
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Classroom is over capacity"));
});

test("Should not enroll after the end of classes", function () {
    const enrollmentRequest = new EnrollStudentInputData({
        studentName: "Ana Maria",
        studentCpf: "864.464.227-84",
        studentBirthDate: "2002-10-10",
        level: "EM",
        module: "1",
        classroom: "B",
        installments: 12
    });
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Class is already finished"));
});

test("Should not enroll after 25% of the start of the class", function () {
    const enrollmentRequest = new EnrollStudentInputData({
        studentName: "Ana Maria",
        studentCpf: "864.464.227-84",
        studentBirthDate: "2002-10-10",
        level: "EM",
        module: "1",
        classroom: "C",
        installments: 12
    });
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Class is already started"));
});

test("Should generate invoices", function () {
    const enrollmentRequest = new EnrollStudentInputData({
        studentName: "Ana Maria",
        studentCpf: "864.464.227-84",
        studentBirthDate: "2002-10-10",
        level: "EM",
        module: "1",
        classroom: "A",
        installments: 12
    });
    const enrollment = enrollStudent.execute(enrollmentRequest);
    expect(enrollment.invoices).toHaveLength(12);
    expect(enrollment.invoices[0].amount).toBe(1416.66);
    expect(enrollment.invoices[11].amount).toBe(1416.73);
});
