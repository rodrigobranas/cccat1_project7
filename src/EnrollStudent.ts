import Student from "./Student";

export default class EnrollStudent {
    enrollments: any[];

    constructor () {
        this.enrollments = [];
    }
    
    execute (enrollmentRequest: any) {
        const student = new Student(enrollmentRequest.student.name, enrollmentRequest.student.cpf);
        const existingEnrollment = this.enrollments.find(enrollment => enrollment.student.cpf.value === enrollmentRequest.student.cpf);
        if (existingEnrollment) throw new Error("Enrollment with duplicated student is not allowed");
        const enrollment = {
            student
        };
        this.enrollments.push(enrollment);
        return enrollment;
    }
}
