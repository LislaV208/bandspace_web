"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Check, X, Users } from "lucide-react"
import type { ProjectInvitation } from "@/lib/types"

export function InvitationsPanel() {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  useEffect(() => {
    const mockInvitations: ProjectInvitation[] = [
      {
        id: 1,
        project: {
          id: 4,
          name: "Jazz Fusion Project",
          slug: "jazz-fusion-project",
          createdAt: "2024-01-20T10:00:00Z",
          updatedAt: "2024-01-20T10:00:00Z",
          users: [],
        },
        invitedBy: {
          id: 5,
          email: "alex@example.com",
          name: "Alex Rodriguez",
        },
        createdAt: "2024-01-21T09:00:00Z",
      },
      {
        id: 2,
        project: {
          id: 5,
          name: "Indie Rock Band",
          slug: "indie-rock-band",
          createdAt: "2024-01-19T15:00:00Z",
          updatedAt: "2024-01-19T15:00:00Z",
          users: [],
        },
        invitedBy: {
          id: 6,
          email: "emma@example.com",
          name: "Emma Thompson",
        },
        createdAt: "2024-01-20T14:30:00Z",
      },
    ]

    setTimeout(() => {
      setInvitations(mockInvitations)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleInvitationResponse = async (invitationId: number, action: "accept" | "decline") => {
    try {
      // TODO: Implement API call
      console.log(`${action} invitation:`, invitationId)

      // Remove invitation from list
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId))
    } catch (error) {
      console.error(`Failed to ${action} invitation:`, error)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-16 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (invitations.length === 0) {
    return null
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <Mail className="h-5 w-5" />
          <span>Project Invitations</span>
          <Badge variant="secondary" className="ml-2">
            {invitations.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          You have pending invitations to join music projects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{invitation.project.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Invited by {invitation.invitedBy.name || invitation.invitedBy.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleInvitationResponse(invitation.id, "decline")}
                className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => handleInvitationResponse(invitation.id, "accept")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
