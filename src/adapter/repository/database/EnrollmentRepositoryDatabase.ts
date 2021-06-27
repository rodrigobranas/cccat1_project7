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

    async get(code: string): Promise<Enrollment> {
		const enrollmentData = await ConnectionPool.one("select * from system.enrollment where code = $1", [code]);
		const studentData = await ConnectionPool.one("select * from system.student where cpf = $1", [enrollmentData.student]);
		const student = new Student(studentData.name, studentData.cpf, studentData.birth_date);
		const level = await this.levelRepository.findByCode(enrollmentData.level);
		const module = await this.moduleRepository.findByCode(enrollmentData.level, enrollmentData.module);
		const classroom = await this.classroomRepository.findByCode(enrollmentData.classroom);
		const enrollment = new Enrollment(student, level, module, classroom, enrollmentData.issue_date, enrollmentData.sequence, enrollmentData.installments, enrollmentData.status);
		const invoicesData = await ConnectionPool.query("select * from system.invoice where enrollment = $1", [code]);
		const invoices = [];
		for (const invoiceData of invoicesData) {
			const invoice = new Invoice(invoiceData.enrollment, invoiceData.month, invoiceData.year, invoiceData.amount);
			const invoiceEventsData = await ConnectionPool.query("select * from system.invoice_event where enrollment = $1 and month = $2 and year = $3", [invoiceData.enrollment, invoiceData.month, invoiceData.year]);
			const invoiceEvents = [];
			for (const invoiceEventData of invoiceEventsData) {
				const invoiceEvent = new InvoiceEvent(invoiceEventData.type, invoiceEventData.amount);
				invoiceEvents.push(invoiceEvent);
			}
			invoice.events = invoiceEvents;
			invoices.push(invoice);
		}
		enrollment.invoices = invoices;
        if (!enrollment) throw new Error("Enrollment not found");
		return enrollment;
    }

    async save(enrollment: Enrollment): Promise<void> {
        const enrollmentData = await ConnectionPool.one("insert into system.enrollment (level, module, classroom, student, code, sequence, installments, status, issue_date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *", [enrollment.level.code, enrollment.module.code, enrollment.classroom.code, enrollment.student.cpf.value, enrollment.code.value, enrollment.sequence, enrollment.installments, enrollment.status, enrollment.issueDate]);
		const studentData = await ConnectionPool.one("insert into system.student (name, cpf, birth_date) values ($1, $2, $3) returning *", [enrollment.student.name.value, enrollment.student.cpf.value, enrollment.student.birthDate]);
		for (const invoice of enrollment.invoices) {
			const invoiceData = await ConnectionPool.one("insert into system.invoice (enrollment, month, year, amount) values ($1, $2, $3, $4) returning *", [enrollment.code.value, invoice.month, invoice.year, invoice.amount]);
		}
    }

    async update(enrollment: Enrollment): Promise<void> {
        await ConnectionPool.none("update system.enrollment set status = $1 where code = $2", [enrollment.status, enrollment.code.value]);
		for (const invoice of enrollment.invoices) {
			for (const invoiceEvent of invoice.events) {
				await ConnectionPool.none("insert into system.invoice_event (enrollment, month, year, type, amount) values ($1, $2, $3, $4, $5) on conflict do nothing", [enrollment.code.value, invoice.month, invoice.year, invoiceEvent.type, invoiceEvent.amount]);
			}
		}
    }

    async findAllByClassroom(level: string, module: string, classroom: string) {
		const enrollmentsData = await ConnectionPool.query("select * from system.enrollment where level = $1 and module = $2 and classroom = $3", [level, module, classroom]);
		const enrollments = [];
		for (const enrollmentData of enrollmentsData) {
			const enrollment = await this.get(enrollmentData.code);
			enrollments.push(enrollment);
		}
		return enrollments;
    }

    async findByCpf(cpf: string) {
		const enrollmentData = await ConnectionPool.oneOrNone("select * from system.enrollment where student = $1", [cpf]);
		if (!enrollmentData) return;
		return this.get(enrollmentData.code);
    }
    
    async count(): Promise<number> {
        const enrollments = await ConnectionPool.one("select count(*) from system.enrollment", []);
		return enrollments.count;
    }

	async clean(): Promise<void> {
		await ConnectionPool.query("delete from system.invoice_event", []);
		await ConnectionPool.query("delete from system.invoice", []);
		await ConnectionPool.query("delete from system.enrollment", []);
		await ConnectionPool.query("delete from system.student", []);
	}
}
