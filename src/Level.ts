export default class Level {
    code: string;
    description: string;

    constructor ({code, description }: { code: string, description: string }) {
        this.code = code;
        this.description = description;
    }
}
