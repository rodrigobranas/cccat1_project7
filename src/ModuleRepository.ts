export default interface ModuleRepository {
    findByCode(level: string, code: string): any;
}