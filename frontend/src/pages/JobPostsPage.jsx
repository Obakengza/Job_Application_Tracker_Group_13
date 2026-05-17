import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const AGE_STYLES = {
  fresh: { bg: "#e6f7f1", color: "#4caf87", border: "#a8dfc8" },
  recent: { bg: "#e8f7f7", color: "#5bbfbf", border: "#b2e0e0" },
  week: { bg: "#fffbe6", color: "#c49a00", border: "#f0d870" },
  old: { bg: "#fff4e0", color: "#f4a535", border: "#f4c06a" },
  stale: { bg: "#fdeaea", color: "#e05c5c", border: "#f0a0a0" },
};

function getPostAge(postDate) {
  if (!postDate) return { age: "Active", ageTier: "recent" };

  const today = new Date();
  const posted = new Date(postDate);
  const diffDays = Math.floor((today - posted) / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return { age: "1 Day Ago", ageTier: "fresh" };
  if (diffDays <= 7) return { age: `${diffDays} Days Ago`, ageTier: "recent" };
  if (diffDays <= 14) return { age: "2 Weeks Ago", ageTier: "week" };
  if (diffDays <= 21) return { age: "3 Weeks Ago", ageTier: "old" };

  return { age: "4 Weeks Ago", ageTier: "stale" };
}

function PostCard({ post, onApply }) {
  const [open, setOpen] = useState(false);
  const ageInfo = getPostAge(post.post_date);
  const s = AGE_STYLES[ageInfo.ageTier] || AGE_STYLES.recent;

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #eef0f5",
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#b2e0e0";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(91,191,191,0.1)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
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
            width: 42,
            height: 42,
            borderRadius: 10,
            background: "#e8f7f7",
            border: "1.5px solid #b2e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#5bbfbf",
            flexShrink: 0,
          }}
        >
          {(post.company_name || "NA").substring(0, 2).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#1a1f2e",
              marginBottom: 4,
            }}
          >
            {post.job_title}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "#8892a4",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{post.company_name || "Unknown Company"}</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "#8892a4",
                opacity: 0.5,
                display: "inline-block",
              }}
            />
            <span>{post.location || "No location"}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              background: s.bg,
              color: s.color,
              border: `1.5px solid ${s.border}`,
              padding: "5px 13px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {ageInfo.age}
          </span>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: "1.5px solid #eef0f5",
              background: "#f7f9fc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8892a4"
              strokeWidth="2.5"
              style={{
                width: 12,
                height: 12,
                transform: open ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s",
              }}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px 28px",
              flex: 1,
            }}
          >
            {[
              ["Salary", post.salary || "Not specified"],
              ["Work Type", post.employment_type || "Not specified"],
              ["Closes", post.deadline_date || "No deadline"],
              ["Experience", post.experience || "Not specified"],
              ["Department", post.department || "Not specified"],
              ["Link", post.application_link || "No link", true],
            ].map(([label, value, isLink]) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                    color: "#8892a4",
                    marginBottom: 3,
                  }}
                >
                  {label}
                </div>
                {isLink && value !== "No link" ? (
                  <a
                    href={value.startsWith("http") ? value : `https://${value}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#5bbfbf",
                      textDecoration: "none",
                      fontSize: 13.5,
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </a>
                ) : (
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "#1a1f2e",
                    }}
                  >
                    {value}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => onApply(post)}
              style={{
                padding: "8px 16px",
                background: "#5bbfbf",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Apply
            </button>

            <button
              style={{
                padding: "8px 16px",
                background: "#fff",
                color: "#8892a4",
                border: "1.5px solid #eef0f5",
                borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
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
  const [posts, setPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts();
    fetchApplications();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await apiRequest("/job-posts/");
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch job posts:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await apiRequest("/applications/");
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleApply = async (post) => {
    try {
      const statuses = await apiRequest("/statuses/");
      const appliedStatus = statuses.find(
        (status) => status.name.toLowerCase() === "applied",
      );

      if (!appliedStatus) {
        alert("Applied status not found.");
        return;
      }

      await apiRequest("/applications/", {
        method: "POST",
        body: JSON.stringify({
          job_post: post.id,
          status: appliedStatus.id,
          application_date: new Date().toISOString().split("T")[0],
          employment_type: post.employment_type || "Not specified",
          work_mode: post.work_mode || "Not specified",
        }),
      });

      alert("Application created successfully!");
      fetchApplications();
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Could not apply. You may have already applied.");
    }
  };

  const totalPosts = posts.length;

  const postedThisWeek = posts.filter((post) => {
    if (!post.post_date) return false;
    const today = new Date();
    const postDate = new Date(post.post_date);
    const diffDays = (today - postDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  const closingSoon = posts.filter((post) => {
    if (!post.deadline_date) return false;
    const today = new Date();
    const deadline = new Date(post.deadline_date);
    const diffDays = (deadline - today) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 14;
  }).length;

  const STATS = [
    { label: "Total Posts",      value: totalPosts,          bg: "#9fd4d4" },
    { label: "Posted This Week", value: postedThisWeek,      bg: "#a8dfc8" },
    { label: "Applied To",       value: applications.length, bg: "#f4c06a" },
    { label: "Closing Soon",     value: closingSoon,         bg: "#f0a0a0" },
  ];

  const filtered = posts.filter((p) => {
    const matchesSearch = p.job_title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation = p.location
      ?.toLowerCase()
      .includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div style={{ background: "#f4f6fb", minHeight: "100vh" }}>

      <div
        style={{
          background: "#fff",
          padding: "28px 40px 20px",
          borderBottom: "1.5px solid #eef0f5",
        }}
      >
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: "#1a1f2e",
            letterSpacing: "-0.5px",
            margin: 0,
          }}
        >
          Job Posts
        </h1>
      </div>

      <div style={{ padding: "32px 40px" }}>

        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                borderRadius: 14,
                padding: "24px 22px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 13, color: "#1a1f2eaa", fontWeight: 500 }}>
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#1a1f2e",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8892a4"
              strokeWidth="2"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 15,
                height: 15,
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title..."
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                border: "1.5px solid #eef0f5",
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13.5,
                color: "#1a1f2e",
                background: "#fff",
                outline: "none",
              }}
            />
          </div>

          <input
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by location"
            style={{
              padding: "9px 16px",
              border: "1.5px solid #eef0f5",
              background: "#fff",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              color: "#8892a4",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length > 0 ? (
            filtered.map((post) => (
              <PostCard key={post.id} post={post} onApply={handleApply} />
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "#8892a4",
                fontSize: 14,
              }}
            >
              No posts match "{search}"
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 28,
          }}
        >
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: "1.5px solid #eef0f5",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8892a4"
              strokeWidth="2.5"
              style={{ width: 13, height: 13 }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {[1, 2].map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                border: `1.5px solid ${currentPage === n ? "#5bbfbf" : "#eef0f5"}`,
                background: currentPage === n ? "#5bbfbf" : "#fff",
                color: currentPage === n ? "#fff" : "#8892a4",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {n}
            </button>
          ))}
          <span style={{ fontSize: 13, color: "#8892a4" }}>...</span>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: "1.5px solid #eef0f5",
              background: "#fff",
              color: "#8892a4",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            5
          </button>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: "1.5px solid #eef0f5",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8892a4"
              strokeWidth="2.5"
              style={{ width: 13, height: 13 }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
