import { useState } from 'react';
import {
  Alert,
  Box,
  InputAdornment,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AppSelect from '../../components/common/inputs/AppSelect';
import DataTable from '../../components/common/tables/DataTable';
import StatusChip from '../../components/common/chips/StatusChip';

// ─── Missing Backend API Notice ───────────────────────────────────────────────
//
// The Customers page requires this backend endpoint which does not exist yet:
//
//   GET /api/admin/users
//   Auth: SUPER_ADMIN / ADMIN / MANAGER (JWT required)
//   Query params:
//     page       int     (default 0)
//     size       int     (default 25)
//     sortBy     string  (default "createdAt")
//     sortDir    string  (default "desc")
//     role       string  (optional filter: CUSTOMER | ADMIN | MANAGER | SUPER_ADMIN)
//     search     string  (optional: match firstName, lastName, email, phone)
//     isActive   boolean (optional)
//
//   Response: CommonApiResponse<PageResponse<UserResponse>>
//   Where UserResponse already exists at:
//     com.rajsports.user.dto.UserResponse
//     (has: id, firstName, lastName, email, phone, role)
//
//   You will also need to add a createdAt field to UserResponse and
//   an admin controller in com.rajsports.user.controller.AdminUserController.
//
// ─────────────────────────────────────────────────────────────────────────────

// Role options for the filter dropdown.
const ROLE_OPTIONS = [
  { label: 'All Roles', value: '' },
  { label: 'Customer', value: 'CUSTOMER' },
  { label: 'Manager', value: 'MANAGER' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
];

// Active status options for the filter dropdown.
const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

// Table columns that will be populated once the backend endpoint is wired up.
const TABLE_COLUMNS = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'joined', label: 'Joined' },
];

// Customers displays the admin customer table.
// The full implementation is ready to wire up — see the backend API notice above.
const Customers = () => {
  // Filter state — these will be sent as query params once the backend API exists.
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Suppress "unused variable" warnings while backend is pending.
  // These values will be used in the fetch call once the endpoint exists.
  void search;
  void roleFilter;
  void statusFilter;

  return (
    <Box>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Customers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          View and manage Raj Sports customer accounts.
        </Typography>
      </Box>

      {/* ── Backend missing notice ────────────────────────────────────────── */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Backend API not implemented yet.
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Add <code>GET /api/admin/users</code> to the backend to connect this page.
          See the code comment at the top of <code>src/pages/admin/Customers.tsx</code> for the
          full endpoint spec.
        </Typography>
      </Alert>

      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {/* Free-text search — will match firstName, lastName, email, phone on the backend */}
        <TextField
          size="small"
          placeholder="Search name, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled
          sx={{ minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Role filter */}
        <AppSelect
          label="Role"
          value={roleFilter}
          options={ROLE_OPTIONS}
          onChange={(e) => setRoleFilter(e.target.value)}
          disabled
          sx={{ minWidth: 160 }}
        />

        {/* Active / inactive filter */}
        <AppSelect
          label="Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={(e) => setStatusFilter(e.target.value)}
          disabled
          sx={{ minWidth: 150 }}
        />
      </Box>

      {/* ── Customer table ────────────────────────────────────────────────── */}
      {/* The table is rendered in empty-state mode until the backend API is connected.
          Once wired up, replace isEmpty={true} with isEmpty={customers.length === 0}
          and populate each TableRow below from the fetched customers array. */}
      <DataTable
        columns={TABLE_COLUMNS}
        isEmpty={true}
        emptyTitle="Backend endpoint required"
        emptyDescription="Connect GET /api/admin/users to populate this table."
      >
        {/* Placeholder row structure — uncomment and adapt when backend is ready:
        {customers.map((customer) => (
          <TableRow key={customer.id} hover>
            <TableCell>{customer.id}</TableCell>
            <TableCell>{customer.firstName} {customer.lastName}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone ?? '—'}</TableCell>
            <TableCell>
              <StatusChip
                label={customer.role}
                color={customer.role === 'CUSTOMER' ? 'default' : 'primary'}
              />
            </TableCell>
            <TableCell>
              <StatusChip
                label={customer.isActive ? 'Active' : 'Inactive'}
                color={customer.isActive ? 'success' : 'error'}
              />
            </TableCell>
            <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
        */}

        {/* Temporary visible row to show how the table will look once data arrives */}
        <TableRow sx={{ opacity: 0.4 }}>
          <TableCell>1</TableCell>
          <TableCell>John Smith</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>+1 555-0100</TableCell>
          <TableCell>
            <StatusChip label="CUSTOMER" color="default" />
          </TableCell>
          <TableCell>
            <StatusChip label="Active" color="success" />
          </TableCell>
          <TableCell>Jan 15, 2025</TableCell>
        </TableRow>
      </DataTable>
    </Box>
  );
};

export default Customers;
