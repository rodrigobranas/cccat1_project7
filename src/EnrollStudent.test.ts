import EnrollStudent from "./EnrollStudent";

test("Should not enroll without valid student name", function () {
    const enrollStudent = new EnrollStudent();
    const enrollmentRequest = {
        student: {
            name: "Ana"
        }
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid name"));  
});

test("Should not enroll without valid student cpf", function () {
    const enrollStudent = new EnrollStudent();
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "213.345.654-10"
        }
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid cpf"));  
});

test("Should not enroll duplicated student", function () {
    const enrollStudent = new EnrollStudent();
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84"
        }
    };
    enrollStudent.execute(enrollmentRequest);
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Enrollment with duplicated student is not allowed"));
});
