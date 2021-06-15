import ClassroomRepository from "./ClassroomRepository";
import Enrollment from "./Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";
import EnrollStudentInputData from "./EnrollStudentInputData";
import EnrollStudentOutputData from "./EnrollStudentOutputData";
import LevelRepository from "./LevelRepository";
import ModuleRepository from "./ModuleRepository";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";
import Student from "./Student";

export default class EnrollStudent {
    levelRepository: LevelRepository;
    moduleRepository: ModuleRepository;
    classroomRepository: ClassroomRepository;
    enrollmentRepository: EnrollmentRepository;

    constructor (repositoryFactory: RepositoryAbstractFactory) {
        this.levelRepository = repositoryFactory.createLevelRepository();
        this.moduleRepository = repositoryFactory.createModuleRepository();
        this.classroomRepository = repositoryFactory.createClassroomRepository();
        this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    }
    
    execute (enrollStudentInputData: EnrollStudentInputData): EnrollStudentOutputData {
        const student = new Student(enrollStudentInputData.studentName, enrollStudentInputData.studentCpf, enrollStudentInputData.studentBirthDate);
        const level = this.levelRepository.findByCode(enrollStudentInputData.level);
        const module = this.moduleRepository.findByCode(enrollStudentInputData.level, enrollStudentInputData.module);
        const classroom = this.classroomRepository.findByCode(enrollStudentInputData.classroom);
        const studentsEnrolledInClassroom = this.enrollmentRepository.findAllByClassroom(level.code, module.code, classroom.code);
        if (studentsEnrolledInClassroom.length === classroom.capacity) throw new Error("Classroom is over capacity");
        const existingEnrollment = this.enrollmentRepository.findByCpf(enrollStudentInputData.studentCpf);
        if (existingEnrollment) throw new Error("Enrollment with duplicated student is not allowed");
        const enrollmentSequence = this.enrollmentRepository.count() + 1;
        const issueDate = new Date();
        const enrollment = new Enrollment(student, level, module, classroom, issueDate, enrollmentSequence, enrollStudentInputData.installments);
        this.enrollmentRepository.save(enrollment);
        const enrollStudentOutputData = new EnrollStudentOutputData(enrollment.code.value);
        for (const invoice of enrollment.invoices) {
            enrollStudentOutputData.invoices.push(invoice.clone());
        }
        return enrollStudentOutputData;
    }
}
