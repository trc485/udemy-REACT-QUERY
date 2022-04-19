import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Species } from "./Species";
import { fetchUrl } from "../helpers/fetchUrl";

const initialUrl = "https://swapi.dev/api/species/";

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery(
    "species",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    }
  );

  const loadMore = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {isFetching && <div className="loading">Loading ...</div>}
      <InfiniteScroll loadMore={loadMore} hasMore={hasNextPage}>
        {data.pages.map((page) =>
          page.results.map((species) => (
            <Species
              key={species.name}
              name={species.name}
              language={species.language}
              averageLifespan={species.averageLifespan}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
