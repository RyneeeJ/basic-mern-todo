function ErrorPage({ error }) {
  return (
    <div>
      <p>Something went wrongggggg</p>
      <p>{error.response.data.message}</p>
    </div>
  );
}

export default ErrorPage;
