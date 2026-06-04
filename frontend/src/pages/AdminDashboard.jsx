import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Grid,
  Paper,
} from "@mui/material";

const drawerWidth = 240;


export default function AdminDashboard() {

     const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "#1B5E20",
            color: "#fff",
          },
        }}
      >
        <Toolbar />

        <List>
          <ListItemButton>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton>
            <ListItemText primary="Products" />
          </ListItemButton>

          <ListItemButton
  onClick={() => navigate("/addproduct")}
>
  <ListItemText primary="AddProduct" />
</ListItemButton>

          <ListItemButton>
            <ListItemText primary="Orders" />
          </ListItemButton>

          <ListItemButton>
            <ListItemText primary="Customers" />
          </ListItemButton>

          <ListItemButton>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main */}

      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            bgcolor: "#fff",
            color: "#111",
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              fontWeight="bold"
            >
              TechAgro Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3 }}>
                <Typography>Total Products</Typography>
                <Typography variant="h4">
                  120
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3 }}>
                <Typography>Orders</Typography>
                <Typography variant="h4">
                  45
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3 }}>
                <Typography>Revenue</Typography>
                <Typography variant="h4">
                  Rs.250,000
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3 }}>
                <Typography>Stock</Typography>
                <Typography variant="h4">
                  850
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}