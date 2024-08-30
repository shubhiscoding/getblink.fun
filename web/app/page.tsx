"use client";
import Form from "@/components/form/form";
import Preview from "@/components/preview/preview";
import { useState } from "react";

export default function Index() {
  const [icon, setIcon] = useState<string>('https://www.vegrecipesofindia.com/wp-content/uploads/2018/02/cafe-style-hot-coffee-recipe-1.jpg');
  const [label, setLabel] = useState<string>('your label');
  const [description, setDescription] = useState<string>('your description');
  const [title, setTitle] = useState<string>('your title');

  return (
    <div className="main">
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
        icon={icon || 'https://www.vegrecipesofindia.com/wp-content/uploads/2018/02/cafe-style-hot-coffee-recipe-1.jpg'}
        label={label || 'your label'}
        description={description || 'your description'}
        title={title || 'your title'}
      />
    </div>
  );
}
