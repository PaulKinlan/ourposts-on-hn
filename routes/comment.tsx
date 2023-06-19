import html, { h } from "https://deno.land/x/htm@0.2.1/mod.ts";
/** @jsx h */

class HN {
  async comments(id, onResponse) {
    const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
    return fetch(url).then(async (response) => {
      const body = await response.json();

      const { kids, deleted, dead } = body;

      if (onResponse != null) {
        onResponse(body);
      }

      if (!deleted && !dead && kids != undefined) {
        body.fullKids = [];
        for (const kid of kids) {
          body.fullKids.push(await this.comments(kid, onResponse));
        }
      }

      return body;
    });
  }
}

class HNDOMBuilder {
  private root;
  private map:Map<Number, any>;
  constructor(root) {
    this.root = root;
    this.map = new Map();
  }

  append = (data) => {
    const { id, parent, text, time, title, type, by, deleted, dead } = data;

    if (deleted || dead) return; 

    const parentElement = this.map.get(parent) || this.root;

    const element = (<div>
    {(type == "story") ?
    <h1>{title}</h1>: <div><p>{by} wrote <blockquote dangerouslySetInnerHTML={{__html: text}}></blockquote></div>}
  </div>);

    this.map.set(id, element);

    return parentElement.children.push(element);
  }
}

export default async function Comments(request: Request) {
  const url = new URL(request.url);
  const storyId = url.searchParams.get("id") || 36237332;

  const hn = new HN();
  const root = <section></section>;
  const builder = new HNDOMBuilder(root);
  await hn.comments(storyId, builder.append).then(console.log);

  return html(
    {
      lang: "en",
      title: "Chrome DevRel's posts on HN",
      body: <div class="p-4 mx-auto max-w-screen-md">
        {root}
      </div>
    }
  );
}
