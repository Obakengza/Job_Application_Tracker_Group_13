import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const STATUSES = [
  { id: "applied", label: "Applied", bg: "#E6F1FB", color: "#185FA5" },
  { id: "interview", label: "Interviewed", bg: "#FAEEDA", color: "#BA7517" },
  { id: "accepted", label: "Accepted", bg: "#EAF3DE", color: "#3B6D11" },
  { id: "rejected", label: "Rejected", bg: "#FCEBEB", color: "#A32D2D" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title_az", label: "Title A–Z" },
  { value: "title_za", label: "Title Z–A" },
  { value: "company", label: "Company A–Z" },
  { value: "interview", label: "Interview Soon" },
];

const CARDS_PER_COL = 4;

function normalizeStatus(status) {
  return String(status || "")
    .toLowerCase()
    .replace("interviewed", "interview")
    .replace("offered", "accepted");
}

function mapApplication(app) {
  return {
    id: app.id,
    status: normalizeStatus(app.status_name || app.status?.name || app.status),
    title: app.job_title || app.job_post_title || `Job Post #${app.job_post}`,
    company: app.company_name || "Company not shown",
    date: app.application_date || "",
    location: app.location || "",
    workType: app.employment_type || "",
    interviewDate: app.interview_date || "",
    link: app.application_link || "",
    note: app.note || "",
  };
}

function parseDate(str) {
  if (!str) return null;

  if (str.includes("-")) {
    return new Date(str);
  }

  const [d, m, y] = str.split("/");
  if (!d || !m || !y) return null;
  return new Date(`${y}-${m}-${d}`);
}

function sortCards(cards, sortBy) {
  const sorted = [...cards];

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) => (parseDate(b.date) || 0) - (parseDate(a.date) || 0),
      );
    case "oldest":
      return sorted.sort(
        (a, b) => (parseDate(a.date) || 0) - (parseDate(b.date) || 0),
      );
    case "title_az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title_za":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "company":
      return sorted.sort((a, b) => a.company.localeCompare(b.company));
    default:
      return sorted;
  }
}

function KanbanCard({ app, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const s = STATUSES.find((x) => x.id === app.status) || STATUSES[0];

  return (
    <div
      draggable
      style={{
        background: "#fff",
        borderRadius: 10,
        border: "0.5px solid #e0e0de",
        marginBottom: 10,
        cursor: "grab",
        overflow: "hidden",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ padding: "12px 14px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#1a1a18",
              lineHeight: 1.3,
            }}
          >
            {app.title}
          </span>

          <span
            style={{
              background: s.bg,
              color: s.color,
              fontSize: 10,
              fontWeight: 700,
              borderRadius: 20,
              padding: "2px 8px",
              whiteSpace: "nowrap",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            {s.label}
          </span>
        </div>

        <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>
          {app.company} · Applied {app.date}
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}
        >
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            {expanded ? "See Less ▲" : "See More ▼"}
          </button>
        </div>
      </div>

      {expanded && (
        <div
          style={{
            borderTop: "0.5px solid #f0f0ee",
            padding: "10px 14px 12px",
            background: "#fafafa",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#444",
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {app.location && (
              <div>
                <span style={{ color: "#999" }}>Location: </span>
                {app.location}
              </div>
            )}

            {app.workType && (
              <div>
                <span style={{ color: "#999" }}>Work Type: </span>
                {app.workType}
              </div>
            )}
            {app.interviewDate && (
              <div>
                <span style={{ color: "#999" }}>Interview Date: </span>
                {app.interviewDate}
              </div>
            )}
            <div>
              <span style={{ color: "#999" }}>Change Status: </span>
              <select
                value={app.status}
                onChange={(e) => onStatusChange(app.id, e.target.value)}
                style={{
                  border: "0.5px solid #ddd",
                  borderRadius: 5,
                  padding: "5px 8px",
                  fontSize: 12,
                  background: "#fff",
                  color: "#1a1a18",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              >
                {STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {app.link && (
              <div>
                <span style={{ color: "#999" }}>Link: </span>
                <a
                  href={
                    app.link.startsWith("http")
                      ? app.link
                      : `https://${app.link}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#185FA5", fontSize: 11 }}
                >
                  {app.link}
                </a>
              </div>
            )}

            {app.note && (
              <div>
                <span style={{ color: "#999" }}>Note: </span>
                {app.note}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ status, cards, search, sortBy, onStatusChange }) {
  const [page, setPage] = useState(1);

  const filtered = cards.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = sortCards(filtered, sortBy);
  const totalPages = Math.ceil(sorted.length / CARDS_PER_COL);
  const paginated = sorted.slice(
    (page - 1) * CARDS_PER_COL,
    page * CARDS_PER_COL,
  );

  return (
    <div
      style={{
        flex: 1,
        minWidth: 220,
        background: "#f4f4f2",
        borderRadius: 12,
        padding: "14px 12px",
        border: "0.5px solid #e0e0de",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: status.color,
            display: "inline-block",
            flexShrink: 0,
          }}
        />

        <span
          style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", flex: 1 }}
        >
          {status.label}
        </span>

        <span
          style={{
            background: status.bg,
            color: status.color,
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 20,
            padding: "2px 8px",
          }}
        >
          {sorted.length}
        </span>
      </div>

      <div style={{ minHeight: 60 }}>
        {paginated.length === 0 ? (
          <div
            style={{
              border: "1.5px dashed #d3d1cf",
              borderRadius: 10,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#bbb",
              fontSize: 12,
            }}
          >
            Drop here
          </div>
        ) : (
          paginated.map((app) => (
            <KanbanCard
              key={app.id}
              app={app}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            marginTop: 10,
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              background: "#fff",
              border: "0.5px solid #ddd",
              borderRadius: 5,
              padding: "3px 8px",
              cursor: "pointer",
              color: "#555",
              fontSize: 12,
            }}
          >
            ‹
          </button>

          <span style={{ fontSize: 11, color: "#888" }}>
            {page}/{totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              background: "#fff",
              border: "0.5px solid #ddd",
              borderRadius: 5,
              padding: "3px 8px",
              cursor: "pointer",
              color: "#555",
              fontSize: 12,
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default function JobTrackingPage() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await apiRequest("/applications/");
      const mappedApps = data.map(mapApplication);
      setApps(mappedApps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };
  const handleStatusChange = async (applicationId, newStatusName) => {
    try {
      const statuses = await apiRequest("/statuses/");

      const selectedStatus = statuses.find(
        (status) => status.name.toLowerCase() === newStatusName.toLowerCase(),
      );

      if (!selectedStatus) {
        alert("Status not found.");
        return;
      }

      await apiRequest(`/applications/${applicationId}/`, {
        method: "PATCH",
        body: JSON.stringify({
          status: selectedStatus.id,
        }),
      });

      fetchApplications();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Could not update application status.");
    }
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s.id] = apps.filter((a) => a.status === s.id).length;
    return acc;
  }, {});

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f0ee",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{ padding: "28px 24px 48px", minWidth: 0, overflowX: "auto" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#1a1a18",
            }}
          >
            Job Tracking Page
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {STATUSES.map((s) => (
            <div
              key={s.id}
              style={{
                background: s.bg,
                color: s.color,
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {counts[s.id]} {s.label}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 18,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{ position: "relative", flex: "1 1 240px", maxWidth: 300 }}
          >
            <input
              type="text"
              placeholder="Search Job Title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "0.5px solid #ddd",
                borderRadius: 8,
                padding: "8px 36px 8px 14px",
                fontSize: 13,
                background: "#fff",
                color: "#1a1a18",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            <span
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
                fontSize: 13,
              }}
            >
              🔍
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                color: "#888",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Sort by:
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: "0.5px solid #ddd",
                borderRadius: 8,
                padding: "7px 12px",
                fontSize: 12,
                background: "#fff",
                color: "#1a1a18",
                outline: "none",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status.id}
              status={status}
              cards={apps.filter((a) => a.status === status.id)}
              search={search}
              sortBy={sortBy}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
