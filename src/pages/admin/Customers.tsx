import { useCallback, useEffect, useRef, useState } from "react";
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DataTable from "../../components/common/tables/DataTable";
import StatusChip from "../../components/common/chips/StatusChip";
import TablePagination from "@mui/material/TablePagination";
import AdminUserService from "../../services/AdminUserService";
import type { AdminUser, UserRole } from "../../services/AdminUserService";
import toast from "react-hot-toast";

const ROLE_OPTIONS: { label: string; value: UserRole | "" }[] = [
  { label: "All Roles", value: "" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Manager", value: "MANAGER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

const ASSIGNABLE_ROLES: { label: string; value: UserRole }[] = [
  { label: "Customer", value: "CUSTOMER" },
  { label: "Manager", value: "MANAGER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

const TABLE_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "role", label: "Role" },
  { id: "status", label: "Status" },
  { id: "joined", label: "Joined" },
  { id: "actions", label: "Actions" },
];

const roleColor = (role: string): "default" | "primary" | "warning" | "error" => {
  const map: Record<string, "default" | "primary" | "warning" | "error"> = {
    CUSTOMER: "default",
    MANAGER: "primary",
    ADMIN: "warning",
    SUPER_ADMIN: "error",
  };
  return map[role] ?? "default";
};

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const Customers = () => {
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;

  const [roleDialog, setRoleDialog] = useState<{ open: boolean; user: AdminUser | null }>({
    open: false,
    user: null,
  });
  const [pendingRole, setPendingRole] = useState<UserRole>("CUSTOMER");
  const [saving, setSaving] = useState(false);

  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(
    (searchVal: string, roleVal: UserRole | "", pageVal: number) => {
      setLoading(true);
      AdminUserService.listUsers({ page: pageVal, size: pageSize, search: searchVal, role: roleVal })
        .then((res) => {
          setCustomers(res.content);
          setTotalElements(res.totalElements);
        })
        .catch(() => toast.error("Failed to load users."))
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    fetchUsers(search, roleFilter, page);
  }, [fetchUsers, roleFilter, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setPage(0);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => fetchUsers(val, roleFilter, 0), 400);
  };

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      const updated = await AdminUserService.toggleStatus(user.id);
      setCustomers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(`${updated.firstName} ${updated.isActive ? "activated" : "deactivated"}.`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const openRoleDialog = (user: AdminUser) => {
    setPendingRole(user.role);
    setRoleDialog({ open: true, user });
  };

  const handleRoleSave = async () => {
    if (!roleDialog.user) return;
    setSaving(true);
    try {
      const updated = await AdminUserService.changeRole(roleDialog.user.id, pendingRole);
      setCustomers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(`Role updated to ${pendingRole}.`);
      setRoleDialog({ open: false, user: null });
    } catch {
      toast.error("Failed to update role. Only SUPER_ADMIN can change roles.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Customers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          View and manage Raj Sports user accounts. Role changes require SUPER_ADMIN.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search name, email or phone..."
          value={search}
          onChange={handleSearchChange}
          sx={{ minWidth: 260 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as UserRole | "");
              setPage(0);
            }}
          >
            {ROLE_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {totalElements} user{totalElements !== 1 ? "s" : ""}
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
        <DataTable
          columns={TABLE_COLUMNS}
          isEmpty={customers.length === 0}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search or filters."
        >
          {customers.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>{user.id}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone ?? "—"}</TableCell>
              <TableCell>
                <Chip
                  label={user.role}
                  color={roleColor(user.role)}
                  size="small"
                  sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                />
              </TableCell>
              <TableCell>
                <StatusChip
                  label={user.isActive ? "Active" : "Inactive"}
                  color={user.isActive ? "success" : "error"}
                />
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Change role (SUPER_ADMIN only)">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openRoleDialog(user)}
                      sx={{ fontSize: "0.7rem", py: 0.25 }}
                    >
                      Role
                    </Button>
                  </Tooltip>
                  <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
                    <Button
                      size="small"
                      variant="outlined"
                      color={user.isActive ? "error" : "success"}
                      onClick={() => handleToggleStatus(user)}
                      sx={{ minWidth: 32, p: 0.5 }}
                    >
                      {user.isActive ? (
                        <BlockIcon fontSize="small" />
                      ) : (
                        <CheckCircleOutlinedIcon fontSize="small" />
                      )}
                    </Button>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
        {customers.length > 0 && (
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
          />
        )}
        </>
      )}

      <Dialog open={roleDialog.open} onClose={() => setRoleDialog({ open: false, user: null })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Change Role</DialogTitle>
        <DialogContent>
          {roleDialog.user && (
            <Typography sx={{ mb: 2 }}>
              User: <strong>{roleDialog.user.firstName} {roleDialog.user.lastName}</strong>
            </Typography>
          )}
          <FormControl fullWidth>
            <InputLabel>New Role</InputLabel>
            <Select
              label="New Role"
              value={pendingRole}
              onChange={(e) => setPendingRole(e.target.value as UserRole)}
            >
              {ASSIGNABLE_ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialog({ open: false, user: null })}>Cancel</Button>
          <Button onClick={handleRoleSave} variant="contained" disabled={saving} disableElevation>
            {saving ? <CircularProgress size={18} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
