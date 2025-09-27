"use client";

import {
  Activity,
  BarChart3,
  Bot,
  Cpu,
  Database,
  FileText,
  Layers,
  MapPin,
  Menu,
  ShieldCheck,
  TrendingUp,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

interface Navbar2Props {
  onOpenChat?: () => void;
}

// Data components for Ocean Data menu
const dataComponents = [
  {
    title: "Float Profiles",
    href: "/profiles",
    description: "Access detailed oceanographic profiles from ARGO floats",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    title: "Temperature Data",
    href: "/temperature",
    description: "Comprehensive temperature measurements and analysis",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: "Salinity Profiles",
    href: "/salinity",
    description: "Salinity data and conductivity measurements",
    icon: <Waves className="h-4 w-4" />,
  },
  {
    title: "Float Trajectories",
    href: "/trajectories",
    description: "Track float movement patterns and drift analysis",
    icon: <MapPin className="h-4 w-4" />,
  },
];

// Analysis tools for researchers
const analysisTools = [
  {
    title: "Statistical Analysis",
    href: "/tools/statistics",
    description: "Advanced statistical tools for oceanographic data",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    title: "Time Series Analysis",
    href: "/tools/timeseries",
    description: "Analyze temporal patterns in ocean data",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    title: "Data Visualization",
    href: "/tools/visualization",
    description: "Create professional charts and visualizations",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: "Export & Download",
    href: "/tools/export",
    description: "Export data in various formats for further analysis",
    icon: <Database className="h-4 w-4" />,
  },
  {
    title: "Scenario Sandbox",
    href: "/tools/forecasting",
    description: "Run ‘what-if’ scenarios on ocean profiles.",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    title: "Gap Filling & Synthesis",
    href: "/tools/gap-filling",
    description: "Generate plausible profiles to fill missing measurements",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    title: "Anomaly Detection & QC",
    href: "/tools/anomaly-detection",
    description: "Automated anomaly detection and quality control",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    title: "Clustering & EOF Analysis",
    href: "/tools/clustering",
    description:
      "Advanced clustering techniques and empirical orthogonal function analysis",
    icon: <Layers className="h-4 w-4" />,
  },
];

export function HomeNavbar({ onOpenChat }: Navbar2Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Column: Logo + Brand */}
        <div className="flex items-center space-x-3">
          <Image
            src="/incois_logo.png"
            alt="INCOIS Logo"
            width={60}
            height={60}
            className="h-20 w-20 object-contain"
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-2xl">Float-Chat</span>
              <span className="text-xs font-medium text-muted-foreground">
                INCOIS
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Argo Data Analysis & Visualization Platform
            </span>
          </div>
        </div>

        {/* Middle Column: Navigation Menu (Desktop) */}
        <div className="hidden lg:flex justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium h-10 flex items-center gap-2 data-[state=open]:bg-accent">
                  <Database className="h-4 w-4" />
                  <span className="relative top-[1px]">Ocean Data</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-3 p-6 md:grid-cols-2">
                    {dataComponents.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        icon={component.icon}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium h-10 flex items-center gap-2 data-[state=open]:bg-accent">
                  <TrendingUp className="h-4 w-4" />
                  <span className="relative top-[1px]">Analysis Tools</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-3 p-6 md:grid-cols-2">
                    {analysisTools.map((tool) => (
                      <ListItem
                        key={tool.title}
                        title={tool.title}
                        href={tool.href}
                        icon={tool.icon}
                      >
                        {tool.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-10 flex items-center gap-2",
                    )}
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="pb-2">Live Floats</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/research" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-10 flex items-center gap-2",
                    )}
                  >
                    <Users className="h-4 w-4" />
                    <span className="pb-2">Research</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/documentation" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-10 flex items-center gap-2",
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="pb-2">Documentation</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Column: Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button
            onClick={onOpenChat}
            className="hidden sm:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 h-10"
            size="sm"
          >
            <Bot className="h-4 w-4" />
            <span className="pr-0.5">AI Assistant</span>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-10 w-10 p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur">
          <div className="px-4 py-6 space-y-6">
            {/* Ocean Data Section */}
            <div>
              <h3 className="flex items-center text-sm font-semibold text-foreground mb-3">
                <Database className="mr-2 h-4 w-4" />
                Ocean Data
              </h3>
              <div className="space-y-2 ml-6">
                {dataComponents.map((component) => (
                  <Link
                    key={component.title}
                    href={component.href}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {component.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Analysis Tools Section */}
            <div>
              <h3 className="flex items-center text-sm font-semibold text-foreground mb-3">
                <TrendingUp className="mr-2 h-4 w-4" />
                Analysis Tools
              </h3>
              <div className="space-y-2 ml-6">
                {analysisTools.map((tool) => (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tool.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Direct Links */}
            <div className="space-y-3">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-foreground hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Live Floats
              </Link>
              <Link
                href="/research"
                className="flex items-center text-sm font-medium text-foreground hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="mr-2 h-4 w-4" />
                Research
              </Link>
              <Link
                href="/documentation"
                className="flex items-center text-sm font-medium text-foreground hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </Link>
            </div>

            {/* Mobile AI Assistant Button */}
            <Button
              onClick={() => {
                onOpenChat?.();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Enhanced ListItem component for navigation menu items
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    icon?: React.ReactNode;
  }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
