import ClassroomRepositoryMemory from "./ClassroomRepositoryMemory";
import EnrollmentRepositoryMemory from "./EnrollmentRepositoryMemory";
import EnrollStudent from "./EnrollStudent";
import LevelRepositoryMemory from "./LevelRepositoryMemory";
import ModuleRepositoryMemory from "./ModuleRepositoryMemory";

let enrollStudent: EnrollStudent;

beforeEach(function () {
    const enrollmentRepository = new EnrollmentRepositoryMemory();
    const levelRepository = new LevelRepositoryMemory();
    const moduleRepository = new ModuleRepositoryMemory();
    const classroomRepository = new ClassroomRepositoryMemory();
    enrollStudent = new EnrollStudent(levelRepository, moduleRepository, classroomRepository, enrollmentRepository);
});

test("Should not enroll without valid student name", function () {
    const enrollmentRequest = {
        student: {
            name: "Ana"
        },
        level: "EM",
        module: "1",
        classroom: "A"
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid name"));  
});

test("Should not enroll without valid student cpf", function () {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "213.345.654-10"
        },
        level: "EM",
        module: "1",
        classroom: "A"
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid cpf"));  
});

test("Should not enroll duplicated student", function () {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84"
        },
        level: "EM",
        module: "1",
        classroom: "A"
    };
    enrollStudent.execute(enrollmentRequest);
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Enrollment with duplicated student is not allowed"));
});

test("Should generate enrollment code", function () {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84"
        },
        level: "EM",
        module: "1",
        classroom: "A"
    };
    const enrollment = enrollStudent.execute(enrollmentRequest);
    expect(enrollment.code).toBe("2021EM1A0001");
});

test("Should not enroll student below minimum age", function () {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84",
            birthDate: "2014-03-12"
        },
        level: "EM",
        module: "1",
        classroom: "A"
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Student below minimum age"));
});

test("Should not enroll student over classroom capacity", function () {
    enrollStudent.execute({
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84"
        },
        level: "EM",
        module: "1",
        classroom: "A"
    });
    enrollStudent.execute({
        student: {
            name: "Ana Maria",
            cpf: "240.826.286-06"
        },
        level: "EM",
        module: "1",
        classroom: "A"
    });
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "670.723.738-10"
        },
        level: "EM",
        module: "1",
        classroom: "A"
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Classroom is over capacity"));
});
