import express from "express";
import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import EnrollmentController from "../../adapter/controller/EnrollmentController";

export default class HttpServer {

    private constructor () {
    }

    static start (repositoryFactory: RepositoryAbstractFactory) {
        const app = express();

        app.use(express.json());

        app.post("/enrollments", async function (req, res) {
            const controller = new EnrollmentController(repositoryFactory);
            try {
                const enrollStudentOutputData = await controller.enrollStudent(req.body);
                res.json(enrollStudentOutputData);
            } catch (e) {
                res.status(422);
                res.json({ message: e.message });
            }
        });

        app.get("/enrollments/:code", async function (req, res) {
            const controller = new EnrollmentController(repositoryFactory);
            try {
                const getEnrollmentOutputData = await controller.getEnrollment(req.params.code);
                res.json(getEnrollmentOutputData);
            } catch (e) {
                res.status(422);
                res.json({ message: e.message });
            }
        });

        app.listen(3000);
    }
}
