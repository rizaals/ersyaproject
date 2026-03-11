'use client'

// Admin chat is same as portal but labeled "(Admin)" — reuse ChatBox
import { ChatBox } from '@/components/portal/ChatBox'

interface AdminChatBoxProps {
  orderId: string
  currentUserId: string
  initialMessages: any[]
}

export function AdminChatBox(props: AdminChatBoxProps) {
  return <ChatBox {...props} />
}
