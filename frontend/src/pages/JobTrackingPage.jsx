import { useState } from "react";

const STATUSES = [
  { id: "applied",   label: "Applied",     bg: "#E6F1FB", color: "#185FA5" },
  { id: "interview", label: "Interviewed", bg: "#FAEEDA", color: "#BA7517" },
  { id: "accepted",  label: "Accepted",    bg: "#EAF3DE", color: "#3B6D11" },
  { id: "rejected",  label: "Rejected",    bg: "#FCEBEB", color: "#A32D2D" },
];

const INITIAL_APPS = [
  { id: 1, status: "interview", title: "Junior Data Analyst",     company: "NEDBANK", date: "12/01/2026", location: "Johannesburg", workType: "Full-time", interviewDate: "15/01/2026", link: "www.nedbank.co.za",        note: "" },
  { id: 2, status: "applied",   title: "Business Analyst",        company: "NEDBANK", date: "12/01/2026", location: "Cape Town",     workType: "Contract",  interviewDate: "20/01/2026", link: "www.nedbankrecruit.co.za", note: "" },
  { id: 3, status: "applied",   title: "Junior Data Scientist",   company: "NEDBANK", date: "12/01/2026", location: "Durban",        workType: "Full-time", interviewDate: "",           link: "",                         note: "" },
  { id: 4, status: "applied",   title: "Junior Sales Analyst",    company: "NEDBANK", date: "12/01/2026", location: "Pretoria",      workType: "Part-time", interviewDate: "",           link: "",                         note: "" },
  { id: 5, status: "accepted",  title: "Graduate UI/UX Designer", company: "NEDBANK", date: "12/01/2026", location: "Sandton",       workType: "Full-time", interviewDate: "18/01/2026", link: "",                         note: "" },
];

const CARDS_PER_COL = 4;
const emptyForm = { title: "", company: "", date: "", location: "", workType: "", interviewDate: "", link: "", note: "", status: "applied" };

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const [d, m, y] = dateStr.split("/");
  const diff = Math.ceil((new Date(`${y}-${m}-${d}`) - new Date()) / 86400000);
  return diff >= 0 ? diff : null;
}

function DateInput({ value, onChange, placeholder }) {
  const parts = (value || "").split("/");
  const dd = parts[0] || "";
  const mm = parts[1] || "";
  const yyyy = parts[2] || "";

  const update = (newDd, newMm, newYyyy) => {
    onChange(`${newDd}/${newMm}/${newYyyy}`);
  };

  const inputStyle = {
    border: "0.5px solid #ddd", borderRadius: 5,
    padding: "5px 6px", fontSize: 12,
    background: "#fff", color: "#1a1a18",
    outline: "none", fontFamily: "inherit",
    textAlign: "center",
  };
  const sep = { fontSize: 14, color: "#aaa", fontWeight: 600, userSelect: "none", lineHeight: 1 };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input
        value={dd} maxLength={2} placeholder="DD"
        onChange={e => {
          const v = e.target.value.replace(/\D/g, "");
          update(v, mm, yyyy);
        }}
        style={{ ...inputStyle, width: 36 }}
      />
      <span style={sep}>/</span>
      <input
        value={mm} maxLength={2} placeholder="MM"
        onChange={e => {
          const v = e.target.value.replace(/\D/g, "");
          update(dd, v, yyyy);
        }}
        style={{ ...inputStyle, width: 36 }}
      />
      <span style={sep}>/</span>
      <input
        value={yyyy} maxLength={4} placeholder="YYYY"
        onChange={e => {
          const v = e.target.value.replace(/\D/g, "");
          update(dd, mm, v);
        }}
        style={{ ...inputStyle, width: 52 }}
      />
    </div>
  );
}

function KanbanCard({ app, onEdit, onDelete, onStatusChange, dragHandlers }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...app });
  const days = daysUntil(app.interviewDate);
  const s = STATUSES.find(x => x.id === app.status);

  const handleSave = () => { onEdit(form); setEditing(false); setExpanded(false); };

  return (
    <div
      draggable
      onDragStart={(e) => dragHandlers.onDragStart(e, app.id)}
      style={{
        background: "#fff", borderRadius: 10,
        border: "0.5px solid #e0e0de", marginBottom: 10,
        cursor: "grab", overflow: "hidden",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Card header */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#1a1a18", lineHeight: 1.3 }}>{app.title}</span>
          <span style={{
            background: s.bg, color: s.color, fontSize: 10, fontWeight: 700,
            borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap",
            letterSpacing: "0.04em", textTransform: "uppercase", flexShrink: 0,
          }}>{s.label}</span>
        </div>
        <div style={{ fontSize: 11, color: "#888", marginBottom: days !== null ? 6 : 0 }}>
          {app.company} · {app.date}
        </div>
        {days !== null && (
          <span style={{ background: "#FAEEDA", color: "#BA7517", fontSize: 10, borderRadius: 20, padding: "2px 8px", fontWeight: 600 }}>
            Interview in {days} day{days !== 1 ? "s" : ""}
          </span>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button
            onClick={() => { setExpanded(v => !v); setEditing(false); }}
            style={{ background: "none", border: "none", color: "#aaa", fontSize: 11, cursor: "pointer", fontFamily: "inherit", padding: 0 }}
          >
            {expanded ? "See Less ▲" : "See More ▼"}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && !editing && (
        <div style={{ borderTop: "0.5px solid #f0f0ee", padding: "10px 14px 12px", background: "#fafafa" }}>
          <div style={{ fontSize: 12, color: "#444", marginBottom: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {app.location      && <div><span style={{ color: "#999" }}>Location: </span>{app.location}</div>}
            {app.workType      && <div><span style={{ color: "#999" }}>Work Type: </span>{app.workType}</div>}
            {app.interviewDate && <div><span style={{ color: "#999" }}>Interview: </span>{app.interviewDate}</div>}
            {app.link          && <div><span style={{ color: "#999" }}>Link: </span><a href={`https://${app.link}`} target="_blank" rel="noreferrer" style={{ color: "#185FA5", fontSize: 11 }}>{app.link}</a></div>}
            {app.note          && <div><span style={{ color: "#999" }}>Note: </span>{app.note}</div>}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setEditing(true)} style={{ background: "#E6F1FB", color: "#185FA5", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Edit</button>
            <button onClick={() => onDelete(app.id)} style={{ background: "#FCEBEB", color: "#A32D2D", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Delete</button>
          </div>
        </div>
      )}

      {/* Edit form */}
      {expanded && editing && (
        <div style={{ borderTop: "0.5px solid #f0f0ee", padding: "10px 14px 12px", background: "#fafafa" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
            {[
              { label: "Job Title", key: "title" }, { label: "Company", key: "company" },
              { label: "Location", key: "location" }, { label: "Work Type", key: "workType" },
              { label: "Link", key: "link" }, { label: "Note", key: "note" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, color: "#999", display: "block", marginBottom: 3 }}>{f.label}</label>
                <input value={form[f.key] || ""} placeholder={f.placeholder || ""}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", border: "0.5px solid #ddd", borderRadius: 5, padding: "5px 8px", fontSize: 12, background: "#fff", color: "#1a1a18", outline: "none", fontFamily: "inherit" }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 10, color: "#999", display: "block", marginBottom: 3 }}>Date Applied</label>
              <DateInput value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: "#999", display: "block", marginBottom: 3 }}>Interview Date</label>
              <DateInput value={form.interviewDate} onChange={v => setForm(p => ({ ...p, interviewDate: v }))} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: "#999", display: "block", marginBottom: 3 }}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                style={{ width: "100%", border: "0.5px solid #ddd", borderRadius: 5, padding: "5px 8px", fontSize: 12, background: "#fff", color: "#1a1a18", outline: "none", fontFamily: "inherit" }}>
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleSave} style={{ background: "#1a1a18", color: "#fff", border: "none", borderRadius: 6, padding: "4px 14px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Save</button>
            <button onClick={() => setEditing(false)} style={{ background: "#f0f0f0", color: "#555", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ status, cards, search, onEdit, onDelete, onStatusChange, dragHandlers }) {
  const [page, setPage] = useState(1);
  const filtered = cards.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.company.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / CARDS_PER_COL);
  const paginated = filtered.slice((page - 1) * CARDS_PER_COL, page * CARDS_PER_COL);

  return (
    <div
      onDrop={(e) => dragHandlers.onDrop(e, status.id)}
      onDragOver={(e) => e.preventDefault()}
      style={{ flex: 1, minWidth: 220, background: "#f4f4f2", borderRadius: 12, padding: "14px 12px", border: "0.5px solid #e0e0de" }}
    >
      {/* Column header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: status.color, display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", flex: 1 }}>{status.label}</span>
        <span style={{ background: status.bg, color: status.color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 8px" }}>
          {filtered.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ minHeight: 60 }}>
        {paginated.length === 0 ? (
          <div style={{ border: "1.5px dashed #d3d1cf", borderRadius: 10, height: 60, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 12 }}>
            Drop here
          </div>
        ) : (
          paginated.map(app => (
            <KanbanCard
              key={app.id} app={app}
              onEdit={onEdit} onDelete={onDelete}
              onStatusChange={onStatusChange}
              dragHandlers={dragHandlers}
            />
          ))
        )}
      </div>

      {/* Per-column pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 10 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ background: "#fff", border: "0.5px solid #ddd", borderRadius: 5, padding: "3px 8px", cursor: "pointer", color: "#555", fontSize: 12 }}>‹</button>
          <span style={{ fontSize: 11, color: "#888" }}>{page}/{totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ background: "#fff", border: "0.5px solid #ddd", borderRadius: 5, padding: "3px 8px", cursor: "pointer", color: "#555", fontSize: 12 }}>›</button>
        </div>
      )}
    </div>
  );
}

export default function JobTrackingPage() {
  const [apps, setApps] = useState(INITIAL_APPS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [dragId, setDragId] = useState(null);

  const handleStatusChange = (id, status) => setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const handleEdit = (updated) => setApps(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a));
  const handleDelete = (id) => setApps(prev => prev.filter(a => a.id !== id));
  const handleAdd = () => {
    if (!form.title || !form.company) return;
    setApps(prev => [...prev, { ...form, id: Date.now() }]);
    setForm({ ...emptyForm });
    setShowModal(false);
  };

  const dragHandlers = {
    onDragStart: (e, id) => setDragId(id),
    onDrop: (e, colId) => {
      e.preventDefault();
      setApps(prev => prev.map(a => a.id === dragId ? { ...a, status: colId } : a));
      setDragId(null);
    },
  };

  const counts = STATUSES.reduce((acc, s) => { acc[s.id] = apps.filter(a => a.status === s.id).length; return acc; }, {});

  return (
    <div style={{ minHeight: "100vh", background: "#f0f0ee", fontFamily: "'Segoe UI', Arial, sans-serif", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: 195, minHeight: "100vh", background: "#f7f7f5", borderRight: "0.5px solid #e0e0de", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 16px", fontWeight: 700, fontSize: 14, color: "#1a1a18", borderBottom: "0.5px solid #e8e8e6" }}>☰</div>
        {[
          { label: "Dashboard",        icon: "⊞" },
          { label: "Job Applications", icon: "☰", active: true },
          { label: "Job Posts",        icon: "📋" },
          { label: "Profile",          icon: "👤" },
        ].map(item => (
          <div key={item.label} style={{
            padding: "11px 20px", fontSize: 13,
            color: item.active ? "#185FA5" : "#555",
            background: item.active ? "#E6F1FB" : "none",
            fontWeight: item.active ? 600 : 400,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
            borderLeft: item.active ? "3px solid #185FA5" : "3px solid transparent",
          }}>
            <span style={{ fontSize: 13 }}>{item.icon}</span> {item.label}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "28px 24px 48px", minWidth: 0, overflowX: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a18" }}>Job Applications</h1>
          <button onClick={() => setShowModal(true)} style={{
            background: "#4DBFA0", color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600,
            fontFamily: "inherit",
          }}>
            ⊕ Add New Application
          </button>
        </div>

        {/* Status summary pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {STATUSES.map(s => (
            <div key={s.id} style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {counts[s.id]} {s.label}
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 18, maxWidth: 300 }}>
          <input
            type="text" placeholder="Search Job Title"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              border: "0.5px solid #ddd", borderRadius: 8,
              padding: "8px 36px 8px 14px", fontSize: 13,
              background: "#fff", color: "#1a1a18", outline: "none", fontFamily: "inherit",
            }}
          />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13 }}>🔍</span>
        </div>

        {/* Kanban board */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          {STATUSES.map(status => (
            <KanbanColumn
              key={status.id}
              status={status}
              cards={apps.filter(a => a.status === status.id)}
              search={search}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              dragHandlers={dragHandlers}
            />
          ))}
        </div>
      </div>

      {/* Add modal */}
      {showModal && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "28px 28px 24px", width: 440, border: "0.5px solid #e0e0e0", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#1a1a18" }}>Add New Application</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginBottom: 14 }}>
              {[
                { label: "Job Title *",    key: "title",    placeholder: "e.g. Data Analyst" },
                { label: "Company *",      key: "company",  placeholder: "e.g. Nedbank" },
                { label: "Location",       key: "location", placeholder: "e.g. Cape Town" },
                { label: "Work Type",      key: "workType", placeholder: "e.g. Full-time" },
                { label: "Link",           key: "link",     placeholder: "www.company.co.za" },
                { label: "Note",           key: "note",     placeholder: "Any notes..." },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, color: "#999", display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input value={form[f.key] || ""} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: "100%", boxSizing: "border-box", border: "0.5px solid #ddd", borderRadius: 6, padding: "7px 10px", fontSize: 13, background: "#fafafa", color: "#1a1a18", outline: "none", fontFamily: "inherit" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: "#999", display: "block", marginBottom: 4 }}>Date Applied</label>
                <DateInput value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#999", display: "block", marginBottom: 4 }}>Interview Date</label>
                <DateInput value={form.interviewDate} onChange={v => setForm(p => ({ ...p, interviewDate: v }))} />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, color: "#999", display: "block", marginBottom: 4 }}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                style={{ width: "100%", border: "0.5px solid #ddd", borderRadius: 6, padding: "7px 10px", fontSize: 13, background: "#fafafa", color: "#1a1a18", outline: "none", fontFamily: "inherit" }}>
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "#f0f0f0", color: "#555", border: "none", borderRadius: 6, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={handleAdd} style={{ background: "#1a1a18", color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}