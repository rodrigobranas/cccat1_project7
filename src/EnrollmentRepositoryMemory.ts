import Enrollment from "./Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {
    enrollments: Enrollment[];

    constructor () {
        this.enrollments = [];
    }

    save(enrollment: Enrollment): void {
        this.enrollments.push(enrollment);
    }
    findAllByClassroom(level: string, module: string, classroom: string) {
        return this.enrollments.filter(enrollment => enrollment.level === level && enrollment.module === module && enrollment.classroom === classroom);
    }
    findByCpf(cpf: string) {
        return this.enrollments.find(enrollment => enrollment.student.cpf.value === cpf);
    }
    count(): number {
        return this.enrollments.length;
    }
}