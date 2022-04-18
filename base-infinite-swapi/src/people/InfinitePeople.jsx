import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Person } from "./Person";
import { fetchUrl } from "../helpers/fetchUrl";

const initialUrl = "https://swapi.dev/api/people/?page=1";

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery(
    "people",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    }
  );

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {isFetching && <div className="loading">Loading ...</div>}
      <InfiniteScroll
        loadMore={fetchNextPage}
        hasMore={!isFetchingNextPage && hasNextPage}
      >
        {data.pages.map((page) =>
          page.results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hairColor}
              eyeColor={person.eyeColor}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
