import { Calendar, Users, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { mockServices, mockBookings, formatPrice } from '@/data/mockData';

export function DashboardOverview() {
  // Mock stats for demo
  const stats = {
    todayBookings: 5,
    weekBookings: 23,
    totalRevenue: 450000000, // 4,500,000 IDR
    completedToday: 3,
    pendingToday: 2,
    activeServices: mockServices.filter(s => s.isActive).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold font-display text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">Your business at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Calendar}
          label="Today's Bookings"
          value={stats.todayBookings.toString()}
          trend="+2 from yesterday"
          color="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="This Week"
          value={stats.weekBookings.toString()}
          trend="+15% vs last week"
          color="success"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed Today"
          value={stats.completedToday.toString()}
          color="success"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending"
          value={stats.pendingToday.toString()}
          color="warning"
        />
      </div>

      {/* Revenue Card */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Revenue This Month</h3>
          <span className="text-xs text-muted-foreground">Dec 2024</span>
        </div>
        <p className="text-3xl font-bold text-primary">
          {formatPrice(stats.totalRevenue, 'IDR')}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          From {stats.weekBookings} bookings
        </p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickActionButton icon={Users} label="Add Walk-in" />
          <QuickActionButton icon={Clock} label="Block Time" />
        </div>
      </div>

      {/* Upcoming Bookings Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Upcoming Today</h3>
          <span className="text-sm text-primary font-medium">View all</span>
        </div>
        
        <div className="space-y-3">
          {upcomingBookings.map((booking, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-card border border-border flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary">
                  {booking.customerName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {booking.customerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {booking.service} • {booking.time}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                booking.status === 'confirmed' 
                  ? 'bg-success/10 text-success' 
                  : 'bg-warning/10 text-warning'
              }`}>
                {booking.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  color: 'primary' | 'success' | 'warning';
}

function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      {trend && (
        <p className="text-xs text-success mt-1">{trend}</p>
      )}
    </div>
  );
}

function QuickActionButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors flex items-center gap-3">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <span className="font-medium text-foreground">{label}</span>
    </button>
  );
}

// Mock upcoming bookings
const upcomingBookings = [
  {
    customerName: 'Sarah Johnson',
    service: 'Haircut & Styling',
    time: '10:00 AM',
    status: 'confirmed',
  },
  {
    customerName: 'Michael Chen',
    service: 'Hair Coloring',
    time: '11:30 AM',
    status: 'confirmed',
  },
  {
    customerName: 'Emma Wilson',
    service: 'Manicure',
    time: '2:00 PM',
    status: 'pending',
  },
];
