import React, { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Box } from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // Ensure storage is imported

const InputForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    description: "",
    isStarred: false,
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.artist || !file) {
      alert("Title, Artist, and PDF file are required.");
      return;
    }

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `pdfs/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      // Save document in Firestore with the file URL
      await addDoc(collection(db, "musicSheets"), {
        ...formData,
        fileUrl,
        timestamp: serverTimestamp(),
      });

      setFormData({ title: "", artist: "", description: "", isStarred: false });
      setFile(null);
    } catch (error) {
      console.error("Error uploading file or adding document: ", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <TextField label="Title" name="title" value={formData.title} onChange={handleChange} required fullWidth />
      <TextField label="Artist" name="artist" value={formData.artist} onChange={handleChange} required fullWidth />
      <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth />
      <input type="file" accept="application/pdf" onChange={handleFileChange} required />
      <FormControlLabel
        control={<Checkbox name="isStarred" checked={formData.isStarred} onChange={handleChange} />}
        label="Star this entry"
      />
      <Button type="submit" variant="contained">Add Entry</Button>
    </Box>
  );
};

export default InputForm;
