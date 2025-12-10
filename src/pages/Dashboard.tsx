import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  Plus, 
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { ServicesManager } from '@/components/dashboard/ServicesManager';
import { ScheduleManager } from '@/components/dashboard/ScheduleManager';
import { BookingsManager } from '@/components/dashboard/BookingsManager';
import { mockBusiness } from '@/data/mockData';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const business = mockBusiness;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold text-foreground">{business.name}</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <Link to={`/b/${business.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Booking Page
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview" className="mt-0 px-4 py-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="bookings" className="mt-0 px-4 py-6">
            <BookingsManager />
          </TabsContent>

          <TabsContent value="services" className="mt-0 px-4 py-6">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="schedule" className="mt-0 px-4 py-6">
            <ScheduleManager />
          </TabsContent>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-2 z-20">
            <TabsList className="w-full h-auto bg-transparent gap-1">
              <TabsTrigger
                value="overview"
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="bookings"
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Bookings</span>
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs">Services</span>
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
              >
                <Clock className="w-5 h-5" />
                <span className="text-xs">Schedule</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
