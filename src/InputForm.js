import React, { useState, useEffect } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography, useTheme } from "@mui/material";
import { UploadFileOutlined } from "@mui/icons-material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const InputForm = () => {
  const theme = useTheme();
  const [user] = useAuthState(auth); 
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    description: "",
    isStarred: false,
    numPages: 0, 
  });
  const [file, setFile] = useState(null);
  const [pdfjsLib, setPdfjsLib] = useState(null);

  // Load pdfjs-dist from a CDN
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.min.js";
    script.onload = () => {
      // Set the worker source to the CDN URL
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js";
      setPdfjsLib(window.pdfjsLib);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);
  
    if (file && pdfjsLib) {
      try {
        console.log("File selected:", file.name);
  
        const title = file.name
          .replace(/_/g, " ") 
          .replace(/.pdf$/i, ""); 
  
        console.log("Extracted title from file name:", title);
  
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        console.log("PDF loaded successfully. Number of pages:", numPages);
  
        setFormData((prevData) => ({
          ...prevData,
          title: title || prevData.title,
          numPages,
        }));
      } catch (error) {
        console.error("Error parsing PDF:", error);
      }
    }
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
        uploadedBy: user?.displayName || "Anonymous",
      });

      setFormData({ title: "", artist: "", description: "", isStarred: false, numPages: 0 });
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
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.shadows[3],
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
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
          <Checkbox name="isStarred" checked={formData.isStarred} onChange={handleChange} />
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
          <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
        </Button>
        {file && (
          <Typography variant="body2" sx={{ marginTop: 1, color: theme.palette.text.secondary }}>
            Selected File: {file.name} (Pages: {formData.numPages})
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