export default class GetEnrollmentsOutputData {
    code: string;
    balance: number;
    status: string;

    constructor ({ code, balance, status }: { code: string, balance: number, status: string }) {
        this.code = code;
        this.balance = balance;
        this.status = status;
    }
}
