type Subscription = {
  "id": string,
  "name": string,
  "state": string,
  "user": {
    "name": string,
    "type": string
  },
  "isDefault": boolean,
  "tenantId": string,
  "environmentName": string,
  "homeTenantId": string,
  "managedByTenants": Array<{
    "tenantId": string
  }>
}


// export {Subscription}


type VulnerabilityDataObject = {
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
type Status = {
  code: string;
  severity: string;
}
type ResourceDetails = {
  source: string;
  id: string;
}
type AdditionalData = {
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
type CveEntityOrVendorReferencesEntity = {
  title: string;
  link: string;
}
type CicdData = {
  status: string;
}
type ImageDetails = {
  os: string;
  osDetails: string;
}
type Metadata = {
  isPreview: boolean;
}

type RespositoryObject = {
  name: string;
  registryLoginServer: string;
  createdOn: string;
  lastUpdatedOn: string;
  manifests?: (ManifestsEntity)[] | null;
}
type ManifestsEntity = {
  digest: string;
  tags?: (string | null)[] | null;
}
