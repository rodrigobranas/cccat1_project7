import Module from "../entity/Module";

export default interface ModuleRepository {
    findByCode(level: string, code: string): Promise<Module>;
}
