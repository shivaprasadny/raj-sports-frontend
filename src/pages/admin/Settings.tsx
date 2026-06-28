import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Alert,
  Box,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';

// ─── localStorage persistence ─────────────────────────────────────────────────
//
// Settings are saved to localStorage under this key.
// TODO: Replace with a backend settings API when available.
//       Suggested endpoint:
//         GET  /api/admin/settings          → load store settings
//         PUT  /api/admin/settings          → save store settings
//       The backend can store settings in a key-value config table.
//
const STORAGE_KEY = 'rajsports_admin_settings';

// Shape of the persisted settings object.
interface StoreSettings {
  // Store information
  storeName: string;
  tagline: string;
  // Contact details
  supportEmail: string;
  phone: string;
  address: string;
  // Tax and shipping
  defaultTaxRate: string;   // stored as string to allow empty/decimal input
  defaultShippingFee: string;
  // Admin preferences
  orderPageSize: string;
  lowStockAlertThreshold: string;
}

// Default values applied when no settings are saved yet.
const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Raj Sports',
  tagline: 'Cricket equipment for every player.',
  supportEmail: 'support@rajsports.com',
  phone: '+1 (212) 555-0182',
  address: '42 Cricket Lane, Queens, New York, NY 11354',
  defaultTaxRate: '8.875',
  defaultShippingFee: '9.99',
  orderPageSize: '25',
  lowStockAlertThreshold: '5',
};

// Loads settings from localStorage, merging over the defaults so missing keys
// (added in future versions) always have a fallback value.
const loadFromStorage = (): StoreSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<StoreSettings>) };
  } catch {
    // If localStorage is unavailable or the stored JSON is corrupt, use defaults.
    return { ...DEFAULT_SETTINGS };
  }
};

// ─── Section heading component ────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
    {children}
  </Typography>
);

// ─── Component ───────────────────────────────────────────────────────────────

// Settings allows admins to configure store-wide values.
// All data is currently persisted to localStorage.
// When a backend settings endpoint is added, replace loadFromStorage() and
// handleSave() with API calls — the form fields stay unchanged.
const Settings = () => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  // Load persisted settings on mount.
  useEffect(() => {
    setSettings(loadFromStorage());
  }, []);

  // Partial update helper — merges one field into the settings object.
  const update = (field: keyof StoreSettings) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setSettings((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast.success('Settings saved.');
    } catch {
      toast.error('Failed to save settings. localStorage may be unavailable.');
    }
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Settings reset to defaults.');
  };

  return (
    <Box>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Store configuration and admin preferences.
          </Typography>
        </Box>
        <PrimaryButton startIcon={<SaveIcon />} onClick={handleSave}>
          Save Settings
        </PrimaryButton>
      </Box>

      {/* ── Backend notice ────────────────────────────────────────────────── */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Settings are currently saved in your browser's localStorage.
        Add <code>GET/PUT /api/admin/settings</code> on the backend to persist them server-side.
      </Alert>

      <Grid container spacing={3}>
        {/* ── Store Information ──────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <SectionTitle>Store Information</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Store Name"
                fullWidth
                size="small"
                value={settings.storeName}
                onChange={update('storeName')}
              />
              <TextField
                label="Tagline"
                fullWidth
                size="small"
                value={settings.tagline}
                onChange={update('tagline')}
                helperText="Shown in the footer and marketing sections."
              />
            </Box>
          </Paper>
        </Grid>

        {/* ── Contact Information ────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <SectionTitle>Contact Information</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Support Email"
                type="email"
                fullWidth
                size="small"
                value={settings.supportEmail}
                onChange={update('supportEmail')}
              />
              <TextField
                label="Phone"
                fullWidth
                size="small"
                value={settings.phone}
                onChange={update('phone')}
              />
              <TextField
                label="Store Address"
                fullWidth
                size="small"
                multiline
                rows={2}
                value={settings.address}
                onChange={update('address')}
              />
            </Box>
          </Paper>
        </Grid>

        {/* ── Tax and Shipping ───────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <SectionTitle>Tax &amp; Shipping</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Default Tax Rate"
                type="number"
                fullWidth
                size="small"
                value={settings.defaultTaxRate}
                onChange={update('defaultTaxRate')}
                inputProps={{ min: 0, max: 100, step: 0.001 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                helperText="Applied to orders at checkout."
              />
              <TextField
                label="Default Shipping Fee"
                type="number"
                fullWidth
                size="small"
                value={settings.defaultShippingFee}
                onChange={update('defaultShippingFee')}
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                helperText="Flat rate applied when no shipping rule matches."
              />
            </Box>
          </Paper>
        </Grid>

        {/* ── Admin Preferences ─────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <SectionTitle>Admin Preferences</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Orders Per Page"
                type="number"
                fullWidth
                size="small"
                value={settings.orderPageSize}
                onChange={update('orderPageSize')}
                inputProps={{ min: 5, max: 200 }}
                helperText="How many orders to load per page in the Orders list."
              />
              <TextField
                label="Low Stock Alert Threshold"
                type="number"
                fullWidth
                size="small"
                value={settings.lowStockAlertThreshold}
                onChange={update('lowStockAlertThreshold')}
                inputProps={{ min: 0 }}
                helperText="Products at or below this quantity appear as Low Stock."
              />
            </Box>
          </Paper>
        </Grid>

        {/* ── Danger Zone ───────────────────────────────────────────────── */}
        <Grid size={{ xs: 12 }}>
          <Paper
            variant="outlined"
            sx={{ p: 3, borderColor: 'error.light', bgcolor: 'error.50' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'error.main', mb: 1 }}>
              Danger Zone
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Reset to Default Settings
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Clears all saved settings and restores factory defaults.
                </Typography>
              </Box>
              <PrimaryButton color="error" onClick={handleReset} size="small">
                Reset Defaults
              </PrimaryButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Bottom save button for long-form convenience ─────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <PrimaryButton startIcon={<SaveIcon />} onClick={handleSave} size="large">
          Save Settings
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default Settings;
