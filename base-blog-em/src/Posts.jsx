import { useEffect } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";
import { fetchPosts } from "./services/posts";

const pageStart = 1;
const pageEnd = 10;
const pageSize = 10;
// we assume 100 total posts

export function Posts() {
  const [currentPage, setCurrentPage] = useState(pageStart);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error, isPreviousData } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage, pageSize),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  useEffect(() => {
    if (currentPage < pageEnd) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage, pageSize)
      );
    }
  }, [queryClient, currentPage]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage === pageStart}
          onClick={() => setCurrentPage((prevPage) => --prevPage)}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={isPreviousData || currentPage === pageEnd}
          onClick={() => setCurrentPage((prevPage) => ++prevPage)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
