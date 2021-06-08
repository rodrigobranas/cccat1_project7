export default class Period {
    start: Date;
    end: Date;

    constructor (start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }

    getDiffInMilli () {
        return this.end.getTime() - this.start.getTime();
    }

    getDiffInDays () {
        return this.getDiffInMilli()/(1000*60*60*24);
    }
}
