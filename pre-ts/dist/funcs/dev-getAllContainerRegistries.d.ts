export default function getAllContainerRegistries({ subscriptionId }: {
    subscriptionId: any;
}, azCliCredential: any): Promise<{
    azgoSyncDate: String;
    data: Object[];
}>;
