/**
 * @packageDocumentation A small ultility to connect to NetSuite's SuiteTalk REST Web Services
 */
import { AxiosResponse } from "axios";
import { NSApiOptions, NSApiRequestOptions } from "./types";
export default class NsApi {
    private readonly options;
    private readonly oauth;
    private readonly tokenKey;
    private readonly tokenSecret;
    private debug;
    private accountId;
    constructor(options: NSApiOptions);
    private hashFunction;
    private generateAuthorizationHeaderFromRequest;
    /**
     * Used to call any NetSuite Rest API endpoint
     *
     * @type {string }
     *
     * @type {string }
     * @public
     * @param opts
     */
    request(opts: NSApiRequestOptions): Promise<AxiosResponse>;
    /**
     * Used to call any NetSuite Rest API endpoint
     *
     * @param opts - Object with request options
     * @param opts.path - path to the resource. For example: record/v1/salesOrder/13842048?expandSubResources=true
     * @type { string }
     * @param opts.method - POST,GET,PUT ETC.
     * @type { string }
     * @param opts.body - JS Object to be sent in the body of the request
     * @type { Object }
     * @public
     */
    callRestlet(opts: NSApiRequestOptions): Promise<AxiosResponse>;
}
