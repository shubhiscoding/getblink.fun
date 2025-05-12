"use client";
import LpForm from "@/components/form/lpForm";
import Preview from "@/components/preview/preview";
import { useState } from "react";
import { Footer } from "@/components/footer";

export default function Index() {
  const [icon, setIcon] = useState<string>('meteora.jpg');
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [mintAddress, setMintAddress] = useState<string>('');
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="flex flex-col md:min-h-screen">
      <div className="flex-1 flex flex-col md:flex-row items-center md:items-start md:justify-center gap-8 md:p-8">
        <LpForm
          mintAddress={mintAddress}
          setMintAddress={setMintAddress}
          showForm={showForm}
          setShowForm={setShowForm}
        />
        {showForm &&
        <Preview
          icon={icon || 'solana.jpg'}
          description={description || 'Your Description shows up here, Keep it short and simple'}
          title={title || "Your Title"}
        />}
      </div>
      <Footer />
    </div>
  );
}
