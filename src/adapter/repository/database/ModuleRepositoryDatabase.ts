import Module from "../../../domain/entity/Module";
import ModuleRepository from "../../../domain/repository/ModuleRepository";
import ConnectionPool from "../../../infra/database/ConnectionPool";

export default class ModuleRepositoryDatabase implements ModuleRepository {

    constructor () {
    }

    async findByCode(level: string, code: string) {
		const moduleData = await ConnectionPool.one("select * from system.module where level = $1 and code = $2", [level, code]);
        if (!moduleData) throw new Error("Module not found");
        return new Module({
			level: moduleData.level,
			code: moduleData.code,
			description: moduleData.description,
			minimumAge: moduleData.minimum_age,
			price: moduleData.price
		});
    }
}
