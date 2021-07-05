import Enrollment from "../../../domain/entity/Enrollment";
import Invoice from "../../../domain/entity/Invoice";
import InvoiceEvent from "../../../domain/entity/InvoiceEvent";
import Student from "../../../domain/entity/Student";
import EnrollmentRepository from "../../../domain/repository/EnrollmentRepository";
import ConnectionPool from "../../../infra/database/ConnectionPool";
import ClassroomRepositoryDatabase from "./ClassroomRepositoryDatabase";
import LevelRepositoryDatabase from "./LevelRepositoryDatabase";
import ModuleRepositoryDatabase from "./ModuleRepositoryDatabase";

export default class EnrollmentRepositoryDatabase implements EnrollmentRepository {
    levelRepository: LevelRepositoryDatabase;
    moduleRepository: ModuleRepositoryDatabase;
    classroomRepository: ClassroomRepositoryDatabase;

    constructor () {
        this.levelRepository = new LevelRepositoryDatabase();
        this.moduleRepository = new ModuleRepositoryDatabase();
        this.classroomRepository = new ClassroomRepositoryDatabase();
    }
    async getAll(): Promise<Enrollment[]> {
        const enrollmentsData = await ConnectionPool.query("select code from system.enrollment order by code", []);
        const enrollments = [];
        for (const enrollmentData of enrollmentsData) {
            const enrollment = await this.get(enrollmentData.code);
            enrollments.push(enrollment);
        }
        return enrollments;
    }

    async get(code: string): Promise<Enrollment> {
        const enrollmentData = await ConnectionPool.oneOrNone("select * from system.enrollment where code = $1", [code]);
        if (!enrollmentData) throw new Error("Enrollment not found");
        const studentData = await ConnectionPool.one("select * from system.student where cpf = $1", [enrollmentData.student]);
        const student = new Student(studentData.name, studentData.cpf, studentData.birth_date);
        const level = await this.levelRepository.findByCode(enrollmentData.level);
        const module = await this.moduleRepository.findByCode(enrollmentData.level, enrollmentData.module);
        const classroom = await this.classroomRepository.findByCode(enrollmentData.classroom);
        const enrollment = new Enrollment(student, level, module, classroom, enrollmentData.issue_date, enrollmentData.sequence, enrollmentData.installments, enrollmentData.status);
        const invoicesData = await ConnectionPool.query("select * from system.invoice where enrollment = $1 order by year, month", [code]);
        const invoices = [];
        for (const invoiceData of invoicesData) {
            const invoice = new Invoice(code, invoiceData.month, invoiceData.year, invoiceData.amount);
            const invoiceEvents = [];
            const invoiceEventsData = await ConnectionPool.query("select * from system.invoice_event where enrollment = $1 and month = $2 and year = $3", [code, invoiceData.month, invoiceData.year]);
            for (const invoiceEventData of invoiceEventsData) {
                const invoiceEvent = new InvoiceEvent(invoiceEventData.type, invoiceEventData.amount);
                invoiceEvents.push(invoiceEvent);
            }
            invoice.events = invoiceEvents;
            invoices.push(invoice);
        }
        enrollment.invoices = invoices;
        return enrollment;
    }

    async save(enrollment: Enrollment): Promise<void> {
        const enrollmentData = await ConnectionPool.one("insert into system.enrollment (code, sequence, level, module, classroom, student, installments, issue_date, status) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *", [enrollment.code.value, enrollment.sequence, enrollment.level.code, enrollment.module.code, enrollment.classroom.code, enrollment.student.cpf.value, enrollment.installments, enrollment.issueDate, enrollment.status]);
        const studentData = await ConnectionPool.one("insert into system.student (name, cpf, birth_date) values ($1, $2, $3) returning *", [enrollment.student.name.value, enrollment.student.cpf.value, enrollment.student.birthDate]);
        for (const invoice of enrollment.invoices) {
            await ConnectionPool.one("insert into system.invoice (enrollment, month, year, due_date, amount) values ($1, $2, $3, $4, $5) returning *", [enrollment.code.value, invoice.month, invoice.year, invoice.dueDate, invoice.amount]);
        }
    }

    async update(enrollment: Enrollment): Promise<void> {
        await ConnectionPool.none("update system.enrollment set status = $1 where code = $2", [enrollment.status, enrollment.code.value]);
        await ConnectionPool.none("delete from system.invoice_event where enrollment = $1", [enrollment.code.value]);
		for (const invoice of enrollment.invoices) {
			for (const invoiceEvent of invoice.events) {
				await ConnectionPool.none("insert into system.invoice_event (enrollment, month, year, type, amount) values ($1, $2, $3, $4, $5)", [enrollment.code.value, invoice.month, invoice.year, invoiceEvent.type, invoiceEvent.amount]);
			}
		}
    }

    async findAllByClassroom(level: string, module: string, classroom: string): Promise<Enrollment[]> {
        const enrollmentsData = await ConnectionPool.query("select * from system.enrollment where level = $1 and module = $2 and classroom = $3", [level, module, classroom]);
		const enrollments = [];
		for (const enrollmentData of enrollmentsData) {
			const enrollment = await this.get(enrollmentData.code);
			enrollments.push(enrollment);
		}
		return enrollments;
    }

    async findByCpf(cpf: string): Promise<Enrollment | undefined> {
        const enrollmentData = await ConnectionPool.oneOrNone("select * from system.enrollment where student = $1", [cpf]);
		if (!enrollmentData) return;
		return this.get(enrollmentData.code);
    }

    async count(): Promise<number> {
        const enrollments = await ConnectionPool.one("select count(*)::int from system.enrollment", []);
		return enrollments.count;
    }

    async clean(): Promise<void> {
		await ConnectionPool.query("delete from system.invoice_event", []);
		await ConnectionPool.query("delete from system.invoice", []);
		await ConnectionPool.query("delete from system.enrollment", []);
		await ConnectionPool.query("delete from system.student", []);
	}

}
