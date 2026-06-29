import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import toast from "react-hot-toast";
import MarketingService from "../../services/MarketingService";
import StorageService from "../../services/StorageService";
import type { BannerRequest, BannerType, MarketingBanner, SectionSetting } from "../../types/marketing";

// ─── shared helpers ──────────────────────────────────────────────────────────

const BANNER_TYPES: BannerType[] = [
  "HERO",
  "SPECIAL_OFFER",
  "ADVERTISEMENT_1",
  "ADVERTISEMENT_2",
  "NEWSLETTER",
  "GENERAL_PROMO",
];

const EMPTY_BANNER: BannerRequest = {
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  buttonText: "",
  buttonLink: "",
  bannerType: "HERO",
  displayOrder: 0,
  isActive: true,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

// ─── Banner tab ──────────────────────────────────────────────────────────────

interface BannerTabProps {
  filterType: BannerType;
  allBanners: MarketingBanner[];
  onRefresh: () => void;
}

const BannerTab = ({ filterType, allBanners, onRefresh }: BannerTabProps) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MarketingBanner | null>(null);
  const [form, setForm] = useState<BannerRequest>({ ...EMPTY_BANNER, bannerType: filterType });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const banners = allBanners.filter((b) => b.bannerType === filterType);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_BANNER, bannerType: filterType });
    setOpen(true);
  };

  const openEdit = (b: MarketingBanner) => {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle ?? "",
      description: b.description ?? "",
      imageUrl: b.imageUrl ?? "",
      buttonText: b.buttonText ?? "",
      buttonLink: b.buttonLink ?? "",
      bannerType: b.bannerType,
      displayOrder: b.displayOrder,
      isActive: b.isActive,
      startDate: b.startDate ?? "",
      endDate: b.endDate ?? "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    try {
      const payload: BannerRequest = {
        ...form,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };
      if (editing) {
        await MarketingService.updateBanner(editing.id, payload);
        toast.success("Banner updated.");
      } else {
        await MarketingService.createBanner(payload);
        toast.success("Banner created.");
      }
      setOpen(false);
      onRefresh();
    } catch {
      toast.error("Failed to save banner.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await MarketingService.deleteBanner(id);
      toast.success("Banner deleted.");
      onRefresh();
    } catch {
      toast.error("Failed to delete banner.");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await MarketingService.toggleBannerActive(id);
      onRefresh();
    } catch {
      toast.error("Failed to toggle banner.");
    }
  };

  const set = (field: keyof BannerRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await StorageService.upload(file, "banners");
      setForm((prev) => ({ ...prev, imageUrl: result.imageUrl }));
      toast.success("Image uploaded.");
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}>
          Add Banner
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {banners.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No banners for this type yet.
              </TableCell>
            </TableRow>
          )}
          {banners.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>{b.title}</Typography>
                {b.subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {b.subtitle}
                  </Typography>
                )}
              </TableCell>
              <TableCell>{b.displayOrder}</TableCell>
              <TableCell>
                <Chip
                  label={b.isActive ? "Active" : "Inactive"}
                  color={b.isActive ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Toggle active">
                  <IconButton size="small" onClick={() => handleToggle(b.id)}>
                    <ToggleOnIcon color={b.isActive ? "success" : "action"} />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={() => openEdit(b)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(b.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? "Edit Banner" : "Add Banner"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField label="Title" fullWidth required value={form.title} onChange={set("title")} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Subtitle" fullWidth value={form.subtitle} onChange={set("subtitle")} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={set("description")}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                <TextField
                  label="Image URL"
                  fullWidth
                  placeholder="/uploads/banners/file.jpg or https://..."
                  value={form.imageUrl}
                  onChange={set("imageUrl")}
                  helperText="Paste a URL directly or click Upload to choose a file"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outlined"
                  startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  sx={{ height: 56, whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  {uploading ? "Uploading…" : "Upload"}
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Button Text" fullWidth value={form.buttonText} onChange={set("buttonText")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Button Link" fullWidth placeholder="/products" value={form.buttonLink} onChange={set("buttonLink")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Banner Type</InputLabel>
                <Select
                  label="Banner Type"
                  value={form.bannerType}
                  onChange={(e) => setForm((prev) => ({ ...prev, bannerType: e.target.value as BannerType }))}
                >
                  {BANNER_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Display Order"
                type="number"
                fullWidth
                value={form.displayOrder ?? 0}
                onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isActive ?? true}
                    onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Active"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={form.startDate ?? ""}
                onChange={set("startDate")}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={form.endDate ?? ""}
                onChange={set("endDate")}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ─── Homepage Sections tab ────────────────────────────────────────────────────

interface SectionTabProps {
  sections: SectionSetting[];
  onRefresh: () => void;
}

const HomepageSectionsTab = ({ sections, onRefresh }: SectionTabProps) => {
  const [editing, setEditing] = useState<SectionSetting | null>(null);
  const [form, setForm] = useState<Partial<SectionSetting>>({});
  const [open, setOpen] = useState(false);

  const openEdit = (s: SectionSetting) => {
    setEditing(s);
    setForm({ ...s });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      await MarketingService.updateSection(editing.id, {
        sectionKey: form.sectionKey ?? editing.sectionKey,
        sectionTitle: form.sectionTitle,
        sectionSubtitle: form.sectionSubtitle,
        isVisible: form.isVisible ?? true,
        displayOrder: form.displayOrder ?? 0,
        maxItems: form.maxItems ?? 8,
      });
      toast.success("Section updated.");
      setOpen(false);
      onRefresh();
    } catch {
      toast.error("Failed to update section.");
    }
  };

  const set = (field: keyof SectionSetting) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Section Key</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Max Items</TableCell>
            <TableCell>Visible</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sections.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                  {s.sectionKey}
                </Typography>
              </TableCell>
              <TableCell>{s.sectionTitle ?? "—"}</TableCell>
              <TableCell>{s.displayOrder}</TableCell>
              <TableCell>{s.maxItems}</TableCell>
              <TableCell>
                <Chip
                  label={s.isVisible ? "Visible" : "Hidden"}
                  color={s.isVisible ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => openEdit(s)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {sections.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No sections found. They will be seeded on next server startup.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Section — {editing?.sectionKey}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Section Title"
                fullWidth
                value={form.sectionTitle ?? ""}
                onChange={set("sectionTitle")}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Section Subtitle"
                fullWidth
                value={form.sectionSubtitle ?? ""}
                onChange={set("sectionSubtitle")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Display Order"
                type="number"
                fullWidth
                value={form.displayOrder ?? 0}
                onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Max Items"
                type="number"
                fullWidth
                value={form.maxItems ?? 8}
                onChange={(e) => setForm((prev) => ({ ...prev, maxItems: Number(e.target.value) }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isVisible ?? true}
                    onChange={(e) => setForm((prev) => ({ ...prev, isVisible: e.target.checked }))}
                  />
                }
                label="Visible on homepage"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ─── Main Marketing page ──────────────────────────────────────────────────────

const Marketing = () => {
  const [tab, setTab] = useState(0);
  const [banners, setBanners] = useState<MarketingBanner[]>([]);
  const [sections, setSections] = useState<SectionSetting[]>([]);

  const loadAll = async () => {
    try {
      const [bannerPage, sectionList] = await Promise.all([
        MarketingService.getAllBanners(0, 100),
        MarketingService.getAllSections(),
      ]);
      setBanners(bannerPage.content);
      setSections(sectionList);
    } catch {
      toast.error("Failed to load marketing data.");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Marketing & Homepage Management
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}
      >
        <Tab label="Hero Banner" />
        <Tab label="Special Offers" />
        <Tab label="Advertisement Banners" />
        <Tab label="Homepage Sections" />
        <Tab label="Newsletter" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <BannerTab filterType="HERO" allBanners={banners} onRefresh={loadAll} />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <BannerTab filterType="SPECIAL_OFFER" allBanners={banners} onRefresh={loadAll} />
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Advertisement Banner #1
        </Typography>
        <BannerTab filterType="ADVERTISEMENT_1" allBanners={banners} onRefresh={loadAll} />
        <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
          Advertisement Banner #2
        </Typography>
        <BannerTab filterType="ADVERTISEMENT_2" allBanners={banners} onRefresh={loadAll} />
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <HomepageSectionsTab sections={sections} onRefresh={loadAll} />
      </TabPanel>

      <TabPanel value={tab} index={4}>
        <BannerTab filterType="NEWSLETTER" allBanners={banners} onRefresh={loadAll} />
      </TabPanel>
    </Box>
  );
};

export default Marketing;
