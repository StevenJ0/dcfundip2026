import { getAdminStats } from "@/app/actions/admin-actions";
import { Users, FileText, Trophy, AlertCircle, ArrowUpRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const statsRes = await getAdminStats();
  const stats = statsRes.success && statsRes.data ? statsRes.data : {
    totalUsers: 0,
    totalOlimpiade: 0,
    totalLkti: 0,
    totalPending: 0
  };

  const cards = [
    {
      title: "Total Accounts",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users on platform",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      title: "Total Olimpiade",
      value: stats.totalOlimpiade,
      icon: Trophy,
      description: "Individual registrations",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20"
    },
    {
      title: "Total LKTI",
      value: stats.totalLkti,
      icon: FileText,
      description: "Team registrations",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    {
      title: "Pending Verifications",
      value: stats.totalPending,
      icon: AlertCircle,
      description: "Requires immediate action",
      color: "text-[#d5e629]",
      bg: "bg-[#d5e629]/10",
      border: "border-[#d5e629]/20"
    }
  ];

  return (
    <div className="p-8 space-y-12">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[#d5e629]/60 font-mono text-xs uppercase tracking-widest font-bold">
           <div className="w-1.5 h-1.5 rounded-full bg-[#d5e629] animate-pulse"></div>
           System Overview
        </div>
        <h1 className="text-4xl font-headline font-black text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-[#cbead1] opacity-60 max-w-2xl font-['Space_Grotesk']">
          Welcome to the DCF 2026 Internal Command Center. Monitor registrations and manage competition workflows from this hub.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title}
              className={`p-6 rounded-3xl bg-[#0a2510] border ${card.border} hover:border-[#d5e629]/40 transition-all duration-500 group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <ArrowUpRight size={20} className="text-[#cbead1]/40" />
              </div>

              <div className="flex flex-col gap-6">
                <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} shadow-lg shadow-black/20`}>
                   <Icon size={24} strokeWidth={2.5} />
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-['Space_Grotesk'] font-medium text-[#cbead1] opacity-50">
                    {card.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-headline font-black text-white tracking-tight">
                      {card.value}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-[#cbead1] opacity-30 mt-2">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Quick Links / Navigation helper */}
        <div className="rounded-[40px] bg-gradient-to-br from-[#0c2e14] to-[#041d0e] border border-[#345118]/30 p-10 flex flex-col justify-between min-h-[300px]">
           <div className="space-y-4">
              <h2 className="text-2xl font-headline font-black text-white">Competition Workflow</h2>
              <p className="text-[#cbead1]/60 font-['Space_Grotesk'] text-sm leading-relaxed">
                 Access the centralized management system for Olimpiade and LKTI. Review proof of payments, creative submissions, and verify participant identities.
              </p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <a href="/admin/olimpiade" className="py-4 px-6 rounded-2xl bg-[#345118] text-[#d5e629] font-bold text-center text-xs hover:bg-[#d5e629] hover:text-[#001809] transition-all">MANAGE OLIMPIADE</a>
              <a href="/admin/lkti" className="py-4 px-6 rounded-2xl border border-[#345118] text-[#cbead1] font-bold text-center text-xs hover:border-[#d5e629]/50 hover:text-white transition-all">MANAGE LKTI</a>
           </div>
        </div>

        <div className="rounded-[40px] bg-[#0a2510]/50 border border-[#345118]/20 p-10 flex items-center justify-center text-center">
           <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#d5e629]/10 border border-[#d5e629]/20 flex items-center justify-center mx-auto mb-6">
                 <Users size={32} className="text-[#d5e629]" />
              </div>
              <h3 className="text-xl font-headline font-black text-white">System Security</h3>
              <p className="text-[#cbead1]/40 font-['Space_Grotesk'] text-xs max-w-xs mx-auto">
                 User management allows you to promote accounts to administrative status. Always verify identity before granting core access.
              </p>
              <div className="pt-6">
                <a href="/admin/users" className="text-[#d5e629] font-bold text-xs uppercase tracking-widest border-b border-[#d5e629]/30 pb-1 hover:border-[#d5e629] transition-all">Open User Management &rarr;</a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
