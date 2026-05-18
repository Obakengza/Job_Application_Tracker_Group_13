import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../api";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  salary: "",
  workType: "",
  workMode: "",
  closes: "",
  experience: "",
  department: "",
  link: "",
  datePosted: "",
};

// Helper to show how long ago a post was made
function timeAgo(dateStr) {
  if (!dateStr) return "Unknown";
  const posted = new Date(dateStr);
  const now = new Date();
  const days = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30)
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

function AdminJobPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await apiRequest("/job-posts/", { auth: false });
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch job posts:", error);
    }
  };

  const handleAddNew = () => {
    setEditingPost(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setForm({ ...post });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title && !form.job_title) return;
    const salary = String(form.salary || "").replace(/[^\d.]/g, "");

    try {
      const payload = {
        job_title: form.title || form.job_title,
        company_name: form.company || form.company_name,
        location: form.location,
        salary: salary || null,
        employment_type: form.workType || form.employment_type,
        work_mode: form.workMode || form.work_mode,
        deadline_date: form.closes || form.deadline_date,
        experience: form.experience,
        department: form.department,
        application_link: form.link || form.application_link,
        post_date:
          form.datePosted ||
          form.post_date ||
          new Date().toISOString().split("T")[0],
      };

      if (editingPost) {
        await apiRequest(`/job-posts/${editingPost.id}/`, {
          method: "PATCH",
          auth: false,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/job-posts/", {
          method: "POST",
          auth: false,
          body: JSON.stringify(payload),
        });
      }

      await fetchPosts();

      setShowModal(false);
      setForm({ ...emptyForm });
      setEditingPost(null);
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Could not save post.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/job-posts/${id}/`, {
        method: "DELETE",
      });

      await fetchPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Could not delete post.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  // Filter by search
  const filtered = posts.filter(
    (p) =>
      p.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      p.company_name?.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort based on selected option
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.post_date) - new Date(a.post_date);

    if (sortBy === "oldest")
      return new Date(a.post_date) - new Date(b.post_date);

    if (sortBy === "closing")
      return new Date(a.deadline_date) - new Date(b.deadline_date);

    return 0;
  });

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Job Posts</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage all job posts visible to users
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="font-bold px-5 py-2 rounded-xl border border-red-200 text-red-500 bg-white hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
            <button
              onClick={handleAddNew}
              className="text-white font-bold px-5 py-2 rounded-xl transition-colors"
              style={{ background: "#E8930C" }}
            >
              + Add New Post
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div
            className="bg-white border-2 rounded-2xl p-4"
            style={{ borderColor: "#C1E2E4" }}
          >
            <p className="text-gray-400 text-sm">Total Posts</p>
            <p className="text-2xl font-bold text-gray-800">{posts.length}</p>
          </div>

          <div
            className="bg-white border-2 rounded-2xl p-4"
            style={{ borderColor: "#C1E2E4" }}
          >
            <p className="text-gray-400 text-sm">Full-time Posts</p>
            <p className="text-2xl font-bold text-gray-800">
              {posts.filter((p) => p.employment_type === "Full-time").length}
            </p>
          </div>

          <div
            className="bg-white border-2 rounded-2xl p-4"
            style={{ borderColor: "#C1E2E4" }}
          >
            <p className="text-gray-400 text-sm">Contract Posts</p>
            <p className="text-2xl font-bold text-gray-800">
              {posts.filter((p) => p.employment_type === "Contract").length}
            </p>
          </div>

          <div
            className="bg-white border-2 rounded-2xl p-4"
            style={{ borderColor: "#C1E2E4" }}
          >
            <p className="text-gray-400 text-sm">Part-time Posts</p>
            <p className="text-2xl font-bold text-gray-800">
              {posts.filter((p) => p.employment_type === "Part-time").length}
            </p>
          </div>

          <div
            className="bg-white border-2 rounded-2xl p-4"
            style={{ borderColor: "#C1E2E4" }}
          >
            <p className="text-gray-400 text-sm">Internships</p>
            <p className="text-2xl font-bold text-gray-800">
              {posts.filter((p) => p.employment_type === "Internship").length}
            </p>
          </div>
        </div>

        {/* Search and sort row */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by job title or company..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Sort dropdown */}
          <select
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-white text-gray-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="closing">Closing Soon</option>
          </select>
        </div>

        {/* Posts table */}
        <div
          className="bg-white border-2 rounded-2xl overflow-hidden"
          style={{ borderColor: "#C1E2E4" }}
        >
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase">
              Job Title
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase">Company</p>
            <p className="text-xs font-bold text-gray-400 uppercase">
              Location
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase">Posted</p>
            <p className="text-xs font-bold text-gray-400 uppercase">Closes</p>
            <p className="text-xs font-bold text-gray-400 uppercase">Actions</p>
          </div>

          {/* Table rows */}
          {sorted.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No posts found
            </div>
          ) : (
            sorted.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-50 items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {post.job_title}
                  </p>
                  <p className="text-xs text-gray-400">{post.department}</p>
                </div>

                <p className="text-sm text-gray-600">{post.company_name}</p>

                <div>
                  <p className="text-sm text-gray-600">{post.location}</p>
                  <p className="text-xs text-gray-400">{post.work_mode}</p>
                </div>

                {/* Posted date with colour indicator */}
                <div>
                  <p className="text-sm text-gray-600">
                    {timeAgo(post.post_date)}
                  </p>
                  <p className="text-xs text-gray-400">{post.post_date}</p>
                </div>

                <p className="text-sm text-gray-600">{post.deadline_date}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-xs font-bold px-3 py-1 rounded-lg border"
                    style={{ color: "#E8930C", borderColor: "#E8930C" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-xs font-bold px-3 py-1 rounded-lg border border-red-200 text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.25)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              {editingPost ? "Edit Job Post" : "Add New Job Post"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Job Title *",
                  key: "title",
                  placeholder: "e.g. Data Analyst",
                },
                {
                  label: "Company *",
                  key: "company",
                  placeholder: "e.g. Nedbank",
                },
                {
                  label: "Location",
                  key: "location",
                  placeholder: "e.g. Cape Town",
                },
                {
                  label: "Salary",
                  key: "salary",
                  placeholder: "e.g. R20 000/mo",
                },
                {
                  label: "Experience",
                  key: "experience",
                  placeholder: "e.g. 0–2 years",
                },
                {
                  label: "Department",
                  key: "department",
                  placeholder: "e.g. Finance",
                },
                {
                  label: "Closing Date",
                  key: "closes",
                  placeholder: "YYYY-MM-DD",
                },
                {
                  label: "Link",
                  key: "link",
                  placeholder: "www.company.co.za",
                },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-gray-400 mb-1 block">
                    {f.label}
                  </label>
                  <input
                    type={f.key === "closes" ? "date" : "text"}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    placeholder={f.placeholder}
                    value={form[f.key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                  />
                </div>
              ))}

              {/* Work Type dropdown */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Work Type
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                  value={form.workType}
                  onChange={(e) =>
                    setForm({ ...form, workType: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              {/* Work Mode dropdown */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Work Mode
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                  value={form.workMode}
                  onChange={(e) =>
                    setForm({ ...form, workMode: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  <option>On-site</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>

            {/* Modal buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-white text-sm font-bold"
                style={{ background: "#E8930C" }}
              >
                {editingPost ? "Save Changes" : "Add Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminJobPosts;
