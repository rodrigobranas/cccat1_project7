import Period from "./Period";

export default class Classroom {
    level: string;
    module: string;
    code: string;
    capacity: number;
    startDate: Date;
    endDate: Date;
    period: Period;

    constructor ({ level, module, code, capacity, startDate, endDate }: {  level: string, module: string, code: string, capacity: number, startDate: Date, endDate: Date }) {
        this.level = level;
        this.module = module;
        this.code = code;
        this.capacity = capacity;
        this.startDate = startDate;
        this.endDate = endDate;
        this.period = new Period(startDate, endDate);
    }

    isFinished (currentDate: Date) {
        return currentDate.getTime() > this.endDate.getTime();
    }

    getProgress (currentDate: Date) {
        const period = new Period(currentDate, this.endDate);
        const remainingDays = this.period.getDiffInDays() - period.getDiffInDays();
        return (remainingDays/this.period.getDiffInDays())*100;
    }
}
