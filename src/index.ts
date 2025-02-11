/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @packageDocumentation A small ultility to connect to NetSuite's SuiteTalk REST Web Services
 */

import OAuth, {RequestOptions} from "oauth-1.0a";
import axios, {AxiosRequestConfig, AxiosResponse, Method} from "axios";
import * as crypto from "crypto";
import Debug from "debug";
import {NSApiOptions, NSApiRequestOptions} from "./types";

export default class NsApi {
    private readonly oauth: OAuth;
    private readonly tokenKey: string;
    private readonly tokenSecret: string;
    private debug: Debug.Debugger | undefined;
    private accountId: string;

    constructor(private readonly options: NSApiOptions) {
        this.tokenKey = this.options.tokenId;
        this.tokenSecret = this.options.tokenSecret;
        this.accountId = options.accountId;
        if (options.debugger) {
            this.debug = Debug("nsapi");
        }

        this.oauth = new OAuth({
            consumer: {
                key: this.options.consumerKey,
                secret: this.options.consumerSecret,
            },
            signature_method: "HMAC-SHA256",
            hash_function: this.hashFunction,
            realm: options.accountId,
            version: "1.0",
        });
    }

    private hashFunction = (
        base_string: crypto.BinaryLike,
        key:
            | string
            | Uint8Array
            | Uint8ClampedArray
            | Uint16Array
            | Uint32Array
            | Int8Array
            | Int16Array
            | Int32Array
            | BigUint64Array
            | BigInt64Array
            | Float32Array
            | Float64Array
            | DataView
            | crypto.KeyObject
    ) => {
        return crypto
            .createHmac("sha256", key)
            .update(base_string)
            .digest("base64");
    };

    private generateAuthorizationHeaderFromRequest(
        options: RequestOptions,
        token?: OAuth.Token
    ): OAuth.Header {
        return this.oauth.toHeader(this.oauth.authorize(options, token));
    }

    /**
     * Used to call any NetSuite Rest API endpoint
     *
     * @type {string }
     *
     * @type {string }
     * @public
     * @param opts
     */
    public async request(opts: NSApiRequestOptions): Promise<AxiosResponse> {
        const {path, body, transient} = opts;
        const method = opts.method as Method;

        if (this.debug) {
            this.debug(opts);
        }

        const urlAccountId = this.accountId.replace(/_/g, "-").toLowerCase();
        const url = `https://${urlAccountId}.suitetalk.api.netsuite.com/services/rest/${path}`;

        const requestOptions: OAuth.RequestOptions = {
            url,
            method,
            data: body,
            includeBodyHash: true,
        };

        if (this.debug) {
            this.debug(`requestOptions ${JSON.stringify(requestOptions)}`);
        }

        const token: OAuth.Token = {
            key: this.tokenKey,
            secret: this.tokenSecret,
        };

        const authHeaders = this.generateAuthorizationHeaderFromRequest(
            requestOptions,
            token
        );

        const reqHeaders: Record<string, string> = {...authHeaders, "Content-Type": "application/json"};
        if (transient) {
            reqHeaders['Prefer'] = 'transient';
        }

        const request: AxiosRequestConfig = {
            url,
            headers: reqHeaders,
            method,
            data: body,
        };

        return await axios.request(request);
    }

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
    public async callRestlet(opts: NSApiRequestOptions): Promise<AxiosResponse> {
        const {path, body} = opts;
        const method = opts.method as Method;

        if (this.debug) {
            this.debug(opts);
        }

        const urlAccountId = this.accountId.replace(/_/g, "-").toLowerCase();
        const url = `https://${urlAccountId}.restlets.api.netsuite.com/app/site/hosting/restlet.nl${path}`;

        const requestOptions: OAuth.RequestOptions = {
            url,
            method,
            data: null,
        };

        const token: OAuth.Token = {
            key: this.tokenKey,
            secret: this.tokenSecret,
        };
         const authHeaders = this.generateAuthorizationHeaderFromRequest(
            requestOptions,
            token
        );

        const request: AxiosRequestConfig = {
            url,
            headers: {...authHeaders, "Content-Type": "application/json"},
            method,
            data: body,
        };
        return axios.request(request);
    }

}