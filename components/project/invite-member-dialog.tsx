"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { apiClient, ApiError } from "@/lib/api"

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: number
  onMemberInvited?: () => void
}

export function InviteMemberDialog({ open, onOpenChange, projectId, onMemberInvited }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      await apiClient.inviteUser(projectId, email.trim())

      // Reset form and close dialog
      setEmail("")
      onOpenChange(false)
      onMemberInvited?.()
    } catch (error) {
      console.error("Failed to invite member:", error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("Failed to send invitation. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setEmail("")
      setError(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Invite Team Member</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send an invitation to collaborate on this music project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <div className="text-sm text-\
