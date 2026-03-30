import { useState } from "react";
import { DataProvider } from "@/context/DataContext";
import Landing from "@/components/Landing";
import Sidebar, { Section } from "@/components/Sidebar";
import DashboardView from "@/components/DashboardView";
import DataUpload from "@/components/DataUpload";
import AlertsPanel from "@/components/AlertsPanel";
import AboutSection from "@/components/AboutSection";

export default function Index() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("dashboard");

  if (!showDashboard) {
    return <Landing onEnter={() => setShowDashboard(true)} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardView />;
      case "upload": return <DataUpload />;
      case "alerts": return <AlertsPanel />;
      case "about": return <AboutSection />;
    }
  };

  const sectionTitles: Record<Section, string> = {
    dashboard: "Dashboard",
    upload: "Data Upload",
    alerts: "Alerts",
    about: "About",
  };

  return (
    <DataProvider>
      <div className="min-h-screen">
        <Sidebar
          active={activeSection}
          onNavigate={setActiveSection}
          onExit={() => setShowDashboard(false)}
        />
        <main className="ml-64 max-md:ml-16 p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground tracking-wider neon-text">
              {sectionTitles[activeSection]}
            </h1>
            <div className="h-0.5 w-20 gradient-primary mt-2 rounded-full" />
          </div>
          {renderSection()}
        </main>
      </div>
    </DataProvider>
  );
}
