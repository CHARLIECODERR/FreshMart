'use client'

import React from 'react'
import Image from 'next/image'

interface UserAvatarProps {
    name?: string | null
    src?: string | null
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

export default function UserAvatar({ name, src, size = 'md', className = '' }: UserAvatarProps) {
    const initials = name
        ? name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : '?'

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
    }

    // Generate a consistent color based on the name
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-orange-500',
        'bg-indigo-500',
        'bg-teal-500',
    ]
    const colorIndex = name ? name.length % colors.length : 0
    const bgColor = colors[colorIndex]

    return (
        <div className={`relative flex-shrink-0 rounded-full overflow-hidden border-2 border-white shadow-sm transition-transform hover:scale-105 ${sizeClasses[size]} ${className}`}>
            {src ? (
                <Image
                    src={src}
                    alt={name || 'User Avatar'}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className={`${bgColor} w-full h-full flex items-center justify-center text-white font-black tracking-tight`}>
                    {initials}
                </div>
            )}
        </div>
    )
}
