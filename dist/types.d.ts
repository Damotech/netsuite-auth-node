export interface NSApiOptions {
    consumerKey: string;
    consumerSecret: string;
    tokenId: string;
    tokenSecret: string;
    accountId: string;
    debugger?: boolean;
}
export interface NSApiRequestOptions {
    path?: string;
    method: string;
    body?: unknown;
    transient?: boolean;
}
export declare type NSRestletRequestOptions = NSApiRequestOptions;
