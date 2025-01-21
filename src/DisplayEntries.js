import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
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
        orderBy("title", "asc"), // 2ndary order by title
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const fetchedEntries = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
        <Button onClick={handleSearch} variant="contained">Refresh</Button>
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
            <ListItem key={entry.id}>
              <ListItemIcon>{entry.isStarred && <StarIcon sx={{ color: "gold" }} />}</ListItemIcon>
              <ListItemText
                primary={`${entry.title} - ${entry.artist}`}
                secondary={
                  <>
                    {entry.description || "No description provided."}
                    <br />
                    <Link href={entry.fileUrl} target="_blank" rel="noopener">
                      View PDF
                    </Link>
                  </>
                }
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default DisplayEntries;
