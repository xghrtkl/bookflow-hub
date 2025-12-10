import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Sparkles, ArrowRight, CheckCircle, LayoutDashboard } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative px-4 py-16 sm:py-24">
          <div className="max-w-lg mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Multi-Industry Booking Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-foreground leading-tight">
              Book Anything,{' '}
              <span className="text-primary">Anytime</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground">
              A powerful booking platform for beauty, health, education, events, 
              rentals, and more. Simple for customers, powerful for businesses.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/b/glow-beauty">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold">
                  Try Demo Booking
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                  <LayoutDashboard className="mr-2 w-5 h-5" />
                  Business Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground text-center mb-12">
            Everything You Need
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-4">
            Built for Every Industry
          </h2>
          <p className="text-muted-foreground mb-8">
            Flexible booking system that adapts to your business needs
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl gradient-primary p-8 text-center text-primary-foreground">
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4">
              Ready to Get Started?
            </h2>
            <p className="opacity-90 mb-6">
              Try the demo booking page to see how it works for your customers.
            </p>
            <Link to="/b/glow-beauty">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base font-semibold"
              >
                Open Demo Booking Page
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>Multi-Industry Booking Platform MVP</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Support for minutes, hours, or day-based bookings to fit any service type.',
  },
  {
    icon: Users,
    title: 'Multi-Capacity Slots',
    description: 'Allow multiple customers per time slot for classes, events, and group sessions.',
  },
  {
    icon: Clock,
    title: 'Real-time Availability',
    description: 'Automatic availability calculation based on existing bookings and schedules.',
  },
  {
    icon: Sparkles,
    title: 'Service Variants',
    description: 'Offer different options with custom pricing and duration for each service.',
  },
  {
    icon: CheckCircle,
    title: 'Instant Confirmation',
    description: 'Customers receive booking codes and QR codes immediately after booking.',
  },
  {
    icon: ArrowRight,
    title: 'Mobile-First Design',
    description: 'Optimized for smartphones with touch-friendly interface and fast checkout.',
  },
];

const industries = [
  '💇 Beauty & Salon',
  '🏥 Health & Wellness',
  '📚 Education & Tutoring',
  '🎉 Events & Entertainment',
  '🏠 Room & Space Rental',
  '💪 Fitness & Sports',
  '🧘 Yoga & Meditation',
  '🔧 Professional Services',
];
