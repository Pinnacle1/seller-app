import { Config } from "./config";
import { buildHeaders } from "./build-headers";

type RequestOptions = {
  headers?: Record<string, string>;
  auth?: boolean;
  token?: string | null;
};

export const END_POINT = {
  get: async (
    path: string,
    params: any = undefined,
    version: string = "V1",
    opts?: RequestOptions
  ) => {
    try {
      var basePath = version === "V2" ? Config.URL.API_V2 : Config.URL.API_URL;
      basePath = basePath.replace(/\/$/, "");
      var url = new URL(`${basePath}${path}`);

      if (params) {
        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: opts
          ? buildHeaders(opts)
          : {
            "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({}));
        const error = new Error(`HTTP Error: ${response.status}`) as any;
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorResponse,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  post: async (
    path: string,
    body: any,
    stringfy: boolean = false,
    version: string = "V1",
    opts?: RequestOptions
  ) => {
    try {
      var basePath = version === "V2" ? Config.URL.API_V2 : Config.URL.API_URL;
      basePath = basePath.replace(/\/$/, "");
      var url = new URL(`${basePath}${path}`);
      const response = await fetch(url.toString(), {
        headers: opts
          ? buildHeaders(opts)
          : {
            "Content-Type": "application/json",
          },
        method: "POST",
        body: stringfy ? JSON.stringify(body) : body,
        cache: "no-store", // Disable caching for POST requests too
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({}));
        const error = new Error(`HTTP Error: ${response.status}`) as any;
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorResponse,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  postFormData: async (
    path: string,
    body: any,
    version: string = "V1",
    opts?: RequestOptions
  ) => {
    try {
      var basePath = version === "V2" ? Config.URL.API_V2 : Config.URL.API_URL;
      basePath = basePath.replace(/\/$/, "");
      var url = new URL(`${basePath}${path}`);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: opts ? buildHeaders(opts, false) : {},
        body: body,
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({}));
        const error = new Error(`HTTP Error: ${response.status}`) as any;
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorResponse,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  Delete: async (
    path: string,
    body: any,
    version: string = "V1",
    opts?: RequestOptions
  ) => {
    try {
      var basePath = version === "V2" ? Config.URL.API_V2 : Config.URL.API_URL;
      basePath = basePath.replace(/\/$/, "");
      var url = new URL(`${basePath}${path}`);
      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: opts
          ? buildHeaders(opts, true)
          : {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({}));
        const error = new Error(`HTTP Error: ${response.status}`) as any;
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorResponse,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  PUT: async (
    path: string,
    body: any,
    stringify: boolean,
    version: string = "V1",
    opts?: RequestOptions
  ) => {
    try {
      var basePath = version === "V2" ? Config.URL.API_V2 : Config.URL.API_URL;
      // Remove trailing slash if present to avoid double slashes with path
      basePath = basePath.replace(/\/$/, "");
      var url = new URL(`${basePath}${path}`);
      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: opts
          ? buildHeaders(opts, true)
          : {
            "Content-Type": "application/json",
          },
        body: stringify ? JSON.stringify(body) : body,
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({}));
        const error = new Error(`HTTP Error: ${response.status}`) as any;
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorResponse,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  PATCH: async (
    path: string,
    body: any,
    stringify: boolean,
    version: string = "V1",
    opts?: RequestOptions
  ) => {
    try {
      var basePath = version === "V2" ? Config.URL.API_V2 : Config.URL.API_URL;
      basePath = basePath.replace(/\/$/, "");
      var url = new URL(`${basePath}${path}`);
      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: opts
          ? buildHeaders(opts, true)
          : {
            "Content-Type": "application/json",
          },
        body: stringify ? JSON.stringify(body) : body,
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({}));
        const error = new Error(`HTTP Error: ${response.status}`) as any;
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorResponse,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
