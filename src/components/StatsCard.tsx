import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  gradient,
  trend,
}: StatsCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 text-white ${gradient} shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      {/* Background Icon */}
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
        <Icon size={120} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <Icon size={24} className="opacity-80" />
        </div>

        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold">{value}</p>

          {trend && (
            <div
              className={`text-sm font-medium ${
                trend.isPositive ? "text-green-200" : "text-red-200"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
