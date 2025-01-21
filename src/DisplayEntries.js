import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const DisplayEntries = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEntries = async () => {
    try {
      const q = query(collection(db, "musicSheets"), orderBy("isStarred", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      const fetchedEntries = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries: ", error);
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
      <TextField
        label="Search"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button onClick={handleSearch} variant="contained" sx={{ marginTop: 2 }}>Search</Button>
      <List>
        {entries
          .filter((entry) =>
            ["title", "artist", "fileLink", "description"].some((field) =>
              entry[field]?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
          .map((entry) => (
            <ListItem key={entry.id}>
              <ListItemIcon>{entry.isStarred && <StarIcon sx={{ color: "gold" }} />}</ListItemIcon>
              <ListItemText
                primary={`${entry.title} - ${entry.artist}`}
                secondary={entry.description || "No description provided."}
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default DisplayEntries;