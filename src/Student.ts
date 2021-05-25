import Cpf from "./Cpf";
import Name from "./Name";

export default class Student {
    name: Name;
    cpf: Cpf;

    constructor (name: string, cpf: string) {
        this.name = new Name(name);
        this.cpf = new Cpf(cpf);
    }
}
