function ErrorPage({ error }) {
  return (
    <div>
      <p>Something went wrongggggg</p>
      <p>{error.message}</p>
    </div>
  );
}

export default ErrorPage;
