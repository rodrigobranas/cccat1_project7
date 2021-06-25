import Cloneable from "./Cloneable";
import InvoiceEvent from "./InvoiceEvent";

export default class Invoice implements Cloneable {
    code: string;
    month: number;
    year: number;
    amount: number;
    dueDate: Date;
    events: InvoiceEvent[];

    constructor (code: string, month: number, year: number, amount: number) {
        this.code = code;
        this.month = month;
        this.year = year;
        this.amount = amount;
        this.dueDate = new Date(year, month - 1, 5);
        this.events = [];
    }

    addEvent (invoiceEvent: InvoiceEvent) {
        this.events.push(invoiceEvent);
    }

    getBalance () {
        const balance = this.events.reduce((total, event) => {
            if (event.type === "payment") total -= event.amount;
            if (event.type === "penalty") total += event.amount;
            if (event.type === "interests") total += event.amount;
            return total;
        }, this.amount);
        return Math.abs(Math.round(balance*100)/100);
    }

    getStatus (currentDate: Date) {
        if (this.getBalance() === 0) return "paid";
        if (currentDate.getTime() > this.dueDate.getTime()) return "overdue";
        return "open";
    }

    getPenalty (currentDate: Date) {
        if (this.getStatus(currentDate) !== "overdue") return 0;
        const balance = this.getBalance();
        return Math.round((balance * 0.1)*100)/100;
    }

    getInterests (currentDate: Date) {
        if (this.getStatus(currentDate) !== "overdue") return 0;
        const balance = this.getBalance();
        const dueDays = Math.floor((currentDate.getTime() - this.dueDate.getTime())/(1000*60*60*24));
        return Math.round((balance * 0.01 * dueDays)*100)/100;
    }

    clone () {
        return JSON.parse(JSON.stringify(this));
    }
}
