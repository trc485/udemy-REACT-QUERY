export const fetchUrl = async (url) => {
  if (!url) {
    throw new Error("No url provided");
  }
  const response = await fetch(url);
  return response.json();
};
