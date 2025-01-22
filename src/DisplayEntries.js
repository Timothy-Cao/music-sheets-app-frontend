import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const DisplayEntries = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEntries = async () => {
    try {
      const q = query(
        collection(db, "musicSheets"),
        orderBy("isStarred", "desc"),
        orderBy("title", "asc"),
      );
      const querySnapshot = await getDocs(q);
      const fetchedEntries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries: ", error.message);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSearch = () => {
    fetchEntries();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
        <Button onClick={handleSearch} variant="contained">
          Refresh
        </Button>
        <TextField
          label="Search"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <List>
        {entries
          .filter((entry) =>
            ["title", "artist", "description"].some((field) =>
              entry[field]?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
          .map((entry) => (
            <ListItem
              key={entry.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                {entry.isStarred && <StarIcon sx={{ color: "gold", fontSize: 28 }} />}
                
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {entry.title} - {entry.artist}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {entry.description || "No description"}
                    </Typography>
                  }
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2">
                    Uploaded by: {entry.uploadedBy || "Guest"}
                  </Typography>
                  <Typography variant="body2">
                    {entry.timestamp?.toDate
                      ? new Date(entry.timestamp.toDate()).toLocaleDateString()
                      : "Unknown Date"}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {entry.numPages || "?"} pages
                </Typography>
                
                <IconButton
                  component={Link}
                  href={entry.fileUrl}
                  target="_blank"
                  rel="noopener"
                  color="primary"
                  size="large"
                  aria-label="View PDF"
                >
                  <PictureAsPdfIcon sx={{ fontSize: 36 }} />
                </IconButton>
              </Box>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default DisplayEntries;