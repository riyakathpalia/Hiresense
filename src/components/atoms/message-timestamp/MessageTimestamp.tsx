"use client"

import { Typography, styled } from "@mui/material"
import { motion } from "framer-motion"

const StyledTimestamp = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}))

const MotionTimestamp = motion(StyledTimestamp)

interface MessageTimestampProps {
  timestamp: Date
}

export default function MessageTimestamp({ timestamp }: MessageTimestampProps) {
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(timestamp)

  return (
    <MotionTimestamp initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.3 }}>
      {formattedTime}
    </MotionTimestamp>
  )
}
