import wretch, { ConfiguredMiddleware } from "wretch";
import { getApiKey } from "./apiKey";
import { retry } from "wretch/middlewares";

export const manipulateHeaders =
  (callback: (headers: Headers) => Headers): ConfiguredMiddleware =>
  (next) =>
  (url, { headers, ...opts }) => {
    const nextHeaders = callback(
      new Headers(headers as HeadersInit)
    ) as unknown as globalThis.Headers;
    return next(url, { ...opts, headers: nextHeaders });
  };

const addDefaultHeaders = () => {
  return manipulateHeaders((headers) => {
    const newHeaders = new Headers(headers);
    newHeaders.append("Authorization", `Bearer ${getApiKey()}`);
    return newHeaders;
  });
};

const delayMiddleware =
  (delay: number): ConfiguredMiddleware =>
  (next) =>
  (url, opts) => {
    return new Promise((res) => setTimeout(() => res(next(url, opts)), delay));
  };

export default wretch().middlewares([addDefaultHeaders()]);
