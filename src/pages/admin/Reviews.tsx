import { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import ReviewService from "../../services/ReviewService";
import type { Review } from "../../types/review";

type Filter = "all" | "pending";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await ReviewService.getAllReviews(filter, 0, 100);
      setReviews(page.content);
    } catch {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleApprove = async (reviewId: number) => {
    try {
      await ReviewService.approveReview(reviewId);
      toast.success("Review approved.");
      loadReviews();
    } catch {
      toast.error("Could not approve review.");
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      await ReviewService.deleteReview(reviewId);
      toast.success("Review deleted.");
      loadReviews();
    } catch {
      toast.error("Could not delete review.");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Reviews
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} label="Filter" onChange={(e) => setFilter(e.target.value as Filter)}>
            <MenuItem value="all">All Reviews</MenuItem>
            <MenuItem value="pending">Pending Approval</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">No reviews found.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Review</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 160 }} noWrap>
                      {review.productName ?? `Product #${review.productId}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{review.userName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.userEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Rating value={review.rating} size="small" readOnly />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 240 }}>
                    {review.title && (
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {review.title}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {review.comment}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={review.isApproved ? "Approved" : "Pending"}
                      color={review.isApproved ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                      {!review.isApproved && (
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(review.id)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(review.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminReviews;
