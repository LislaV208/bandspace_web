"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserPlus, MoreHorizontal, Crown, Mail } from "lucide-react"
import type { User } from "@/lib/types"

interface MembersTabProps {
  projectId: number
}

export function MembersTab({ projectId }: MembersTabProps) {
  const [members, setMembers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - will be replaced with API call
    const mockMembers: User[] = [
      { id: 1, email: "john@example.com", name: "John Doe" },
      { id: 2, email: "jane@example.com", name: "Jane Smith" },
      { id: 3, email: "mike@example.com", name: "Mike Johnson" },
    ]

    setTimeout(() => {
      setMembers(mockMembers)
      setIsLoading(false)
    }, 500)
  }, [projectId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border bg-card animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Members</h2>
          <p className="text-muted-foreground">{members.length} members in this project</p>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Members List */}
      <div className="grid gap-4">
        {members.map((member, index) => (
          <Card key={member.id} className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={undefined || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="bg-secondary">
                      {member.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground">{member.name || "Unknown User"}</h3>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>

                {index !== 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Make Admin</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove from Project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
