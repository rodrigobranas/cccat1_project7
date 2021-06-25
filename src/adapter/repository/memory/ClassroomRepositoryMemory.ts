import Classroom from "../../../domain/entity/Classroom";
import ClassroomRepository from "../../../domain/repository/ClassroomRepository";

export default class ClassroomRepositoryMemory implements ClassroomRepository {
    classrooms: Classroom[];

    constructor () {
        this.classrooms = [
            new Classroom({
                level: "EM",
                module: "3",
                code: "A",
                capacity: 2,
                startDate: new Date("2021-06-01"),
                endDate: new Date("2021-12-15")
            }),
            new Classroom({
                level: "EM",
                module: "3",
                code: "B",
                capacity: 2,
                startDate: new Date("2021-05-01"),
                endDate: new Date("2021-05-30")
            }),
            new Classroom({
                level: "EM",
                module: "3",
                code: "C",
                capacity: 2,
                startDate: new Date("2021-05-01"),
                endDate: new Date("2021-06-30")
            })
        ];
    }

    async findByCode(code: string) {
        const classroom = this.classrooms.find(classroom => classroom.code === code);
        if (!classroom) throw new Error("Classroom not found");
        return Promise.resolve(classroom);
    }
}
