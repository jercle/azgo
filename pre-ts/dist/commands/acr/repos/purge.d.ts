import { Command } from '@oclif/core';
export default class AcrReposPurge extends Command {
    static description: string;
    static flags: {
        executeDelete: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        retentionDays: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<number, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
    };
    run(): Promise<void>;
}
