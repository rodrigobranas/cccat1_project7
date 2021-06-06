import Enrollment from "./Enrollment";

export default interface EnrollmentRepository {
    save(enrollment: Enrollment): void;
    findAllByClassroom(level: string, module: string, classroom: string): any;
    findByCpf(cpf: string): any;
    count(): number;
}
