import ClassroomRepository from "./ClassroomRepository";
import Enrollment from "./Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";
import LevelRepository from "./LevelRepository";
import ModuleRepository from "./ModuleRepository";
import Student from "./Student";

export default class EnrollStudent {
    levelRepository: LevelRepository;
    moduleRepository: ModuleRepository;
    classroomRepository: ClassroomRepository;
    enrollmentRepository: EnrollmentRepository;

    constructor (levelRepository: LevelRepository, moduleRepository: ModuleRepository, classRepository: ClassroomRepository, enrollmentRepository: EnrollmentRepository) {
        this.levelRepository = levelRepository;
        this.moduleRepository = moduleRepository;
        this.classroomRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
    }
    
    execute (enrollmentRequest: any) {
        const student = new Student(enrollmentRequest.student.name, enrollmentRequest.student.cpf, enrollmentRequest.student.birthDate);
        const level = this.levelRepository.findByCode(enrollmentRequest.level);
        const module = this.moduleRepository.findByCode(enrollmentRequest.level, enrollmentRequest.module);
        const classroom = this.classroomRepository.findByCode(enrollmentRequest.classroom);
        const studentsEnrolledInClassroom = this.enrollmentRepository.findAllByClassroom(level.code, module.code, classroom.code);
        if (studentsEnrolledInClassroom.length === classroom.capacity) throw new Error("Classroom is over capacity");
        const existingEnrollment = this.enrollmentRepository.findByCpf(enrollmentRequest.student.cpf);
        if (existingEnrollment) throw new Error("Enrollment with duplicated student is not allowed");
        const enrollmentSequence = this.enrollmentRepository.count() + 1;
        const issueDate = new Date();
        const enrollment = new Enrollment(student, level, module, classroom, issueDate, enrollmentSequence, enrollmentRequest.installments);
        this.enrollmentRepository.save(enrollment);
        return enrollment;
    }
}
