// App.jsx — root component, client-side routing, ReactDOM bootstrap

function App() {
  const { useState, useEffect } = React;
  const [page, setPage] = useState("home");

  // seed demo data once on first load
  useEffect(() => {
    window.seedDemoData();
  }, []);

  // scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  function renderPage() {
    switch (page) {
      case "home":     return <HomePage     setPage={setPage} />;
      case "ai-expo":  return <AIExpoPage   setPage={setPage} />;
      case "gaming":   return <GamingPage   setPage={setPage} />;
      case "submit":   return <SubmitPage   setPage={setPage} />;
      case "register": return <RegisterPage setPage={setPage} />;
      case "admin":    return <AdminPage />;
      default:         return <HomePage     setPage={setPage} />;
    }
  }

  return (
    <div>
      <Nav page={page} setPage={setPage} />
      {renderPage()}
      <Footer setPage={setPage} />
    </div>
  );
}

// Bootstrap
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
