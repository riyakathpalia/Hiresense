"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import "./FormatedResponse.css"


// Create typed motion components
const MotionP = motion.p
const MotionLi = motion.li
const MotionH1 = motion.h1
const MotionH2 = motion.h2

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
}

interface FormattedResponseProps {
    text: string
    animate?: boolean
}

export default function FormattedResponse({ text, animate = true }: FormattedResponseProps) {
    const processedText = text
        .replace(/\\n/g, "\n")
        .replace(/(\d+)\.([\S])/g, "$1. $2")
        .replace(/(-|\*)([\S])/g, "$1 $2")

    if (animate) {
        return (
            <motion.div
                className="markdown-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ width: '100%' }}
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({ ...props }) => (
                            <MotionP
                                variants={itemVariants}
                                style={{ margin: '8px 0' }}
                                {...props as HTMLMotionProps<"p">}
                            />
                        ),
                        li: ({ ...props }) => (
                            <MotionLi
                                variants={itemVariants}
                                style={{ margin: '4px 0', paddingLeft: '24px' }}
                                {...props as HTMLMotionProps<"li">}
                            />
                        ),
                        h1: ({ ...props }) => (
                            <MotionH1
                                variants={itemVariants}
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    margin: '16px 0 8px'
                                }}
                                {...props as HTMLMotionProps<"h1">}
                            />
                        ),
                        h2: ({ ...props }) => (
                            <MotionH2
                                variants={itemVariants}
                                style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    margin: '16px 0 8px'
                                }}
                                {...props as HTMLMotionProps<"h2">}
                            />
                        ),
                    }}
                >
                    {processedText}
                </ReactMarkdown>
            </motion.div>
        )
    }

    // Non-animated version
    return (
        <div className="markdown-container" style={{ width: '100%' }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ ...props }) => <p style={{ margin: '8px 0' }} {...props} />,
                    li: ({ ...props }) => <li style={{ margin: '4px 0', paddingLeft: '24px' }} {...props} />,
                    h1: ({ ...props }) => (
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            margin: '16px 0 8px'
                        }} {...props} />
                    ),
                    h2: ({ ...props }) => (
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            margin: '16px 0 8px'
                        }} {...props} />
                    ),
                }}
            >
                {processedText}
            </ReactMarkdown>
        </div>
    )
}