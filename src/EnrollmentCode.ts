export default class EnrollmentCode {
    value: string;

    constructor (level: string, module: string, classroom: string, date: Date, sequence: number) {
        this.value = `${date.getFullYear()}${level}${module}${classroom}${new String(sequence).padStart(4, "0")}`;
    }
}
