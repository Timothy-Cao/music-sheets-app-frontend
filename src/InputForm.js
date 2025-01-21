import React, { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Box } from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const InputForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    fileLink: "",
    description: "",
    isStarred: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.artist || !formData.fileLink) {
      alert("Title, Artist, and File Link are required.");
      return;
    }
    try {
      await addDoc(collection(db, "musicSheets"), {
        ...formData,
        timestamp: serverTimestamp(),
      });
      setFormData({ title: "", artist: "", fileLink: "", description: "", isStarred: false });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <TextField label="Title" name="title" value={formData.title} onChange={handleChange} required fullWidth />
      <TextField label="Artist" name="artist" value={formData.artist} onChange={handleChange} required fullWidth />
      <TextField label="File Link" name="fileLink" value={formData.fileLink} onChange={handleChange} required fullWidth />
      <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth />
      <FormControlLabel
        control={<Checkbox name="isStarred" checked={formData.isStarred} onChange={handleChange} />}
        label="Star this entry"
      />
      <Button type="submit" variant="contained">Add Entry</Button>
    </Box>
  );
};

export default InputForm;
