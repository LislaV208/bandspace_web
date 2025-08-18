"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SongsTab } from "./tabs/songs-tab"
import { MembersTab } from "./tabs/members-tab"
import { OverviewTab } from "./tabs/overview-tab"

interface ProjectTabsProps {
  projectId: number
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="songs" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-muted">
        <TabsTrigger value="songs" className="data-[state=active]:bg-background">
          Songs
        </TabsTrigger>
        <TabsTrigger value="members" className="data-[state=active]:bg-background">
          Members
        </TabsTrigger>
        <TabsTrigger value="overview" className="data-[state=active]:bg-background">
          Overview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="songs" className="mt-6">
        <SongsTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="members" className="mt-6">
        <MembersTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="overview" className="mt-6">
        <OverviewTab projectId={projectId} />
      </TabsContent>
    </Tabs>
  )
}
