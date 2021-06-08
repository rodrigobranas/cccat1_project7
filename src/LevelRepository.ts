import Level from "./Level";

export default interface LevelRepository {
    findByCode(code: string): Level;
}
