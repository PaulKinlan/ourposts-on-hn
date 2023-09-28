/** @jsx h */
import html, { h } from "https://deno.land/x/htm@0.2.1/mod.ts";
import Posts from "../components/posts.tsx";

const fetchHNPosts = async (url: string) => {
  const algoliaURL = `https://hn.algolia.com/api/v1/search_by_date?query=${url}&tags=story&numericFilters=num_comments%3E10`;
  const response = await fetch(algoliaURL);
  return await response.json();
}

export default async function Home(props: any) {

  const webDevData = await fetchHNPosts("https://web.dev");
  const dcc = await fetchHNPosts("https://developer.chrome.com");
  const chromeStatus = await fetchHNPosts("https://chromestatus.com");
  const chromiumSource = await fetchHNPosts("https://chromium.googlesource.com");


  return html(
    {
      lang: "en",
      title: "Chrome DevRel's posts on HN",
      styles: [
        "pre { overflow-x: auto;}",
        "div { margin-left: 2ch; }"
      ],
      body: <div class="p-4 mx-auto max-w-screen-md">
        <h2>web.dev</h2>
        <Posts data={webDevData}></Posts>
        
        <h2>developer.chrome.com</h2>
        <Posts data={dcc}></Posts>

        <h2>ChromeStatus</h2>
        <Posts data={chromeStatus}></Posts>

        <h2>chromium.googlesource.com</h2>
        <Posts data={chromiumSource}></Posts>
      </div>
    }
  );
}
