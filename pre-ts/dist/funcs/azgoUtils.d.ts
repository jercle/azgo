export declare function printWorkItems(workItemArray: any[]): void;
export declare function formatWorkItems(workItemArray: any[]): {
    id: any;
    title: any;
    state: any;
    areaPath: any;
    iterationPath: any;
    type: any;
    assigneeName: any;
    assigneeEmail: any;
    created: any;
    updated: any;
    htmlLink: any;
    descrption: string;
    latestComment: string;
}[];
export declare function stripHtml(str: string): string;
export declare function showDebug(opts: any, config: any): Promise<void>;
export declare function initConfig(configDir: any): void;
export declare function vulnerabilityFilter(data: any, filter: any): any;
export declare function uploadToMongoDatabase(data: any, { dbConnectionString }: {
    dbConnectionString: any;
}): Promise<void>;
export declare function getTrivyDownload(): Promise<void>;
