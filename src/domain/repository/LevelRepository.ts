import Level from "../entity/Level";

export default interface LevelRepository {
    findByCode(code: string): Promise<Level>;
}
