import Enrollment from "../entity/Enrollment";

export default interface EnrollmentRepository {
    save(enrollment: Enrollment): Promise<void>;
    update(enrollment: Enrollment): Promise<void>;
    findAllByClassroom(level: string, module: string, classroom: string): Promise<Enrollment[]>;
    findByCpf(cpf: string): Promise<Enrollment | undefined>;
    get(code: string): Promise<Enrollment>;
    getAll(): Promise<Enrollment[]>;
    count(): Promise<number>;
}
