"use client"

import React, { useState, type ReactNode, useCallback } from "react"
import { Box, IconButton, Typography, useTheme } from "@mui/material"
import { styled } from "@mui/system"
import { motion, AnimatePresence } from "framer-motion"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CircleIcon from "@mui/icons-material/Circle"

// Styled components using MUI system
const CarouselContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
}))

const SlideContainer = styled(motion.div)({
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
})

const NavigationButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    zIndex: 10,
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}))

const IndicatorContainer = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: theme.spacing(2),
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: theme.spacing(1),
    zIndex: 10,
}))

const IndicatorDot = styled(CircleIcon, {
    shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
    fontSize: 12,
    color: active ? theme.palette.primary.main : theme.palette.grey[400],
    cursor: "pointer",
    transition: "color 0.3s ease",
}))

// Types
export interface ComponentCarouselProps {
    slides: ReactNode[]
    titles?: string[]
    showIndicators?: boolean
    showArrows?: boolean
    autoPlay?: boolean
    autoPlayInterval?: number
    sx?: any
    currentIndex?: number
    onChangeIndex?: (newIndex: number, direction: number) => void
}

// Animation variants
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
    }),
}

export const ComponentCarousel: React.FC<ComponentCarouselProps> = ({
    slides,
    titles,
    showIndicators = false,
    showArrows = false,
    autoPlay = false,
    autoPlayInterval = 5000,
    sx,
    currentIndex: currentIndexProp,
    onChangeIndex,
}) => {
    const theme = useTheme()
    const [internalIndex, setInternalIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const isControlled = typeof currentIndexProp === "number"
    const currentIndex = isControlled ? currentIndexProp : internalIndex

    const setIndex = (index: number, dir: number) => {
        if (isControlled) {
            onChangeIndex?.(index, dir)
        } else {
            setInternalIndex(index)
            setDirection(dir)
        }
    }

    // Handle navigation
    const navigate = useCallback(
        (newDirection: number) => {
            const newIndex = (currentIndex + newDirection + slides.length) % slides.length
            setIndex(newIndex, newDirection)
        },
        [currentIndex, slides.length],
    )

    // Auto play effect
    React.useEffect(() => {
        if (!autoPlay) return

        const interval = setInterval(() => {
            navigate(1)
        }, autoPlayInterval)

        return () => clearInterval(interval)
    }, [autoPlay, autoPlayInterval, navigate])

    return (
        <CarouselContainer sx={{ ...sx }}>
            {/* Title if provided */}
            {titles && titles[currentIndex] && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        backgroundColor: theme.palette.BlackPearl.main,
                        zIndex: 5,
                        borderTopLeftRadius: theme.shape.borderRadius,
                        borderTopRightRadius: theme.shape.borderRadius,
                    }}
                >
                    <Typography variant="h6">{titles[currentIndex]}</Typography>
                </Box>
            )}

            {/* Navigation arrows */}
            {showArrows && slides.length > 1 && (
                <>
                    <NavigationButton onClick={() => navigate(-1)} sx={{ left: theme.spacing(2) }} size="large">
                        <ArrowBackIcon />
                    </NavigationButton>
                    <NavigationButton onClick={() => navigate(1)} sx={{ right: theme.spacing(2) }} size="large">
                        <ArrowForwardIcon />
                    </NavigationButton>
                </>
            )}

            {/* Slides */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <SlideContainer
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                >
                    <Box sx={{ width: "100%", height: "100%", p: 2 }}>{slides[currentIndex]}</Box>
                </SlideContainer>
            </AnimatePresence>

            {/* Indicators */}
            {showIndicators && slides.length > 1 && (
                <IndicatorContainer>
                    {slides.map((_, index) => (
                        <IndicatorDot
                            key={index}
                            active={index === currentIndex}
                            onClick={() => setIndex(index, index > currentIndex ? 1 : -1)}
                        />
                    ))}
                </IndicatorContainer>
            )}
        </CarouselContainer>
    )
}
