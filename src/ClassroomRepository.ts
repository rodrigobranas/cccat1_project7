import Classroom from "./Classroom";

export default interface ClassroomRepository {
    findByCode(code: string): Classroom;
}
