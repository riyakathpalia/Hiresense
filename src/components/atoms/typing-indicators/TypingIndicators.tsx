"use client"

import { Box, styled } from "@mui/material"
import { motion } from "framer-motion"

const TypingDot = styled(motion.div)(({ theme }) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(0, 0.5),
}))

const TypingContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    width: "fit-content",
}))

const bounceAnimation = {
    y: [0, -10, 0],
    transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
    },
}

export default function TypingIndicator() {
    return (
        <TypingContainer>
            <TypingDot animate={bounceAnimation} transition={{ delay: 0 }} />
            <TypingDot animate={bounceAnimation} transition={{ delay: 0.2 }} />
            <TypingDot animate={bounceAnimation} transition={{ delay: 0.4 }} />
        </TypingContainer>
    )
}
