export default class EnrollStudentOutputData {
    code: string;
    invoices: any[];

    constructor (code: string) {
        this.code = code;
        this.invoices = [];
    }
}
