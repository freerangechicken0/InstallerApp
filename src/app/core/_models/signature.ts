export interface Signature {
    "Content-Type": string;
    "X-amz-algorithm": string;
    "X-amz-credential": string;
    "X-amz-date": string;
    "X-amz-signature": string;
    acl: string;
    key: string;
    policy: string;
    success_action_status: string;
}