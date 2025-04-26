"use client";
import Form from "@/components/form/form";
import Preview from "@/components/preview/preview";
import { useState } from "react";
import { Footer } from "@/components/footer";

export default function Index() {
  const [icon, setIcon] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  return (
    <div className="flex flex-col md:min-h-screen">
      <div className="flex-1 flex flex-col md:flex-row items-center md:items-start md:justify-center gap-8 md:p-8">
        <Form
          icon={icon}
          setIcon={setIcon}
          label={label}
          setLabel={setLabel}
          description={description}
          setDescription={setDescription}
          title={title}
          setTitle={setTitle}
        />
        <Preview
          icon={icon || 'https://raw.githubusercontent.com/shubhiscoding/Blink-Generator/main/web/public/solana.jpg'}
          label={label || 'Your Label'}
          description={description || 'Your Description shows up here, Keep it short and simple'}
          title={title || "Your Title"}
        />
      </div>
      <Footer />
    </div>
  );
}
