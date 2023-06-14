// URL 

import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Posts(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  const url = props.url;
  const algoliaURL = `https://hn.algolia.com/api/v1/search?query=${url}&tags=story&numericFilters=num_comments%3E10`
  
  const [searchData, setSearchData] = useState({});
  
  useEffect(() => {
    fetch(algoliaURL)
      .then((response) => response.json())
      .then((data) => {
        setSearchData(data);
      });
  }, [urlState]);

  return (
    <div>
      <h1 class="text-2xl font-bold">Posts on HN for ${url}</h1>
      <div class="mt-4">
        <ul>
          {searchData.hist.map((item) => () => {
            return (<li> {item.title} </li>)
          })}
        </ul>
      </div>
    </div>
  );
}
