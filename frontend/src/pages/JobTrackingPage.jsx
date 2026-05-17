import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const STATUSES = [
  { id: "applied",   label: "Applied",     bg: "#E8F4F7", color: "#2E7A8F" },
  { id: "interview", label: "Interview",   bg: "#FEF6E7", color: "#B07A2B" },
  { id: "accepted",  label: "Accepted",    bg: "#EDFAF2", color: "#2E7D52" },
  { id: "rejected",  label: "Rejected",    bg: "#FEF0F0", color: "#C0524F" },
];

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First"   },
  { value: "oldest",    label: "Oldest First"   },
  { value: "title_az",  label: "Title A–Z"      },
  { value: "title_za",  label: "Title Z–A"      },
  { value: "company",   label: "Company A–Z"    },
  { value: "interview", label: "Interview Soon" },
];

const CARDS_PER_COL = 4;
const emptyForm = {
  title: "", company: "", date: "", location: "", workType: "",
  interviewDate: "", link: "", note: "", status: "applied",
};

function normalizeStatusId(statusName) {
  const value = (statusName || "").toLowerCase().trim();
  if (value === "interviewed") return "interview";
  if (value === "offer") return "accepted";
  return value;
}

async function getStatusForColumn(statuses, statusId) {
  const selectedStatus = statuses.find(
    (status) => normalizeStatusId(status.name) === statusId,
  );

  if (selectedStatus) return selectedStatus;

  const label = STATUSES.find((status) => status.id === statusId)?.label;
  if (!label) return null;

  return apiRequest("/statuses/", {
    method: "POST",
    body: JSON.stringify({ name: label }),
  });
}

function parseDate(str) {
  if (!str) return null;
  const [d, m, y] = str.split("/");
  if (!d || !m || !y) return null;
  return new Date(`${y}-${m}-${d}`);
}

function daysUntil(dateStr) {
  const date = parseDate(dateStr);
  if (!date) return null;
  const diff = Math.ceil((date - new Date()) / 86400000);
  return diff >= 0 ? diff : null;
}

function sortCards(cards, sortBy) {
  const sorted = [...cards];
  switch (sortBy) {
    case "newest":    return sorted.sort((a, b) => (parseDate(b.date) || 0) - (parseDate(a.date) || 0));
    case "oldest":    return sorted.sort((a, b) => (parseDate(a.date) || 0) - (parseDate(b.date) || 0));
    case "title_az":  return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title_za":  return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "company":   return sorted.sort((a, b) => a.company.localeCompare(b.company));
    case "interview": return sorted.sort((a, b) => {
      const da = parseDate(a.interviewDate);
      const db = parseDate(b.interviewDate);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    });
    default: return sorted;
  }
}

function DateInput({ value, onChange }) {
  const parts = (value || "").split("/");
  const dd = parts[0] || "";
  const mm = parts[1] || "";
  const yyyy = parts[2] || "";
  const update = (newDd, newMm, newYyyy) => onChange(`${newDd}/${newMm}/${newYyyy}`);

  const inputStyle = {
    border: "0.5px solid #e5e7eb",
    borderRadius: 6,
    padding: "5px 6px",
    fontSize: 12,
    background: "#fff",
    color: "#1a1a18",
    outline: "none",
    fontFamily: "inherit",
    textAlign: "center",
  };
  const sep = { fontSize: 14, color: "#aaa", fontWeight: 600, userSelect: "none" };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input value={dd} maxLength={2} placeholder="DD"   onChange={(e) => update(e.target.value.replace(/\D/g, ""), mm, yyyy)}   style={{ ...inputStyle, width: 36 }} />
      <span style={sep}>/</span>
      <input value={mm} maxLength={2} placeholder="MM"   onChange={(e) => update(dd, e.target.value.replace(/\D/g, ""), yyyy)}   style={{ ...inputStyle, width: 36 }} />
      <span style={sep}>/</span>
      <input value={yyyy} maxLength={4} placeholder="YYYY" onChange={(e) => update(dd, mm, e.target.value.replace(/\D/g, ""))} style={{ ...inputStyle, width: 52 }} />
    </div>
  );
}

function KanbanCard({ app, onEdit, dragHandlers }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...app });
  const daysToInterview = daysUntil(app.interviewDate);
  const s = STATUSES.find((x) => x.id === app.status);

  const handleSave = () => { onEdit(form); setEditing(false); setExpanded(false); };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    border: "0.5px solid #e5e7eb", borderRadius: 6,
    padding: "5px 8px", fontSize: 12,
    background: "#fff", color: "#1a1a18",
    outline: "none", fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 10, color: "#9ca3af", display: "block", marginBottom: 3 };

  return (
    <div
      draggable
      onDragStart={(e) => dragHandlers.onDragStart(e, app.id)}
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "0.5px solid #e5e7eb",
        marginBottom: 10,
        cursor: "grab",
        overflow: "hidden",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Card header */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#111827", lineHeight: 1.3 }}>
            {app.title}
          </span>
          <span style={{
            background: s.bg, color: s.color,
            fontSize: 10, fontWeight: 700, borderRadius: 20,
            padding: "2px 8px", whiteSpace: "nowrap",
            letterSpacing: "0.04em", textTransform: "uppercase", flexShrink: 0,
          }}>
            {s.label}
          </span>
        </div>

        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
          {app.company} · Applied {app.date}
        </div>

        {daysToInterview !== null && (
          <span style={{
            background: "#FAEEDA", color: "#BA7517",
            fontSize: 10, borderRadius: 20, padding: "2px 8px",
            fontWeight: 600, display: "inline-block",
          }}>
            {daysToInterview === 0
              ? "Interview today!"
              : `Interview in ${daysToInterview} day${daysToInterview !== 1 ? "s" : ""}`}
          </span>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button
            onClick={() => { setExpanded((v) => !v); setEditing(false); }}
            style={{ background: "none", border: "none", color: "#9ca3af", fontSize: 11, cursor: "pointer", fontFamily: "inherit", padding: 0 }}
          >
            {expanded ? "See Less ▲" : "See More ▼"}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && !editing && (
        <div style={{ borderTop: "0.5px solid #f3f4f6", padding: "10px 14px 12px", background: "#f9fafb" }}>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {app.location     && <div><span style={{ color: "#9ca3af" }}>Location: </span>{app.location}</div>}
            {app.workType     && <div><span style={{ color: "#9ca3af" }}>Work Type: </span>{app.workType}</div>}
            {app.interviewDate && <div><span style={{ color: "#9ca3af" }}>Interview: </span>{app.interviewDate}</div>}
            {app.link         && (
              <div>
                <span style={{ color: "#9ca3af" }}>Link: </span>
                <a href={`https://${app.link}`} target="_blank" rel="noreferrer" style={{ color: "#1a4a54", fontSize: 11 }}>{app.link}</a>
              </div>
            )}
            {app.note && <div><span style={{ color: "#9ca3af" }}>Note: </span>{app.note}</div>}
          </div>
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "#C8E6EC", color: "#1a4a54",
              border: "none", borderRadius: 6, padding: "4px 12px",
              fontSize: 11, cursor: "pointer", fontWeight: 600, fontFamily: "inherit",
            }}
          >
            Edit
          </button>
        </div>
      )}

      {/* Edit form */}
      {expanded && editing && (
        <div style={{ borderTop: "0.5px solid #f3f4f6", padding: "10px 14px 12px", background: "#f9fafb" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
            {[
              { label: "Job Title",  key: "title"    },
              { label: "Company",    key: "company"  },
              { label: "Location",   key: "location" },
              { label: "Work Type",  key: "workType" },
              { label: "Link",       key: "link"     },
              { label: "Note",       key: "note"     },
            ].map((f) => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input value={form[f.key] || ""} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Date Applied</label>
              <DateInput value={form.date} onChange={(v) => setForm((p) => ({ ...p, date: v }))} />
            </div>
            <div>
              <label style={labelStyle}>Interview Date</label>
              <DateInput value={form.interviewDate} onChange={(v) => setForm((p) => ({ ...p, interviewDate: v }))} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                style={{ ...inputStyle }}
              >
                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={handleSave}
              style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 6, padding: "4px 14px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{ background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ status, cards, search, sortBy, onEdit, dragHandlers }) {
  const [page, setPage] = useState(1);

  const filtered = cards.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()),
  );
  const sorted = sortCards(filtered, sortBy);
  const totalPages = Math.ceil(sorted.length / CARDS_PER_COL);
  const paginated = sorted.slice((page - 1) * CARDS_PER_COL, page * CARDS_PER_COL);

  return (
    <div
      onDrop={(e) => dragHandlers.onDrop(e, status.id)}
      onDragOver={(e) => e.preventDefault()}
      style={{
        flex: 1, minWidth: 220,
        background: "#fff",
        borderRadius: 16,
        padding: "14px 12px",
        border: "0.5px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: status.color, display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", flex: 1 }}>{status.label}</span>
        <span style={{ background: status.bg, color: status.color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 8px" }}>
          {sorted.length}
        </span>
      </div>

      <div style={{ minHeight: 60 }}>
        {paginated.length === 0 ? (
          <div style={{ border: "1.5px dashed #e5e7eb", borderRadius: 10, height: 60, display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db", fontSize: 12 }}>
            Drop here
          </div>
        ) : (
          paginated.map((app) => <KanbanCard key={app.id} app={app} onEdit={onEdit} dragHandlers={dragHandlers} />)
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 10 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#6b7280", fontSize: 12 }}>
            ‹
          </button>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{page}/{totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#6b7280", fontSize: 12 }}>
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
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [dragId, setDragId] = useState(null);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const data = await apiRequest("/applications/");
      const formatted = data.map((app) => ({
        id: app.id,
        title: app.job_title || "Unknown Job",
        company: app.company_name || "Unknown Company",
        location: app.location || "",
        link: app.application_link || "",
        status: normalizeStatusId(app.status_name) || "applied",
      }));
      setApps(formatted);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleEdit = async (updated) => {
    try {
      const statuses = await apiRequest("/statuses/");
      const selectedStatus = await getStatusForColumn(statuses, updated.status);
      if (!selectedStatus) { alert("Status not found."); return; }
      await apiRequest(`/applications/${updated.id}/`, {
        method: "PATCH",
        body: JSON.stringify({
          status: selectedStatus.id,
          interview_date: updated.interviewDate ? updated.interviewDate.split("/").reverse().join("-") : null,
          note: updated.note,
          employment_type: updated.workType || "Not specified",
        }),
      });
      fetchApplications();
    } catch (error) {
      console.error("Failed to update application:", error);
      alert("Could not save changes.");
    }
  };

  const handleAdd = async () => {
    if (!form.title || !form.company) return;
    try {
      const statuses = await apiRequest("/statuses/");
      const selectedStatus = await getStatusForColumn(statuses, form.status);
      if (!selectedStatus) { alert("Status not found."); return; }
      await apiRequest("/applications/", {
        method: "POST",
        body: JSON.stringify({
          manual_job_title: form.title,
          manual_company: form.company,
          manual_location: form.location,
          manual_application_link: form.link,
          employment_type: form.workType || "Not specified",
          work_mode: "Not specified",
          application_date: form.date ? form.date.split("/").reverse().join("-") : new Date().toISOString().split("T")[0],
          interview_date: form.interviewDate ? form.interviewDate.split("/").reverse().join("-") : null,
          note: form.note,
          status: selectedStatus.id,
        }),
      });
      await fetchApplications();
      setForm({ ...emptyForm });
      setShowModal(false);
    } catch (error) {
      console.error("Failed to add application:", error);
      alert("Could not add application.");
    }
  };

  const dragHandlers = {
    onDragStart: (e, id) => setDragId(id),
    onDrop: async (e, colId) => {
      e.preventDefault();
      try {
        const statuses = await apiRequest("/statuses/");
        const selectedStatus = await getStatusForColumn(statuses, colId);
        if (!selectedStatus) { alert("Status not found."); return; }
        await apiRequest(`/applications/${dragId}/`, {
          method: "PATCH",
          body: JSON.stringify({ status: selectedStatus.id }),
        });
        fetchApplications();
        setDragId(null);
      } catch (error) {
        console.error("Failed to move application:", error);
        alert("Could not update status.");
      }
    },
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s.id] = apps.filter((a) => a.status === s.id).length;
    return acc;
  }, {});

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    border: "0.5px solid #e5e7eb", borderRadius: 6,
    padding: "7px 10px", fontSize: 13,
    background: "#f9fafb", color: "#111827",
    outline: "none", fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 11, color: "#9ca3af", display: "block", marginBottom: 4 };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* Top bar — mirrors Dashboard header exactly */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "28px 32px",
        background: "#fff",
        borderBottom: "1px solid #f3f4f6",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827", letterSpacing: "-0.025em" }}>
          Job Tracking
        </h1>

        {/* Right-side controls — bell + add button, same structure as Dashboard's right cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#4DBFA0", color: "#fff",
              border: "none", borderRadius: 8,
              padding: "8px 20px", fontSize: 13,
              cursor: "pointer", fontWeight: 600, fontFamily: "inherit",
            }}
          >
            + Add
          </button>
        </div>
      </header>

      <div style={{ padding: "28px 32px 48px", minWidth: 0, overflowX: "auto" }}>

        {/* Status summary pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {STATUSES.map((s) => (
            <div key={s.id} style={{
              background: s.bg, color: s.color,
              borderRadius: 20, padding: "4px 14px",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              {counts[s.id]} {s.label}
            </div>
          ))}
        </div>

        {/* Search + Sort */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 300 }}>
            <input
              type="text"
              placeholder="Search job title or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                border: "0.5px solid #e5e7eb", borderRadius: 8,
                padding: "8px 36px 8px 14px", fontSize: 13,
                background: "#fff", color: "#111827",
                outline: "none", fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            />
            <svg
  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
  width="14" height="14" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round"
>
  <circle cx="11" cy="11" r="8" />
  <line x1="21" y1="21" x2="16.65" y2="16.65" />
</svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, whiteSpace: "nowrap" }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: "0.5px solid #e5e7eb", borderRadius: 8,
                padding: "7px 12px", fontSize: 12,
                background: "#fff", color: "#111827",
                outline: "none", fontFamily: "inherit", cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Kanban board */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status.id}
              status={status}
              cards={apps.filter((a) => a.status === status.id)}
              search={search}
              sortBy={sortBy}
              onEdit={handleEdit}
              dragHandlers={dragHandlers}
            />
          ))}
        </div>
      </div>

      {/* Add modal */}
      {showModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
            backdropFilter: "blur(2px)",
          }}
        >
          <div style={{
            background: "#fff", borderRadius: 16,
            padding: "28px 28px 24px", width: 440,
            border: "0.5px solid #e5e7eb",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#111827" }}>
              Add Application
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginBottom: 14 }}>
              {[
                { label: "Job Title *",  key: "title",    placeholder: "e.g. Data Analyst" },
                { label: "Company *",    key: "company",  placeholder: "e.g. Nedbank"       },
                { label: "Location",     key: "location", placeholder: "e.g. Cape Town"     },
                { label: "Work Type",    key: "workType", placeholder: "e.g. Full-time"      },
                { label: "Link",         key: "link",     placeholder: "www.company.co.za"   },
                { label: "Note",         key: "note",     placeholder: "Any notes..."        },
              ].map((f) => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    value={form[f.key] || ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Date Applied</label>
                <DateInput value={form.date} onChange={(v) => setForm((p) => ({ ...p, date: v }))} />
              </div>
              <div>
                <label style={labelStyle}>Interview Date</label>
                <DateInput value={form.interviewDate} onChange={(v) => setForm((p) => ({ ...p, interviewDate: v }))} />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                style={{ ...inputStyle }}
              >
                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 6, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
