import Level from "../../../domain/entity/Level";
import LevelRepository from "../../../domain/repository/LevelRepository";
import ConnectionPool from "../../../infra/database/ConnectionPool";

export default class LevelRepositoryDatabase implements LevelRepository {
    
    constructor () {
    }

    async findByCode(code: string) {
        const levelData = await ConnectionPool.oneOrNone("select * from system.level where code = $1", [code]);
		if (!levelData) throw new Error("Level not found");
		return new Level({
			code: levelData.code,
			description: levelData.description
		});
    }
}
