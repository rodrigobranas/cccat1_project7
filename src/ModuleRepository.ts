import Module from "./Module";

export default interface ModuleRepository {
    findByCode(level: string, code: string): Module;
}
