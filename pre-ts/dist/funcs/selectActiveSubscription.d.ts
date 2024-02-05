/**
 * Lists all tenants and subscriptions you have access to
 *
 * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
 */
export default function selectActiveSubscription(): Promise<false | {
    installationId: any;
    subscriptions: any;
}>;
export declare function selectActiveAzureDevOpsSubscription(configLocation: string): Promise<void>;
