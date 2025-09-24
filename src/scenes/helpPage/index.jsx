import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  TextareaAutosize,
  Grid,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../navbar";

const faqs = [
  {
    question: "How do I send a message?",
    answer: "Go to the chat page, select a contact, and type your message.",
  },
  {
    question: "How do I reset my password?",
    answer: "Go to Settings > Account > Reset Password.",
  },
  {
    question: "How do I report a bug?",
    answer: "Contact support at support@example.com.",
  },
  {
    question: "How do I change my profile picture?",
    answer: "Go to Settings > Profile > Upload new picture.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, go to Settings > Account > Delete Account. This action is irreversible.",
  },
  {
    question: "How do I enable notifications?",
    answer: "Go to Settings > Notifications and toggle the options as needed.",
  },
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = () => {
    // Simulate form submission
    console.log({ contactName, contactEmail, contactMessage });
    setSubmitted(true);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <Box>
      <Navbar />
      <Box m={3}>
        <Typography variant="h3" gutterBottom>
          Help Center
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to the Help Page! Find answers to frequently asked questions,
          or contact our support team.
        </Typography>

        {/* Search FAQs */}
        <Box my={3}>
          <TextField
            fullWidth
            label="Search FAQs"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        {/* FAQs Section */}
        <Box mt={2}>
          <Typography variant="h5" gutterBottom>
            Frequently Asked Questions
          </Typography>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No FAQs matched your search.
            </Typography>
          )}
        </Box>

        {/* Popular Guides Section */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom align="center" // Center the text
    sx={{ mb: 2 }} >
            Popular Guides
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  Getting Started with Messaging
                </Typography>
                <Typography variant="body2">
                  Learn how to send and receive messages effectively.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  Managing Your Account
                </Typography>
                <Typography variant="body2">
                  Tips on changing passwords, updating profile, and more.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Contact Support Form */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom align="center" // Center the text
    sx={{ mb: 2 }}>
            Contact Support
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} maxWidth="1000px" mx="auto">
            <TextField
              label="Name"
              variant="outlined"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <TextareaAutosize
              minRows={4}
              placeholder="Message"
              style={{
                padding: "10px",
                borderRadius: "5px",
                borderColor: "#ccc",
              }}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
            />
            <Button
              variant="contained"
              style={{marginBottom:"20px"}}
              onClick={handleContactSubmit}
              disabled={!contactName || !contactEmail || !contactMessage}
            >
              Submit
            </Button>
            {submitted && (
              <Typography color="primary" variant="body2">
                Your message has been sent successfully!
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HelpPage;
