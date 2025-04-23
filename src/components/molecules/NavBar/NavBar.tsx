import React from "react";
import { AppBar, Toolbar, Typography, Box,Button } from "@mui/material";
//import CustomButton from "@/components/atoms/button/CustomButton";
//import { LogIn, UserPlus } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        zIndex: 1000,
        borderBottom: "0.1rem solid",
        borderColor: "divider",
        backgroundColor: "transparent",
        backdropFilter: "blur(10px)",
        //mx:{sm:2, md:5, lg:25}
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mx:{sm:2, md:5, lg:30} }}>
        {/* Brand Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Image 
        src="/Caze-Logo-Colour-Transparent.webp" // Path to the image
        alt="Logo Image"
        width={150} // Set width
        height={150} // Set height
        priority // Loads image immediately
      />
          <Typography variant="h6" fontWeight="bold">
            HireSense
          </Typography>
        </Box>

        {/* Navigation Links - Hidden on Mobile */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Button sx={{ textTransform: "none", color: "text.secondary" }}>Features</Button>
          <Button sx={{ textTransform: "none", color: "text.secondary" }}>How It Works</Button>
          <Button sx={{ textTransform: "none", color: "text.secondary" }}>Pricing</Button>
        </Box>

        {/* CTA Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* <CustomButton
            variant="outline"
            size="small"
            startIcon={<LogIn size={16} />}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            Login
          </CustomButton>
          <CustomButton
            variant="primary"
            size="small"
            startIcon={<UserPlus size={16} />}
          >
            Sign Up
          </CustomButton> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
