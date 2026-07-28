import React from 'react';
import { Calendar, User, Clock, CheckCircle, Settings } from 'lucide-react';

export default function SideRail({ activeDrawer, onOpenDrawer, reviewBadge }) {
  const formatShort = (date) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[date.getMonth()] + " " + date.getDate();
  };

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  const icons = [
    { id: 'board', icon: Calendar, title: 'Board', active: true },
    { id: 'account', icon: User, title: 'Account' },
    { id: 'activity', icon: Clock, title: 'Recent Activity' },
    { id: 'review', icon: CheckCircle, title: 'Review', badge: reviewBadge },
    { id: 'settings', icon: Settings, title: 'Settings' },
  ];

  return (
    <div className="rail">
      <div className="rail-logo"></div>
      {icons.map(item => (
        <div
          key={item.id}
          className={`rail-icon ${activeDrawer === item.id ? 'active' : ''}`}
          title={item.title}
          onClick={() => onOpenDrawer(item.id)}
        >
          <item.icon size={18} />
          {item.badge > 0 && (
            <span className="rail-badge">{item.badge}</span>
          )}
        </div>
      ))}
      <div className="rail-bottom">
        {hh}:{mm}<br/>{formatShort(now)}
      </div>
    </div>
  );
}

