import Enrollment from "../../../domain/entity/Enrollment";
import EnrollmentRepository from "../../../domain/repository/EnrollmentRepository";

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {
    enrollments: Enrollment[];
    uuid: number;

    constructor () {
        this.enrollments = [];
        this.uuid = Math.floor(Math.random() * 1000);
    }
    get(code: string): Enrollment | undefined {
        const enrollment = this.enrollments.find(enrollment => enrollment.code.value === code);
        return enrollment;
    }

    save(enrollment: Enrollment): void {
        this.enrollments.push(enrollment);
    }
    findAllByClassroom(level: string, module: string, classroom: string) {
        return this.enrollments.filter(enrollment => enrollment.level.code === level && enrollment.module.code === module && enrollment.classroom.code === classroom);
    }
    findByCpf(cpf: string) {
        return this.enrollments.find(enrollment => enrollment.student.cpf.value === cpf);
    }
    count(): number {
        return this.enrollments.length;
    }
}