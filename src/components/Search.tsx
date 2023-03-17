import { onMount, createSignal, createEffect, createMemo, For } from "solid-js";
import type { Component } from "solid-js";
import Fuse from "fuse.js";

export type SearchItem = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

export const Search: Component<{ searchList: SearchItem[] }> = (props) => {
  /* eslint-disable-next-line solid/reactivity */
  const fuse = new Fuse(props.searchList, {
    keys: ["title", "excerpt"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.5
  });

  const [isFocus, setIsFocus] = createSignal(true);
  const [searchText, setSearchText] = createSignal("");
  const searchResults = createMemo(() =>
    searchText().length > 1 ? fuse.search(searchText()) : []
  );

  let input: HTMLInputElement | undefined = undefined;

  onMount(() => {
    // if URL has search query,
    // insert that search query in input field
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setSearchText(searchStr);

    // put focus cursor at the end of the string
    setTimeout(() => {
      if (input) input.selectionStart = input.selectionEnd = searchStr?.length || 0;
    }, 50);
  });

  createEffect(() => {
    if (searchText().length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", searchText());
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState(null, "", newRelativePathQuery);
    } else {
      history.pushState(null, "", window.location.pathname);
    }
  });

  return (
    <>
      <div
        class={`search h-14 w-full -mx-0.5 rounded-lg border-2 ${
          isFocus() && "focus border-brand/70 dark:border-blue-300/70"
        } ${!isFocus() && "border-transparent"}`}
      >
        <div
          class={`hstack h-full border rounded ${isFocus() && "border-transparent"} ${
            !isFocus() && "border-c-dark"
          }`}
        >
          <span w-12 h-full flex-center>
            <span class="icon i-uil:search w-5 h-5 text-c-lighter" />
          </span>
          <input
            ref={input}
            class="flex-1 h-full bg-transparent pr-2 placeholder:text-c-lighter focus:outline-none"
            placeholder="Search for articles ..."
            type="text"
            name="search"
            autocomplete="off"
            autofocus
            value={searchText()}
            onInput={(e) => setSearchText((e.target as HTMLInputElement).value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </div>
      </div>
      {searchText().length > 1 && (
        <div mt-8 text-c-light>
          Found {searchResults().length}
          {searchResults().length === 1 ? " result" : " results"} for "{searchText()}"
        </div>
      )}
      <ul p-0>
        <For each={searchResults()}>
          {({ item }) => (
            <div my-4>
              <p flex items-start my-1>
                <span class="w-16 mt-0.5" text="sm c-lighter">
                  {item.date}
                </span>
                <a href={`/posts/${item.slug}`}>{item.title}</a>
              </p>
              <p pl-16 my-1 text="sm c-light">
                {item.excerpt}...
              </p>
            </div>
          )}
        </For>
      </ul>
    </>
  );
};

export default Search;
