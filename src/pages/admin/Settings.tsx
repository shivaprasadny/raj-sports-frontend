import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import SaveIcon from '@mui/icons-material/Save';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import { AuthService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';

// ─── localStorage keys ────────────────────────────────────────────────────────

// Store configuration key.
const STORAGE_KEY = 'rajsports_admin_settings';
// Promotions key — read by SpecialOffersSection on the homepage.
const PROMOTIONS_KEY = 'rajsports_promotions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  phone: string;
  address: string;
  defaultTaxRate: string;
  defaultShippingFee: string;
  orderPageSize: string;
  lowStockAlertThreshold: string;
}

export interface PromoData {
  title: string;
  subtitle: string;
  buttonText: string;
  background?: string;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

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

const DEFAULT_PROMOS: PromoData[] = [
  {
    title: 'End of Season Sale',
    subtitle: 'Up to 40% off on premium cricket bats',
    buttonText: 'Shop Bats',
    background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh protective gear just landed',
    buttonText: "See What's New",
    background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
  },
  {
    title: 'Bundle & Save',
    subtitle: 'Complete kit sets starting from $199',
    buttonText: 'View Bundles',
    background: 'linear-gradient(135deg, #E65100 0%, #BF360C 100%)',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const loadFromStorage = (): StoreSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<StoreSettings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

const loadPromotions = (): PromoData[] => {
  try {
    const raw = localStorage.getItem(PROMOTIONS_KEY);
    if (!raw) return DEFAULT_PROMOS.map((p) => ({ ...p }));
    const parsed = JSON.parse(raw) as Partial<PromoData>[];
    return DEFAULT_PROMOS.map((def, i) => ({ ...def, ...parsed[i] }));
  } catch {
    return DEFAULT_PROMOS.map((p) => ({ ...p }));
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
    {children}
  </Typography>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [promos, setPromos] = useState<PromoData[]>(DEFAULT_PROMOS);

  // Reset password dialog state.
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState('');

  useEffect(() => {
    setSettings(loadFromStorage());
    setPromos(loadPromotions());
  }, []);

  // ── Settings handlers ──────────────────────────────────────────────────────

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

  // ── Promotions handlers ────────────────────────────────────────────────────

  const updatePromo = (index: number, field: keyof PromoData, value: string) => {
    setPromos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSavePromos = () => {
    try {
      localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promos));
      toast.success('Promotional banners saved. Changes are live on the homepage.');
    } catch {
      toast.error('Failed to save promotions.');
    }
  };

  // ── Reset with password verification ──────────────────────────────────────

  const openResetDialog = () => {
    setResetPassword('');
    setResetPasswordError('');
    setResetDialogOpen(true);
  };

  const handleResetConfirm = async () => {
    if (!resetPassword.trim()) {
      setResetPasswordError('Password is required.');
      return;
    }
    if (!user?.email) {
      setResetPasswordError('Cannot determine current user. Please log out and back in.');
      return;
    }

    setResetLoading(true);
    setResetPasswordError('');

    try {
      // Verify the password by attempting a real login with the current user's email.
      // This ensures only someone who knows the password can reset all settings.
      await AuthService.login({ email: user.email, password: resetPassword });

      // Password correct — proceed with reset.
      setSettings({ ...DEFAULT_SETTINGS });
      setPromos(DEFAULT_PROMOS.map((p) => ({ ...p })));
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PROMOTIONS_KEY);

      setResetDialogOpen(false);
      toast.success('Settings and promotions reset to defaults.');
    } catch {
      setResetPasswordError('Incorrect password. Settings were not reset.');
    } finally {
      setResetLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Store configuration, promotions, and admin preferences.
          </Typography>
        </Box>
        <PrimaryButton startIcon={<SaveIcon />} onClick={handleSave}>
          Save Settings
        </PrimaryButton>
      </Box>

      <Grid container spacing={3}>
        {/* ── Store Information ────────────────────────────────────────── */}
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

        {/* ── Contact Information ──────────────────────────────────────── */}
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

        {/* ── Tax and Shipping ─────────────────────────────────────────── */}
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
                slotProps={{ htmlInput: { min: 0, max: 100, step: 0.001 }, input: { endAdornment: <InputAdornment position="end">%</InputAdornment> } }}
                helperText="Applied to orders at checkout."
              />
              <TextField
                label="Default Shipping Fee ($)"
                type="number"
                fullWidth
                size="small"
                value={settings.defaultShippingFee}
                onChange={update('defaultShippingFee')}
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                helperText="Flat rate applied when no shipping rule matches."
              />
            </Box>
          </Paper>
        </Grid>

        {/* ── Admin Preferences ────────────────────────────────────────── */}
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
                slotProps={{ htmlInput: { min: 5, max: 200 } }}
                helperText="How many orders to load per page in the Orders list."
              />
              <TextField
                label="Low Stock Alert Threshold"
                type="number"
                fullWidth
                size="small"
                value={settings.lowStockAlertThreshold}
                onChange={update('lowStockAlertThreshold')}
                slotProps={{ htmlInput: { min: 0 } }}
                helperText="Products at or below this quantity appear as Low Stock."
              />
            </Box>
          </Paper>
        </Grid>

        {/* ── Promotional Banners ──────────────────────────────────────── */}
        <Grid size={{ xs: 12 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 0.5 }}>
              <CampaignIcon color="primary" />
              <SectionTitle>Promotional Banners</SectionTitle>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              These banners appear in the "Special Offers" section on the homepage.
              Changes take effect after clicking Save Promotions.
            </Typography>

            <Grid container spacing={3}>
              {promos.map((promo, index) => (
                <Grid key={index} size={{ xs: 12, md: 4 }}>
                  {/* Colour strip to show which banner this is */}
                  <Box
                    sx={{
                      background: promo.background ?? '#1565C0',
                      borderRadius: '8px 8px 0 0',
                      height: 6,
                    }}
                  />
                  <Paper
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderTop: 'none',
                      borderRadius: '0 0 8px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      BANNER {index + 1}
                    </Typography>
                    <TextField
                      label="Title"
                      fullWidth
                      size="small"
                      value={promo.title}
                      onChange={(e) => updatePromo(index, 'title', e.target.value)}
                    />
                    <TextField
                      label="Subtitle"
                      fullWidth
                      size="small"
                      value={promo.subtitle}
                      onChange={(e) => updatePromo(index, 'subtitle', e.target.value)}
                    />
                    <TextField
                      label="Button Text"
                      fullWidth
                      size="small"
                      value={promo.buttonText}
                      onChange={(e) => updatePromo(index, 'buttonText', e.target.value)}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <PrimaryButton startIcon={<CampaignIcon />} onClick={handleSavePromos}>
                Save Promotions
              </PrimaryButton>
            </Box>
          </Paper>
        </Grid>

        {/* ── Danger Zone ──────────────────────────────────────────────── */}
        <Grid size={{ xs: 12 }}>
          <Paper
            variant="outlined"
            sx={{ p: 3, borderColor: 'error.light', bgcolor: 'rgba(211,47,47,0.04)' }}
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
                  Clears all saved settings and promotions, and restores factory defaults.
                  You must confirm your password to proceed.
                </Typography>
              </Box>
              <PrimaryButton color="error" onClick={openResetDialog} size="small">
                Reset Defaults
              </PrimaryButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Bottom save button ───────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <PrimaryButton startIcon={<SaveIcon />} onClick={handleSave} size="large">
          Save Settings
        </PrimaryButton>
      </Box>

      {/* ── Reset confirmation dialog ────────────────────────────────────── */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => !resetLoading && setResetDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Confirm Password to Reset</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your current admin password to reset all settings and promotions to their
            factory defaults. This action cannot be undone.
          </Typography>
          <TextField
            autoFocus
            label="Current Password"
            type="password"
            fullWidth
            size="small"
            value={resetPassword}
            onChange={(e) => {
              setResetPassword(e.target.value);
              setResetPasswordError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleResetConfirm();
            }}
            error={Boolean(resetPasswordError)}
            helperText={resetPasswordError}
            disabled={resetLoading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <PrimaryButton
            variant="outlined"
            color="inherit"
            onClick={() => setResetDialogOpen(false)}
            disabled={resetLoading}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            color="error"
            onClick={handleResetConfirm}
            loading={resetLoading}
          >
            {resetLoading ? 'Verifying…' : 'Confirm Reset'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
