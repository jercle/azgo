import { Command } from '@oclif/core';
export default abstract class extends Command {
    static enableJsonFlag: boolean;
    static baseFlags: {
        debug: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
    };
}
