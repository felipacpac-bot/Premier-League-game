type TopNavProps = {
  activePage: "game" | "about";
  onNavigate: (page: "game" | "about") => void;
};

export function TopNav({ activePage, onNavigate }: TopNavProps) {
  return (
    <nav className="top-nav" aria-label="Main navigation">
      <button
        className={activePage === "game" ? "active" : ""}
        onClick={() => onNavigate("game")}
      >
        Premier League Sim
      </button>
      <button
        className={activePage === "about" ? "active" : ""}
        onClick={() => onNavigate("about")}
      >
        About
      </button>
    </nav>
  );
}
