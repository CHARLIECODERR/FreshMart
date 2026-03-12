'use client'

import React, { useEffect, useState } from 'react'
import { rtdb } from '@/lib/firebase/config'
import { ref, onValue, set, onDisconnect, runTransaction } from 'firebase/database'
import { Users } from 'lucide-react'

export default function LiveVisitors() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const visitorsRef = ref(rtdb, 'stats/visitors_count')
        const presenceRef = ref(rtdb, 'stats/active_sessions/' + Math.random().toString(36).substring(7))

        // 1. Listen for total active sessions
        const unsubscribe = onValue(ref(rtdb, 'stats/active_sessions'), (snapshot) => {
            const data = snapshot.val()
            if (data) {
                setCount(Object.keys(data).length)
            } else {
                setCount(0)
            }
        })

        // 2. Manage current session presence
        set(presenceRef, true)
        onDisconnect(presenceRef).remove()

        return () => {
            unsubscribe()
            set(presenceRef, null)
        }
    }, [])

    if (count === 0) return null

    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100 animate-pulse">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <Users size={12} />
            <span>{count} LIVE NOW</span>
        </div>
    )
}
