export default class GetEnrollmentOutputData {
    code: string;
    balance: number;
    status: string;
    invoices: any[];

    constructor ({ code, balance, status, invoices }: { code: string, balance: number, status: string, invoices: any[] }) {
        this.code = code;
        this.balance = balance;
        this.status = status;
        this.invoices = invoices;
    }
}
