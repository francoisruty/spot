import { Request, Response } from "express";
export declare function proxyRequest({ incomingRequest, response, protocol, proxyBaseUrl }: {
    incomingRequest: Request;
    response: Response;
    protocol: "http" | "https";
    proxyBaseUrl: string;
}): void;
