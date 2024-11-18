import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-400 text-red-600 border-red-600",
      icon: Clock,
    },
    preparing: { color: "bg-blue-400 text-white border-blue-600", icon: Clock },
    ready: {
      color: "bg-green-400 text-white border-green-600",
      icon: CheckCircle2,
    },
    delivered: {
      color: "bg-purple-400 text-white border-purple-600",
      icon: CheckCircle2,
    },
    cancelled: {
      color: "bg-red-400 text-white border-red-600",
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center px-4 py-2 rounded-full text-sm font-bold gap-2
        border-2 transform rotate-2 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]
        ${config.color}
      `}
    >
      <Icon size={16} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
