import Classroom from "../entity/Classroom";

export default interface ClassroomRepository {
    findByCode(code: string): Promise<Classroom>;
}
