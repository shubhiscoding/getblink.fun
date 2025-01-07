import { HeartHandshakeIcon } from "lucide-react";

export function Footer() {
  return (
    <footer>
      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3px', marginRight: '3px' }}>
      Powered By <HeartHandshakeIcon width={14} />
      </span>
      Solana
    </footer>
  );
}
