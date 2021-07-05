export default class ExpressConverter {
    static execute (fn: any) {
        return async function (req: any, res: any, next: any) {
            try {
                const result = await fn(req.params, req.body, req.headers);
                res.json(result);
            } catch (e) {
                res.status(422);
                res.json({ message: e.message });
            }
        }
    }

    static filter (fn: any) {
        return async function (req: any, res: any, next: any) {
            try {
                await fn(req.params, req.body, req.headers);
                next();
            } catch (e) {
                res.status(422);
                res.json({ message: e.message });
            }
        }
    }
}
