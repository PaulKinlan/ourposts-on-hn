import html, { h } from "https://deno.land/x/htm@0.2.1/mod.ts";
/** @jsx h */


const fetchHNPosts = async (url: string) => {
  const algoliaURL = `https://hn.algolia.com/api/v1/search?query=${url}&tags=story&numericFilters=num_comments%3E10`;
  const response = await fetch(algoliaURL);
  return await response.json();
}

export default async function Home(props: any) {
  
  const webDevData = await fetchHNPosts("https://web.dev");
  const dcc = await fetchHNPosts("https://developer.chrome.com");
  
  return html(
    {
      lang: "en",
      title: "Chrome DevRel's posts on HN",
      body: <div class="p-4 mx-auto max-w-screen-md">
        <h2>web.dev</h2><ul>
        {webDevData.hits.map((post: any) => ( <li><a href={"/comment?id=" + post.objectID}>{post.title}</a></li> ))}
        </ul>
        <h2>developer.chrome.com</h2><ul>
        {dcc.hits.map((post: any) => ( <li><a href={"/comment?id=" + post.objectID}>{post.title}</a></li> ))}
        </ul>
      </div>
    }
  );
}
