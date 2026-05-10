import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const AGE_STYLES = {
  fresh: { bg: "#e6f7f1", color: "#4caf87", border: "#a8dfc8" },
  recent: { bg: "#e8f7f7", color: "#5bbfbf", border: "#b2e0e0" },
};

function AgeBadge() {
  const s = AGE_STYLES.recent;

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
      Active
    </span>
  );
}

function PostCard({ post, onApply }) {
  const [open, setOpen] = useState(false);

  const companyName = post.company_name || "Unknown Company";
  const initials = companyName.substring(0, 2).toUpperCase();

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #eef0f5",
        borderRadius: 14,
        overflow: "hidden",
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
            fontSize: 13,
            fontWeight: 700,
            color: "#5bbfbf",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
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
            <span>{companyName}</span>
            <span>•</span>
            <span>{post.location || "No location"}</span>
          </div>
        </div>

        <AgeBadge />

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
          }}
        >
          {open ? "▲" : "▼"}
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
              ["Work Mode", post.work_mode || "Not specified"],
              ["Closes", post.deadline_date || "Not specified"],
              ["Experience", post.experience || "Not specified"],
              ["Department", post.department || "Not specified"],
              ["Link", post.application_link || "", true],
            ].map(([label, value, isLink]) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "#8892a4",
                    marginBottom: 3,
                  }}
                >
                  {label}
                </div>

                {isLink && value ? (
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
                    Apply Link
                  </a>
                ) : (
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "#1a1f2e",
                    }}
                  >
                    {value || "Not available"}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => onApply(post)}
            style={{
              padding: "8px 16px",
              background: "#5bbfbf",
              color: "#fff",
              border: "1.5px solid #5bbfbf",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

export default function JobPostsPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await apiRequest("/job-posts/");
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch job posts:", error);
    }
  };

  const handleApply = async (post) => {
    try {
      const statuses = await apiRequest("/statuses/");
      const appliedStatus = statuses.find(
        (status) => status.name.toLowerCase() === "applied",
      );

      if (!appliedStatus) {
        alert("Applied status not found. Please add Applied in Django admin.");
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
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Could not apply. You may have already applied for this job.");
    }
  };

  const filtered = posts.filter((post) =>
    post.job_title?.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = [
    {
      label: "Total Posts",
      value: posts.length,
      bg: "#e8f7f7",
      stroke: "#5bbfbf",
    },
    {
      label: "Closing Soon",
      value: posts.filter((post) => post.deadline_date).length,
      bg: "#fdeaea",
      stroke: "#e05c5c",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f9fc",
        fontFamily: "'DM Sans', sans-serif",
        padding: "36px 40px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#1a1f2e",
          }}
        >
          Job Posts
        </h1>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "1.5px solid #eef0f5",
              borderRadius: 12,
              padding: "16px 20px",
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#8892a4",
                fontWeight: 500,
                marginBottom: 2,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#1a1f2e",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search job title..."
          style={{
            width: "100%",
            maxWidth: 340,
            padding: "10px 14px",
            border: "1.5px solid #eef0f5",
            borderRadius: 10,
            fontSize: 13.5,
            color: "#1a1f2e",
            background: "#fff",
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
            No job posts found.
          </div>
        )}
      </div>
    </div>
  );
}
