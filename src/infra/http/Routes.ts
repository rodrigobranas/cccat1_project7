import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import EnrollmentController from "../../adapter/controller/EnrollmentController";
import ExpressConverter from "./ExpressConverter";
import express from "express";
import SecurityController from "../../adapter/controller/SecurityController.ts";

export default class Router {

    private constructor () {
    }

    static build (repositoryFactory: RepositoryAbstractFactory) {
        const router = express.Router({ mergeParams: true });
        const securityController = new SecurityController(repositoryFactory);
        const enrollmentController = new EnrollmentController(repositoryFactory);
        router.post("/login", ExpressConverter.execute(securityController.login.bind(enrollmentController)));
        router.all("*", ExpressConverter.filter(securityController.isAuthenticated.bind(securityController)));
        router.all("*", ExpressConverter.filter(securityController.isAuthorized.bind(securityController)));
        router.post("/enrollments", ExpressConverter.execute(enrollmentController.enrollStudent.bind(enrollmentController)));
        router.get("/enrollments/:code", ExpressConverter.execute(enrollmentController.getEnrollment.bind(enrollmentController)));
        router.get("/enrollments", ExpressConverter.execute(enrollmentController.getEnrollments.bind(enrollmentController)));
        router.post("/enrollments/:code/cancel", ExpressConverter.execute(enrollmentController.cancelEnrollment.bind(enrollmentController)));
        router.post("/enrollments/:code/pay", ExpressConverter.execute(enrollmentController.payInvoice.bind(enrollmentController)));
        return router;
    }
}
