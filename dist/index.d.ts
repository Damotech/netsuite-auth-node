/**
 * @packageDocumentation A small ultility to connect to NetSuite's SuiteTalk REST Web Services
 */
import { AxiosResponse } from "axios";
import { NSApiOptions, NSApiRequestOptions } from "./types";
export default class NsApi {
    private readonly options;
    private readonly oauth;
    private readonly token;
    private readonly secret;
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
     * @param path - path to the resource. For example: ecord/v1/salesOrder/13842048?expandSubResources=true
     * @param method - POST,GET,PUT ETC.
     * @type {string }
     *
     * @param body - String of for the body content.
     * @type {string }
     * @public
     */
    callRestlet(opts: NSApiRequestOptions): Promise<AxiosResponse>;
}
