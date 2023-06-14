import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chrome DevRels posts on HN</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <Posts url="https://web.dev/" />
      </div>
    </>
  );
}
