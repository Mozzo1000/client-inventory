import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { ListItemText, Tooltip } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from '@mui/icons-material/Home';
import LaptopIcon from '@mui/icons-material/Laptop';
import AppsIcon from '@mui/icons-material/Apps';

function Navbar() {
    let navigate = useNavigate();
    let location = useLocation();
    const title = "Client inventory";
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const currentUser = AuthService.getCurrentUser();

    const pages = [
        {
            name: "Home",
            link: "/",
            icon: <HomeIcon sx={{ color: "white" }} />,
        },
        {
            name: "Clients",
            link: "/clients",
            icon: <LaptopIcon sx={{ color: "white" }} />,
        },
        {
            name: "Applications",
            link: "/applications",
            icon: <AppsIcon sx={{ color: "white" }} />,
        },
    ];

    const settings = [
        { name: "Sign out", action: "logout", icon: <LogoutIcon /> },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSettingsItemClick = (e) => {
        if (e === "logout") {
            AuthService.logout();
            navigate("/login");
        }
        handleCloseUserMenu();
    };

    const drawer = (
        <>
            <Toolbar>
                <Typography
                    align="center"
                    sx={{
                        flexGrow: 1,
                        textTransform: "uppercase",
                        letterSpacing: "0.05rem",
                        fontWeight: "600",
                    }}
                >
                    {title}
                </Typography>
            </Toolbar>
            <Divider sx={{ background: "rgba(255, 255, 255, 0.15);" }} />
            <Box sx={{ overflow: "auto" }}>
                <List>
                    {pages.map((page) => (
                        <ListItem
                            button
                            key={page.name}
                            component={Link}
                            to={page.link}
                            selected={location.pathname === page.link}
                            onClick={() => setMobileOpen(false)}
                        >
                            <ListItemIcon>{page.icon}</ListItemIcon>
                            <ListItemText primary={page.name} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
            </Box>
        </>
    );

    return (
        <>
            {currentUser && (
                <Box sx={{ display: "flex" }}>
                    <AppBar
                        position="fixed"
                        sx={{
                            width: { md: `calc(100% - ${240}px)` },
                            zIndex: 2,
                            backgroundColor: "white",
                            color: "black",
                        }}
                    >
                        <Container maxWidth="x1">
                            <Toolbar disableGutters>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
                                >
                                    {pages.find((el) => location.pathname === el.link)?.name}
                                </Typography>
                                <Box sx={{ flexGrow: 1, display: { xs: "flex", lg: "none" } }}>
                                    <IconButton
                                        aria-label="open drawer"
                                        edge="start"
                                        onClick={handleDrawerToggle}
                                        sx={{ mr: 2, display: { md: "none" } }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Drawer
                                        variant="temporary"
                                        open={mobileOpen}
                                        onClose={handleDrawerToggle}
                                        ModalProps={{
                                            keepMounted: true, // Better open performance on mobile.
                                        }}
                                        sx={{
                                            display: { xs: "block", md: "none" },
                                            "& .MuiDrawer-paper": {
                                                boxSizing: "border-box",
                                                width: 240,
                                                color: "white",
                                                backgroundColor: "#1d4dbc",
                                            },
                                        }}
                                    >
                                        {drawer}
                                    </Drawer>
                                </Box>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
                                >
                                    {pages.find((el) => location.pathname === el.link)?.name}
                                </Typography>
                                <Box
                                    sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
                                ></Box>
                                {currentUser && (
                                    <Box sx={{ flexGrow: 0 }}>
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                <Avatar />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            sx={{ mt: "45px" }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                        >
                                            <MenuItem component={Link} to="/settings">
                                                <Avatar /> {currentUser["name"]}
                                            </MenuItem>
                                            <Divider />
                                            {settings.map((setting) => (
                                                <MenuItem
                                                    key={setting.name}
                                                    onClick={() =>
                                                        handleSettingsItemClick(setting.action)
                                                    }
                                                >
                                                    <ListItemIcon>{setting.icon}</ListItemIcon>
                                                    <ListItemText primary={setting.name} />
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </Box>
                                )}
                                {!currentUser && (
                                    <Tooltip title="Login">
                                        <IconButton component={Link} to="/login" sx={{ p: 0 }}>
                                            <LoginIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Toolbar>
                        </Container>
                    </AppBar>
                    <Drawer
                        variant="permanent"
                        sx={{
                            zIndex: 1,
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {
                                width: 240,
                                boxSizing: "border-box",
                                color: "white",
                                backgroundColor: "#1d4dbc",
                            },
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Box>
            )}
        </>
    );
}

export default Navbar;
