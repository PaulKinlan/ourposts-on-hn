#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { serve } from "std/http/server.ts";

import { join } from "std/path/mod.ts";
import { contentType } from "std/media_types/mod.ts";
import Home from "./routes/index.tsx";
import Comment from "./routes/comment.tsx";

export type Route = [URLPattern, RequestHandler];
export type RequestHandler = (Request) => Response | Promise<Response>;

class StaticFileHandler {
  #basePath = "";

  constructor(base: string) {
    this.#basePath = base;
  }

  handler(request: Request): Promise<Response> | Response {
    const pathname = new URL(request.url).pathname;
    const extension = pathname.substr(pathname.lastIndexOf("."));
    const resolvedPathname = (pathname == "" || pathname == "/")
      ? "/index.html"
      : pathname;
    const path = join(Deno.cwd(), this.#basePath, resolvedPathname);
    const file: Promise<Response> = Deno.readFile(path)
      .then((data): Response =>
        new Response(data, {
          status: 200,
          headers: { "content-type": contentType(extension) },
        })
      ) // Need to think about content tyoes.
      .catch((_): Response => new Response("Not found", { status: 404 }));

    return file;
  }

  get pattern(): URLPattern {
    return new URLPattern({ pathname: "*" });
  }
}

serve((req: Request) => {
  const url = req.url;
  const staticFiles = new StaticFileHandler("static");
  let response: Response | Promise<Response> = new Response("Not found", { status: 404 });

  const routes: Array<Route> = [
    [
      new URLPattern({ pathname: "/" }),
      async (request) => {
        const resp = await Home(request);
        return resp;
      },
    ],
    [
      new URLPattern({ pathname: "/comment" }),
      async (request) => {
        const resp = await Comment(request);
        return resp;
      },
    ],
    // Fall through.
    [
      staticFiles.pattern,
      staticFiles.handler.bind(staticFiles),
    ],
  ];

  for (const [pattern, handler] of routes) {
    const patternResult = pattern.exec(url);
    if (patternResult != null) {
      // Find the first matching route.
      response = handler(req);
      break;
    }
  }

  return response;
});