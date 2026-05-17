import React from 'react';
import { FileText, MessageSquare, Zap, CheckCircle2 } from 'lucide-react';
import { Activity } from '../../types';

interface ActivityItemProps {
  title: string;
  time: string;
  type: Activity['type'];
}

export const ActivityItem = React.memo(({ title, time, type }: ActivityItemProps) => (
  <div className="flex items-center gap-4 group p-2 rounded-lg hover:bg-white/[0.03] transition-all">
    <div className={`w-8 h-8 rounded bg-[#101116] border border-white/5 flex items-center justify-center flex-shrink-0 ${
      type === 'edit' ? 'text-indigo-400' :
      type === 'comment' ? 'text-amber-400' :
      type === 'alert' ? 'text-red-400' : 'text-emerald-400'
    }`}>
      {type === 'edit' ? <FileText size={14} /> : type === 'comment' ? <MessageSquare size={14} /> : type === 'alert' ? <Zap size={14} /> : <CheckCircle2 size={14} />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-zinc-300 truncate">{title}</p>
      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight">{time}</p>
    </div>
  </div>
));
