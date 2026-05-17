import { useState, useEffect } from "react";
import { apiRequest } from "../api";

const quickLinks = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com",
    color: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Gmail",
    url: "https://mail.google.com",
    color: "#EA4335",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
      </svg>
    ),
  },
  {
    name: "Indeed",
    url: "https://indeed.com",
    color: "#003A9B",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M9.879 13.359v6.963H6.75V8.041h3.129v1.458c.532-.959 1.763-1.725 3.307-1.725 2.992 0 4.878 1.919 4.878 5.302v6.246h-3.129v-5.835c0-1.636-.771-2.625-2.134-2.625-1.275 0-1.922.781-1.922 2.497zM5.215 5.028a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zM3.34 8.041h3.129v12.281H3.34z" />
      </svg>
    ),
  },
  {
    name: "Careers24",
    url: "https://careers24.com",
    color: "#00A550",
    icon: <span className="font-bold text-sm text-white">C24</span>,
  },
];

function getStatusName(application) {
  return (application.status_name || "").toLowerCase();
}

function computeStats(applications) {
  return {
    applications: applications.length,
    interviews: applications.filter((application) =>
      ["interview", "interviewed", "interviewing"].includes(getStatusName(application))
    ).length,
    accepted: applications.filter((application) =>
      ["accepted", "offer"].includes(getStatusName(application))
    ).length,
    rejected: applications.filter((application) =>
      getStatusName(application) === "rejected"
    ).length,
  };
}

function GaugeChart({ stats }) {
  // Use the sum of all four values as the total so each segment is
  // proportional to the full dataset — not just applications count.
  const total =
    (stats.applications + stats.interviews + stats.accepted + stats.rejected) || 1;

  const segments = [
    { value: stats.applications, color: "#93C5CF", label: "Applications" },
    { value: stats.interviews,   color: "#E8A838", label: "Interviews"   },
    { value: stats.accepted,     color: "#7BC47B", label: "Accepted"     },
    { value: stats.rejected,     color: "#E07070", label: "Rejected"     },
  ];

  // Using pathLength="100" normalises the arc to 100 units so fractions map
  // directly to percentages. No circumference maths needed.
  // strokeDasharray = "<segmentLength> 100"
  // strokeDashoffset = -<cumulative offset>  (negative shifts forward along path)
  let cursor = 0;
  const arcs = segments.map((seg) => {
    const len = (seg.value / total) * 100;
    const offset = cursor;
    cursor += len;
    return { ...seg, len, offset };
  });

  const interviewPct = Math.round((stats.interviews / total) * 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 220, height: 120 }}>
        <svg viewBox="0 0 220 120" width="220" height="120">
          {/* Track */}
          <path
            d="M 20 110 A 90 90 0 0 1 200 110"
            fill="none"
            stroke="#E8EDF0"
            strokeWidth={22}
            strokeLinecap="butt"
          />
          {/* Colour segments — zero-gap, flush against each other */}
          {arcs.map((arc, i) =>
            arc.len > 0 ? (
              <path
                key={i}
                d="M 20 110 A 90 90 0 0 1 200 110"
                fill="none"
                stroke={arc.color}
                strokeWidth={22}
                strokeLinecap="butt"
                pathLength="100"
                strokeDasharray={`${arc.len} 100`}
                strokeDashoffset={-arc.offset}
              />
            ) : null
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-3xl font-bold text-gray-800">{interviewPct}%</span>
          <span className="text-xs text-gray-500 font-medium">Interviews</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, bg, textColor }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-2 shadow-sm" style={{ background: bg }}>
      <span className="text-sm font-medium" style={{ color: textColor, opacity: 0.85 }}>{label}</span>
      <span className="text-4xl font-bold" style={{ color: textColor }}>{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ applications: 0, interviews: 0, accepted: 0, rejected: 0 });
  const [reminder, setReminder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userRole] = useState("Job Seeker");

  useEffect(() => {
    apiRequest("/applications/")
      .then((data) => {
        setStats(computeStats(data));
        const upcoming = data.find(
          (j) =>
            ["interview", "interviewed", "interviewing"].includes(
              (j.status_name || "").toLowerCase()
            ) && j.interview_date
        );
        if (upcoming) {
          setReminder({
            title: `Interview at ${upcoming.company_name || "a company"}`,
            date: upcoming.interview_date,
            time: "",
            company: upcoming.company_name || "",
          });
        }
      })
      .catch(() => {
        setStats({ applications: 0, interviews: 0, accepted: 0, rejected: 0 });
      });
  }, []);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications((value) => !value)}
              className="relative p-2 rounded-full bg-amber-400 text-white hover:bg-amber-500 transition"
              title="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-400">Upcoming interview reminders</p>
                </div>
                {notifications.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 border-b border-gray-50 last:border-b-0">
                        <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.jobTitle}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-5 text-sm text-gray-400">No interview notifications.</p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-800">{userName}</span>
              <span className="text-xs text-gray-500">{userRole}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-8 py-6 max-w-5xl mx-auto space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Applications" value={stats.applications} bg="#C8E6EC" textColor="#1a4a54" />
          <StatCard label="Interviews"   value={stats.interviews}   bg="#E8A838" textColor="#fff" />
          <StatCard label="Accepted"     value={stats.accepted}     bg="#7BC47B" textColor="#fff" />
          <StatCard label="Rejected"     value={stats.rejected}     bg="#E07070" textColor="#fff" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Application Statistics */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Application Statistics</h2>
            <GaugeChart stats={stats} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Reminder */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Reminder</p>
              {reminder ? (
                <>
                  <p className="text-lg font-bold text-gray-900 mb-3">{reminder.title}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <span>{reminder.date}</span>
                    {reminder.time && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{reminder.time}</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-700">{reminder.company}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400">No upcoming interviews. Add jobs in Job Tracking!</p>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold text-gray-800">Quick Links</h2>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {quickLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition group-hover:scale-105"
                      style={{ background: link.color }}
                    >
                      <span className="text-white">{link.icon}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}