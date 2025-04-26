import { FaHeart } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="py-4 border-t border-[var(--border-color)] bg-[rgba(30,41,59,0.2)]">
      <div className="container mx-auto flex justify-center items-center gap-2 text-[var(--text-secondary)]">
        <span>Made with</span>
        <FaHeart className="text-[var(--accent-primary)] animate-pulse" size={14} />
        <span>on</span>
        <span className="font-medium bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
          Solana
        </span>
      </div>
    </footer>
  );
}
