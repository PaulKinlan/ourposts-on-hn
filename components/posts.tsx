import html, { h } from "https://deno.land/x/htm@0.2.1/mod.ts";

/** @jsx h */

export default function Posts(props: any) {
  return <ul>
    {props.data.hits.map((post: any) => (<li><a href={"/comment?id=" + post.objectID}>{post.title}</a> posted {Math.floor(((Date.now() / 1000) - new Date(post.created_at_i)) / 86400)} days ago [score: {post.points}, comments: {post.num_comments} - <a href={`https://news.ycombinator.com/item?id=${post.objectID}`}>Original comments</a>].</li>))}
  </ul>;
};