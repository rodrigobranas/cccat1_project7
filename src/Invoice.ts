export default class Invoice {
    code: string;
    month: number;
    year: number;
    amount: number;

    constructor (code: string, month: number, year: number, amount: number) {
        this.code = code;
        this.month = month;
        this.year = year;
        this.amount = amount;
    }
}
