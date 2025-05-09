"use client"

import { Box, styled } from "@mui/material"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { ComponentPropsWithoutRef } from "react"
import { Components } from "react-markdown"
import FormattedResponse from "../../molecules/Formated-Response/FormatedResponse"



const MarkdownContainer = styled(Box)(({ theme }) => ({
    "& p": {
        margin: theme.spacing(1, 0),
    },
    "& ul, & ol": {
        paddingLeft: theme.spacing(3),
    },
    "& li": {
        margin: theme.spacing(0.5, 0),
    },
    "& code": {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        padding: theme.spacing(0.25, 0.5),
        borderRadius: 4,
        fontFamily: "monospace",
    },
    "& pre": {
        margin: theme.spacing(1, 0),
        borderRadius: 8,
        overflow: "auto",
    },
    "& table": {
        borderCollapse: "collapse",
        width: "100%",
        margin: theme.spacing(2, 0),
    },
    "& th, & td": {
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1),
        textAlign: "left",
    },
    "& th": {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    "& blockquote": {
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        margin: theme.spacing(1, 0),
        padding: theme.spacing(0, 2),
        color: theme.palette.text.secondary,
    },
    "& a": {
        color: theme.palette.primary.main,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
}))

const MotionTypography = motion.div

interface MessageContentProps {
    content: string
    isTyping?: boolean
    isBackendResponse?: boolean
}

const components: Components = {
    code({
        inline,
        className,
        children,
        ...props }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) {
        const match = /language-(\w+)/.exec(className || "")
        return !inline && match ? (
            <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
            >
                {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
        ) : (
            <code className={className} {...props}>
                {children}
            </code>
        )
    },
}

export default function MessageContent({ content, isTyping = false, isBackendResponse = false }: MessageContentProps) {

    // If this is a backend response with potential \n characters, use FormattedResponse
    if (isBackendResponse) {
        return <FormattedResponse text={content} animate={isTyping} />
    }

    // Animation variants for typing effect
    const typingVariants = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
    }

    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    // If typing animation is active, render character by character
    if (isTyping) {
        return (
            <MotionTypography variants={typingVariants} initial="hidden" animate="visible">
                {content.split("").map((char, index) => (
                    <motion.span key={index} variants={letterVariants}>
                        {char}
                    </motion.span>
                ))}
            </MotionTypography>
        )
    }

    // Otherwise render with markdown
    return (
        <MarkdownContainer>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </MarkdownContainer>
    )
}