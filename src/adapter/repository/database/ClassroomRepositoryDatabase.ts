import Classroom from "../../../domain/entity/Classroom";
import ClassroomRepository from "../../../domain/repository/ClassroomRepository";
import ConnectionPool from "../../../infra/database/ConnectionPool";

export default class ClassroomRepositoryDatabase implements ClassroomRepository {

    async findByCode(code: string): Promise<Classroom> {
        const classroomData = await ConnectionPool.one("select * from system.classroom where code = $1", [code]);
        return new Classroom({
            level: classroomData.level,
            module: classroomData.module,
            code: classroomData.code,
            capacity: classroomData.capacity,
            startDate: classroomData.start_date,
            endDate: classroomData.end_date
        });
    }
}
