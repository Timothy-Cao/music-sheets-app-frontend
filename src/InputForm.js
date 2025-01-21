import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { UploadFileOutlined } from "@mui/icons-material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

const InputForm = () => {
  const theme = useTheme(); // Access the current theme
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
      const storageRef = ref(storage, `pdfs/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        padding: 3,
        maxWidth: 500,
        margin: "auto",
        backgroundColor: theme.palette.background.paper, 
        boxShadow: theme.shadows[3], 
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.text.primary }} 
      >
        Upload sheets
      </Typography>
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Artist"
        name="artist"
        value={formData.artist}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            name="isStarred"
            checked={formData.isStarred}
            onChange={handleChange}
          />
        }
        label="Star this entry"
      />
      <Box>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileOutlined />}
          fullWidth
        >
          Upload PDF
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {file && (
          <Typography
            variant="body2"
            sx={{ marginTop: 1, color: theme.palette.text.secondary }}
          >
            Selected File: {file.name}
          </Typography>
        )}
      </Box>
      <Button type="submit" variant="contained" size="large">
        Add Entry
      </Button>
    </Box>
  );
};

export default InputForm;
