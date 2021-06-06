import Student from "./Student";

export default class Enrollment {
    student: Student;
    level: string;
    module: string;
    classroom: string;
    code: string;
    
    constructor (student: Student, level: string, module: string, classroom: string, code: string) {
        this.student = student;
        this.level = level;
        this.module = module;
        this.classroom = classroom;
        this.code = code;
    }
}