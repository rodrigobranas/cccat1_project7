import ClassRepository from "./ClassRepository";

export default class ClassRepositoryMemory implements ClassRepository {
    classes: any[];

    constructor () {
        this.classes = [
            {
                level: "EM",
                module: "3",
                code: "A",
                capacity: 2
            }
        ];
    }

    findByCode(code: string) {
        const clazz = this.classes.find(clazz => clazz.code === code);
        if (!clazz) throw new Error("Class not found");
        return clazz
    }
}
