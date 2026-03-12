import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import AppShell from '@/components/layout/AppShell'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta',
    display: 'swap',
})

export const viewport: Viewport = {
    themeColor: '#16A34A',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export const metadata: Metadata = {
    title: 'FreshMart | Your Daily Groceries',
    description: 'Fast, fresh, and free delivery on daily groceries and essentials.',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'FreshMart',
    },
}

import AuthProvider from '@/contexts/AuthProvider'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
            <body className="font-sans antialiased text-gray-900 bg-background flex flex-col min-h-[100dvh]">
                <AuthProvider>
                    <AppShell>
                        {children}
                    </AppShell>
                    <Toaster
                        position="bottom-center"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#333',
                                color: '#fff',
                                borderRadius: '12px',
                                padding: '12px 16px',
                            },
                            success: {
                                style: {
                                    background: '#16A34A',
                                }
                            }
                        }}
                    />
                </AuthProvider>
            </body>
        </html>
    )
}
