import Enrollment from "../../../domain/entity/Enrollment";
import EnrollmentRepository from "../../../domain/repository/EnrollmentRepository";

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {
    enrollments: Enrollment[];
    uuid: number;

    constructor () {
        this.enrollments = [];
        this.uuid = Math.floor(Math.random() * 1000);
    }
    getAll(): Promise<Enrollment[]> {
        return Promise.resolve(this.enrollments);
    }

    async get(code: string): Promise<Enrollment> {
        const enrollment = this.enrollments.find(enrollment => enrollment.code.value === code);
        if (!enrollment) throw new Error("Enrollment not found");
        return Promise.resolve(enrollment);
    }

    async save(enrollment: Enrollment): Promise<void> {
        this.enrollments.push(enrollment);
    }

    async update(enrollment: Enrollment): Promise<void> {
        const position = this.enrollments.indexOf(enrollment);
        this.enrollments.splice(position, 1, enrollment);
    }

    async findAllByClassroom(level: string, module: string, classroom: string) {
        const enrollments = this.enrollments.filter(enrollment => enrollment.level.code === level && enrollment.module.code === module && enrollment.classroom.code === classroom);
        return Promise.resolve(enrollments);
    }

    async findByCpf(cpf: string) {
        const enrollment = this.enrollments.find(enrollment => enrollment.student.cpf.value === cpf);
        return Promise.resolve(enrollment);
    }
    
    async count(): Promise<number> {
        const count = this.enrollments.length;
        return Promise.resolve(count);
    }
}
