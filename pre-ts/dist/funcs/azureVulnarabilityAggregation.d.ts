export declare function transformVulnerabilityData(vulns: any, repos?: any): any;
export declare function getAllManifests(repos: any, filter?: any): any;
export declare function getAllUniqueCves(data: any): unknown[];
export declare function groupByCve(data: any): any;
export declare function groupByRepoUnderCve(data: any): any;
export declare function groupByAttribute(data: any, attr: string): any;
export declare function countByAttribute(data: any, attribute: string, dataType: string): {
    [k: string]: number;
} | {
    attr: string;
    count: any;
}[];
export interface VulnerabilityDataObject {
    id: string;
    name: string;
    type: string;
    idPropertiesId?: string | null;
    displayName?: string | null;
    status: Status;
    remediation?: string | null;
    impact?: string | null;
    category?: string | null;
    description?: string | null;
    timeGenerated: string;
    resourceDetails: ResourceDetails;
    additionalData: AdditionalData;
}
export interface Status {
    code: string;
    severity: string;
}
export interface ResourceDetails {
    source: string;
    id: string;
}
export interface AdditionalData {
    assessedResourceType: string;
    type?: string | null;
    cvss?: any;
    patchable: boolean;
    cve?: (CveEntityOrVendorReferencesEntity | null)[] | null;
    publishedTime: string;
    vendorReferences?: (CveEntityOrVendorReferencesEntity | null)[] | null;
    repositoryName: string;
    imageDigest: string;
    registryHost: string;
    cicdData: CicdData;
    imageDetails?: ImageDetails | null;
    metadata?: Metadata | null;
}
export interface CveEntityOrVendorReferencesEntity {
    title: string;
    link: string;
}
export interface CicdData {
    status: string;
}
export interface ImageDetails {
    os: string;
    osDetails: string;
}
export interface Metadata {
    isPreview: boolean;
}
export interface RespositoryObject {
    name: string;
    registryLoginServer: string;
    createdOn: string;
    lastUpdatedOn: string;
    manifests?: (ManifestsEntity)[] | null;
}
export interface ManifestsEntity {
    digest: string;
    tags?: (string | null)[] | null;
}
