import html, { h } from "https://deno.land/x/htm@0.2.1/mod.ts";
/** @jsx h */


const fetchHNPosts = async (url: string) => {
  const algoliaURL = `https://hn.algolia.com/api/v1/search?query=${url}&tags=story&numericFilters=num_comments%3E10`;
  const response = await fetch(algoliaURL);
  return await response.json();
}

export default async function Home() {
  const data = await fetchHNPosts("https://web.dev");
  
  return html(
    {
      lang: "en",
      title: "Chrome DevRel's posts on HN",
      body: <div class="p-4 mx-auto max-w-screen-md"><ul>
        {data.hits.map((post: any) => ( <li><a href={"/comments/?id=" + post.objectID}>{post.title}</a></li> ))}
        </ul>
      </div>
    }
  );
}
