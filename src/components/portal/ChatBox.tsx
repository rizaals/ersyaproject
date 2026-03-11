'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string | Date
  sender: {
    id: string
    name: string
    role: string
  }
}

interface ChatBoxProps {
  orderId: string
  currentUserId: string
  initialMessages: Message[]
}

export function ChatBox({ orderId, currentUserId, initialMessages }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message ?? 'Gagal mengirim pesan')
      } else {
        setMessages((prev) => [...prev, data.data])
        setText('')
      }
    } finally {
      setSending(false)
    }
  }

  const isAdmin = (role: string) => ['admin', 'superadmin'].includes(role)

  return (
    <div className="rounded-xl border bg-card flex flex-col h-[500px]">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm">Komunikasi dengan Tim</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Diskusikan kebutuhan desain Anda di sini
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Belum ada pesan. Mulai percakapan!
          </div>
        )}
        {messages.map((msg) => {
          const isSelf = msg.senderId === currentUserId
          const isAdminMsg = isAdmin(msg.sender.role)
          return (
            <div key={msg.id} className={cn('flex gap-2', isSelf ? 'flex-row-reverse' : 'flex-row')}>
              {/* Avatar */}
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  isAdminMsg ? 'bg-brand text-white' : 'bg-muted text-foreground'
                )}
              >
                {msg.sender.name.charAt(0).toUpperCase()}
              </div>
              <div className={cn('max-w-[75%]', isSelf ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
                {!isSelf && (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {msg.sender.name} {isAdminMsg && '(Admin)'}
                  </span>
                )}
                <div
                  className={cn(
                    'rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                    isSelf
                      ? 'bg-brand text-white rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis pesan..."
          className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="px-3 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  )
}
