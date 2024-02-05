type multiOptions = {
    user: any;
    organization: any;
    id: string;
    list: boolean;
    onlyCount: boolean;
    groupBy: string;
    filterType: string;
    filterState: string;
    open: boolean;
    closed: boolean;
    all: boolean;
};
export declare function buildFilterQuery(filterOpts: any): any;
export declare function getWorkItem(id: string, organization: string): Promise<any>;
export default function listMyWorkItems({ user, organization, filterType, filterState, groupBy, all, closed, }: multiOptions): Promise<any>;
export {};
