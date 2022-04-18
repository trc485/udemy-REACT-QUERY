import { useQuery, useMutation } from "react-query";
import { fetchComments, deletePost, updatePost } from "./services/posts";

export function PostDetail({ post }) {
  const { isLoading, isError, data, error } = useQuery(
    ["comments", post.id],
    () => fetchComments(post.id)
  );

  const deletePostMutation = useMutation((postId) => deletePost(postId));

  const updatePostMutation = useMutation((postId) => updatePost(postId));

  const renderComments = () => {
    if (isLoading) {
      return <span>Loading...</span>;
    }

    if (isError) {
      return <span>Error: {error.message}</span>;
    }

    return data.map((comment) => (
      <li key={comment.id}>
        {comment.email}: {comment.body}
      </li>
    ));
  };

  const renderDeleteMutationFeedback = () => {
    if (deletePostMutation.isLoading) {
      return <span>Deleting post...</span>;
    }

    if (deletePostMutation.isError) {
      return (
        <span style={{ color: "red" }}>
          Error deleting the post: {deletePostMutation.error.message}
        </span>
      );
    }

    if (deletePostMutation.isSuccess) {
      return <span style={{ color: "green" }}>Post deleted!</span>;
    }

    return null;
  };

  const renderUpdateMutationFeedback = () => {
    if (updatePostMutation.isLoading) {
      return <span>Updating post...</span>;
    }

    if (updatePostMutation.isError) {
      return (
        <span style={{ color: "red" }}>
          Error updating the post: {updatePostMutation.error.message}
        </span>
      );
    }

    if (updatePostMutation.isSuccess) {
      return <span style={{ color: "green" }}>Post Updated!</span>;
    }

    return null;
  };

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deletePostMutation.mutate(post.id)}>Delete</button>
      {renderDeleteMutationFeedback()}
      <button onClick={() => updatePostMutation.mutate(post.id)}>
        Update title
      </button>
      {renderUpdateMutationFeedback()}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {renderComments()}
    </>
  );
}
