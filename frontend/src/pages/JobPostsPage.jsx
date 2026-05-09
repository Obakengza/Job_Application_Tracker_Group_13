import { useState } from "react";

const POSTS = [
  {
    id: 1,
    title: "Graduate UI/UX Designer",
    company: "NEDBANK",
    location: "Cape Town",
    age: "1 Day Ago",
    ageTier: "fresh",
    salary: "R18 000/mo",
    workType: "Full-time",
    closes: "30/05/2026",
    experience: "0–2 years",
    department: "Design",
    link: "nedbankrecruit.co.za",
  },
  {
    id: 2,
    title: "Graduate Sales Assistant",
    company: "NEDBANK",
    location: "Cape Town",
    age: "2 Weeks Ago",
    ageTier: "week",
    salary: "R15 000/mo",
    workType: "Full-time",
    closes: "25/05/2026",
    experience: "0–1 year",
    department: "Sales",
    link: "nedbankrecruit.co.za",
  },
  {
    id: 3,
    title: "Senior Project Manager",
    company: "NEDBANK",
    location: "Cape Town",
    age: "3 Weeks Ago",
    ageTier: "old",
    salary: "R55 000/mo",
    workType: "Full-time",
    closes: "20/05/2026",
    experience: "5+ years",
    department: "Operations",
    link: "nedbankrecruit.co.za",
  },
  {
    id: 4,
    title: "Mathematics Lecturer",
    company: "NEDBANK",
    location: "Cape Town",
    age: "6 Days Ago",
    ageTier: "recent",
    salary: "R32 000/mo",
    workType: "Contract",
    closes: "15/06/2026",
    experience: "3+ years",
    department: "Training",
    link: "nedbankrecruit.co.za",
  },
  {
    id: 5,
    title: "Graduate Accountant",
    company: "NEDBANK",
    location: "Cape Town",
    age: "4 Weeks Ago",
    ageTier: "stale",
    salary: "R20 000/mo",
    workType: "Full-time",
    closes: "12/05/2026",
    experience: "0–2 years",
    department: "Finance",
    link: "nedbankrecruit.co.za",
  },
  {
    id: 6,
    title: "Bank Teller",
    company: "NEDBANK",
    location: "Cape Town",
    age: "11 Days Ago",
    ageTier: "week",
    salary: "R12 000/mo",
    workType: "Full-time",
    closes: "22/05/2026",
    experience: "0–1 year",
    department: "Retail Banking",
    link: "nedbankrecruit.co.za",
  },
  {
    id: 7,
    title: "Cybersecurity Analyst",
    company: "NEDBANK",
    location: "Cape Town",
    age: "9 Days Ago",
    ageTier: "recent",
    salary: "R45 000/mo",
    workType: "Full-time",
    closes: "01/06/2026",
    experience: "2–4 years",
    department: "IT Security",
    link: "nedbankrecruit.co.za",
  },
];

const AGE_STYLES = {
  fresh:  { bg: "#e6f7f1", color: "#4caf87", border: "#a8dfc8" },
  recent: { bg: "#e8f7f7", color: "#5bbfbf", border: "#b2e0e0" },
  week:   { bg: "#fffbe6", color: "#c49a00", border: "#f0d870" },
  old:    { bg: "#fff4e0", color: "#f4a535", border: "#f4c06a" },
  stale:  { bg: "#fdeaea", color: "#e05c5c", border: "#f0a0a0" },
};

const STATS = [
  {
    label: "Total Posts",
    value: "35",
    bg: "#e8f7f7",
    stroke: "#5bbfbf",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    label: "Posted This Week",
    value: "7",
    bg: "#e6f7f1",
    stroke: "#4caf87",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Applied To",
    value: "12",
    bg: "#fff4e0",
    stroke: "#f4a535",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Closing Soon",
    value: "4",
    bg: "#fdeaea",
    stroke: "#e05c5c",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
];

function AgeBadge({ age, tier }) {
  const s = AGE_STYLES[tier] || AGE_STYLES.recent;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1.5px solid ${s.border}`,
        padding: "5px 13px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {age}
    </span>
  );
}

function PostCard({ post }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #eef0f5",
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#b2e0e0";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(91,191,191,0.1)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#eef0f5";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "18px 20px",
          gap: 16,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 42, height: 42,
            borderRadius: 10,
            background: "#e8f7f7",
            border: "1.5px solid #b2e0e0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif",
            fontSize: 13, fontWeight: 700, color: "#5bbfbf",
            flexShrink: 0,
          }}
        >
          NB
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: "#1a1f2e", marginBottom: 4 }}>
            {post.title}
          </div>
          <div style={{ fontSize: 12.5, color: "#8892a4", display: "flex", alignItems: "center", gap: 6 }}>
            <span>{post.company}</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#8892a4", opacity: 0.5, display: "inline-block" }} />
            <span>{post.location}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <AgeBadge age={post.age} tier={post.ageTier} />
          <div
            onClick={e => { e.stopPropagation(); setOpen(!open); }}
            style={{
              width: 28, height: 28,
              borderRadius: 7,
              border: "1.5px solid #eef0f5",
              background: "#f7f9fc",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <svg
              viewBox="0 0 24 24" fill="none" stroke="#8892a4" strokeWidth="2.5"
              style={{ width: 12, height: 12, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {open && (
        <div
          style={{
            borderTop: "1.5px solid #eef0f5",
            padding: "16px 20px 18px",
            background: "#f7f9fc",
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 28px", flex: 1 }}>
            {[
              ["Salary", post.salary],
              ["Work Type", post.workType],
              ["Closes", post.closes],
              ["Experience", post.experience],
              ["Department", post.department],
              ["Link", post.link, true],
            ].map(([label, value, isLink]) => (
              <div key={label}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.6px", textTransform: "uppercase", color: "#8892a4", marginBottom: 3 }}>
                  {label}
                </div>
                {isLink ? (
                  <a href={`https://${value}`} style={{ color: "#5bbfbf", textDecoration: "none", fontSize: 13.5, fontWeight: 500 }}>
                    {value}
                  </a>
                ) : (
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1f2e" }}>{value}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexShrink: 0, alignSelf: "flex-start" }}>
            <button
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 16px",
                background: "#5bbfbf", color: "#fff",
                border: "1.5px solid #5bbfbf",
                borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Apply
            </button>
            <button
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 16px",
                background: "#fff", color: "#8892a4",
                border: "1.5px solid #eef0f5",
                borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobPostsPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = POSTS.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fc", fontFamily: "'DM Sans', sans-serif", padding: "36px 40px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, color: "#1a1f2e", letterSpacing: "-0.5px" }}>
          Job Posts
        </h1>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#5bbfbf", color: "#fff",
          border: "none", padding: "11px 20px",
          borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13.5, fontWeight: 600, cursor: "pointer",
        }}>
          + Add New Post
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: "#fff", border: "1.5px solid #eef0f5",
            borderRadius: 12, padding: "16px 20px",
            flex: 1, display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.stroke }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#8892a4", fontWeight: 500, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#1a1f2e" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#8892a4" strokeWidth="2"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search job title..."
            style={{
              width: "100%", padding: "10px 14px 10px 40px",
              border: "1.5px solid #eef0f5", borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
              color: "#1a1f2e", background: "#fff", outline: "none",
            }}
          />
        </div>
        {["Filter", "Cape Town"].map(label => (
          <button key={label} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 16px", border: "1.5px solid #eef0f5",
            background: "#fff", borderRadius: 10,
            fontSize: 13, fontWeight: 500, color: "#8892a4", cursor: "pointer",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length > 0 ? (
          filtered.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#8892a4", fontSize: 14 }}>
            No posts match "{search}"
          </div>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 28 }}>
        <button style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid #eef0f5", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#8892a4" strokeWidth="2.5" style={{ width: 13, height: 13 }}><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        {[1, 2].map(n => (
          <button
            key={n}
            onClick={() => setCurrentPage(n)}
            style={{
              width: 36, height: 36, borderRadius: 9,
              border: `1.5px solid ${currentPage === n ? "#5bbfbf" : "#eef0f5"}`,
              background: currentPage === n ? "#5bbfbf" : "#fff",
              color: currentPage === n ? "#fff" : "#8892a4",
              fontSize: 13.5, fontWeight: 600, cursor: "pointer",
            }}
          >
            {n}
          </button>
        ))}
        <span style={{ fontSize: 13, color: "#8892a4", padding: "0 4px" }}>...</span>
        <button style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid #eef0f5", background: "#fff", color: "#8892a4", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>5</button>
        <button style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid #eef0f5", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#8892a4" strokeWidth="2.5" style={{ width: 13, height: 13 }}><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

    </div>
  );
}