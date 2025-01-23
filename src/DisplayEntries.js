import React, { useState, useEffect } from "react";
import { Box,  TextField,  Button,  Typography,  Link,  IconButton,  Card,  CardContent,  CardActions,  Grid, } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const DisplayEntries = ({ isSmallScreen }) => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEntries = async () => {
    try {
      const q = query(
        collection(db, "musicSheets"),
        orderBy("isStarred", "desc"),
        orderBy("title", "asc"),
        limit(20)
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
      <Grid container spacing={2}>
        {entries
          .filter((entry) =>
            ["title", "artist", "description"].some((field) =>
              entry[field]?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
          .map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {entry.isStarred && <StarIcon sx={{ color: "gold", fontSize: 28 }} />}
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {entry.title}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ color: "text.secondary", marginTop: 1 }}>
                    by {entry.artist}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", marginTop: 1 }}>
                    {entry.description || "No description"}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", padding: 2 }}>
                  <Box>
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
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default DisplayEntries;