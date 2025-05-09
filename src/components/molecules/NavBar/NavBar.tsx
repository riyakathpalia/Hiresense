import React from "react";
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import Image from "next/image";

const Navbar = () => {

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 12,
        zIndex: 1000,
        borderBottom: "0.1rem solid",
        borderColor: "divider",
        backgroundColor: "transparent",
        backdropFilter: "blur(10px)",
        height: '64px'
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mx: { sm: 2, md: 5, lg: 8 }, minHeight: '64px !important', // Override default min-height
          height: '64px',
          padding: '0 !important' }}>
        {/* Brand Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginRight:"auto" }}>
          <Image
            src="/Caze MeTPro AI.png"
            alt="Logo Image"
            width={170}
            height={50}
            priority
          />
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Button
            sx={{ textTransform: "none", color: "white", typography: 'h6' }}
            onClick={() => {
              const el = document.getElementById("features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Features
          </Button>

          <Button
            sx={{ textTransform: "none", color: "white", typography: 'h6' }}
            onClick={() => {
              const el = document.getElementById("how-it-works");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            How It Works
          </Button>

          {/* <Button sx={{ textTransform: "none", color: "text.secondary" }}>Pricing</Button> */}
        </Box>

        {/* CTA Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Login/Signup buttons would go here */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;