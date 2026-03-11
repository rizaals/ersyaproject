'use client'

import { useState, useEffect, useCallback } from 'react'

interface Notification {
  id: string
  type: string
  message: string
  isRead: boolean
  createdAt: string
  orderId?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=20')
      if (!res.ok) return
      const data = await res.json()
      if (data.success) {
        setNotifications(data.data.items)
        setUnreadCount(data.data.items.filter((n: Notification) => !n.isRead).length)
      }
    } catch (error) {
      // Silent fail — notifikasi bukan fitur kritis
    }
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(async () => {
    await fetch('/api/notifications/read-all', { method: 'PATCH' })
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }, [])

  useEffect(() => {
    fetchNotifications()
    // Polling setiap 30 detik
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch: fetchNotifications }
}
