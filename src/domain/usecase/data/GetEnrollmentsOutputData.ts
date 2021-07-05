export default class GetEnrollmentsOutputData {
    studentName: string;
    studentCpf: string;
    studentBirthDate: string;
    levelDescription: string;
    moduleDescription: string;
    classroomCode: string;
    code: string;
    balance: number;
    status: string;
    invoices: any[];

    constructor ({ studentName, studentCpf, studentBirthDate, levelDescription, moduleDescription, classroomCode, code, balance, status }: { studentName: string, studentCpf: string, studentBirthDate: string, levelDescription: string, moduleDescription: string, classroomCode: string, code: string, balance: number, status: string }) {
        this.studentName = studentName;
        this.studentCpf = studentCpf;
        this.studentBirthDate = studentBirthDate;
        this.levelDescription = levelDescription;
        this.moduleDescription = moduleDescription;
        this.classroomCode = classroomCode;
        this.code = code;
        this.balance = balance;
        this.status = status;
        this.invoices = [];
    }
}
