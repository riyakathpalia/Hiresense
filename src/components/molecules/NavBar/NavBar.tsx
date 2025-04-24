import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

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
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mx: { sm: 2, md: 5, lg: 30 } }}>
        {/* Brand Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* <Image
            src="/Caze-Logo-Colour-Transparent.webp"
            alt="Logo Image"
            width={150}
            height={150}
            priority
          /> */}
          <Typography variant="h6" fontWeight="bold">
            MetProAI
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Button
            sx={{ textTransform: "none", color: "text.secondary" }}
            onClick={() => {
              const el = document.getElementById("features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Features
          </Button>

          <Button
            sx={{ textTransform: "none", color: "text.secondary" }}
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