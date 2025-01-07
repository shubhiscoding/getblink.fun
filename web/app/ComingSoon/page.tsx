"use client";
import ComingSoonCard from "@/components/ComingSoon/coming-soon"
export default function Page(){
  return (
    <div style={{ display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: "100%" }}>
      <ComingSoonCard />
      <footer>Powered By Solana</footer>
    </div>
  )
}
