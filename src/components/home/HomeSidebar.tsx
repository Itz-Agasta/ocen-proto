"use client";

import { useState } from "react";
import { FaCalendarAlt, FaFilter, FaGlobe } from "react-icons/fa";
import { MdTimeline, MdWaves } from "react-icons/md";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TimePeriodSelector } from "../TimePeriodSelector";
import { DatasetFilters } from "./DatasetFilters";
import { DeploymentYearFilter } from "./DeploymentYearFilter";

interface HomeSidebarProps {
  className?: string;
  onFiltersChange?: (filters: HomeSidebarFilters) => void;
}

export interface HomeSidebarFilters {
  timePeriod: string;
  customDateRange?: { start: Date; end: Date };
  datasets: {
    argoCore: boolean;
    argoBGC: boolean;
    argoDeep: boolean;
    woce: boolean;
    goShip: boolean;
    otherShips: boolean;
    drifters: boolean;
    tropicalCyclones: boolean;
  };
  deploymentYears: { start: number; end: number };
}

export function HomeSidebar({ className, onFiltersChange }: HomeSidebarProps) {
  const [filters, setFilters] = useState<HomeSidebarFilters>({
    timePeriod: "all",
    datasets: {
      argoCore: true,
      argoBGC: false,
      argoDeep: false,
      woce: false,
      goShip: false,
      otherShips: false,
      drifters: false,
      tropicalCyclones: false,
    },
    deploymentYears: { start: 2000, end: new Date().getFullYear() },
  });

  const handleFilterUpdate = (newFilters: Partial<HomeSidebarFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleTimePeriodChange = (timePeriod: string) => {
    handleFilterUpdate({ timePeriod });
  };

  const handleDatasetChange = (datasets: HomeSidebarFilters["datasets"]) => {
    handleFilterUpdate({ datasets });
  };

  const handleDeploymentYearChange = (deploymentYears: {
    start: number;
    end: number;
  }) => {
    handleFilterUpdate({ deploymentYears });
  };

  // Count active filters for display
  const activeDatasets = Object.values(filters.datasets).filter(Boolean).length;
  const totalDatasets = Object.keys(filters.datasets).length;

  return (
    <Sidebar className={className}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4">
          <FaFilter className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Research Filters
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure data visualization parameters
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <div className="space-y-4 px-4">
            {/* Time Period Filter */}
            <SidebarGroup>
              {/* <SidebarGroupLabel className="flex items-center gap-2">
                <FaCalendarAlt className="h-3.5 w-3.5" />
                Temporal Range
              </SidebarGroupLabel> */}
              <SidebarGroupContent>
                <TimePeriodSelector
                  value={filters.timePeriod}
                  onValueChange={(period) => handleTimePeriodChange(period)}
                />
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            {/* Dataset Filters */}
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdWaves className="h-3.5 w-3.5" />
                  Dataset Filters
                </div>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {activeDatasets}/{totalDatasets}
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <DatasetFilters
                  datasets={filters.datasets}
                  onDatasetsChange={handleDatasetChange}
                />
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            {/* Deployment Year Filter */}
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <MdTimeline className="h-3.5 w-3.5" />
                Deployment Period
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <DeploymentYearFilter
                  range={filters.deploymentYears}
                  onRangeChange={handleDeploymentYearChange}
                />
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            {/* Quick Stats/Info */}
            <SidebarGroup>
              <SidebarGroupContent>
                <Card className="bg-muted/20 border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FaGlobe className="h-4 w-4" />
                      Filter Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <div>
                      Time:{" "}
                      {filters.timePeriod === "custom"
                        ? "Custom range"
                        : filters.timePeriod.toUpperCase()}
                    </div>
                    <div>Datasets: {activeDatasets} selected</div>
                    <div>
                      Deployment: {filters.deploymentYears.start}-
                      {filters.deploymentYears.end}
                    </div>
                  </CardContent>
                </Card>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
