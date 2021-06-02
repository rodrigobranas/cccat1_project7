export default interface LevelRepository {
    findByCode(code: string): any;
}
