'use client'

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'

// PWA: BeforeInstallPromptEvent Type
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

export default function InstallPrompt() {
    const [isReady, setIsReady] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

    useEffect(() => {
        // Check if app is already installed/standalone
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        if (isStandalone) {
            return
        }

        // Capture the install prompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)

            // Check if user dismissed previously in this session
            const hasDismissed = sessionStorage.getItem('pwa-prompt-dismissed')
            if (!hasDismissed) {
                setIsReady(true)
            }
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        // Fallback: If no event fires but on mobile web, show generic "Add to homescreen" tip
        // (We'll keep it simple for MVP and only show if deferredPrompt works, like on Chrome/Android)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            setIsReady(false)
        }
        setDeferredPrompt(null)
    }

    const handleDismiss = () => {
        setIsReady(false)
        sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }

    // Only render on mobile and if prompt is ready
    if (!isReady) return null

    return (
        <div className="fixed bottom-[76px] left-4 right-4 md:hidden z-40 animate-slide-up">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-2xl flex items-center gap-4">

                {/* App Icon Mock */}
                <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-display font-bold text-xl">F</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Get the FreshMart app</p>
                    <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        Add to home screen for faster shopping
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleInstall}
                        className="bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
                    >
                        <Download size={14} />
                        <span>Install</span>
                    </button>

                    <button
                        onClick={handleDismiss}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

            </div>
        </div>
    )
}
