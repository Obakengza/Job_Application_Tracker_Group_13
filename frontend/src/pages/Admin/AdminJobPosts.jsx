import { useState } from "react";

const INITIAL_POSTS = [
  {
    id: 1,
    title: "Graduate UI/UX Designer",
    company: "NEDBANK",
    location: "Cape Town",
    salary: "R18 000/mo",
    workType: "Full-time",
    workMode: "On-site",
    closes: "30/05/2026",
    experience: "0–2 years",
    department: "Design",
    link: "nedbankrecruit.co.za",
    datePosted: "2026-05-01",
  },
  {
    id: 2,
    title: "Graduate Sales Assistant",
    company: "NEDBANK",
    location: "Cape Town",
    salary: "R15 000/mo",
    workType: "Full-time",
    workMode: "Hybrid",
    closes: "25/05/2026",
    experience: "0–1 year",
    department: "Sales",
    link: "nedbankrecruit.co.za",
    datePosted: "2026-04-10",
  },
];

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
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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

  const handleSave = () => {
    if (!form.title || !form.company) return;

    if (editingPost) {
      setPosts(
        posts.map((p) =>
          p.id === editingPost.id ? { ...form, id: editingPost.id } : p,
        ),
      );
    } else {
      // Auto set today's date when adding a new post
      const today = new Date().toISOString().split("T")[0];
      setPosts([...posts, { ...form, id: Date.now(), datePosted: today }]);
    }

    setShowModal(false);
    setForm({ ...emptyForm });
    setEditingPost(null);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  // Filter by search
  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort based on selected option
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.datePosted) - new Date(a.datePosted);
    if (sortBy === "oldest")
      return new Date(a.datePosted) - new Date(b.datePosted);
    if (sortBy === "closing")
      return (
        new Date(a.closes.split("/").reverse().join("-")) -
        new Date(b.closes.split("/").reverse().join("-"))
      );
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
          <button
            onClick={handleAddNew}
            className="text-white font-bold px-5 py-2 rounded-xl transition-colors"
            style={{ background: "#E8930C" }}
          >
            + Add New Post
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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
              {posts.filter((p) => p.workType === "Full-time").length}
            </p>
          </div>
          <div
            className="bg-white border-2 rounded-2xl p-4"
            style={{ borderColor: "#C1E2E4" }}
          >
            <p className="text-gray-400 text-sm">Contract Posts</p>
            <p className="text-2xl font-bold text-gray-800">
              {posts.filter((p) => p.workType === "Contract").length}
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
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-400">{post.department}</p>
                </div>

                <p className="text-sm text-gray-600">{post.company}</p>

                <div>
                  <p className="text-sm text-gray-600">{post.location}</p>
                  <p className="text-xs text-gray-400">{post.workMode}</p>
                </div>

                {/* Posted date with colour indicator */}
                <div>
                  <p className="text-sm text-gray-600">
                    {timeAgo(post.datePosted)}
                  </p>
                  <p className="text-xs text-gray-400">{post.datePosted}</p>
                </div>

                <p className="text-sm text-gray-600">{post.closes}</p>

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
                  placeholder: "DD/MM/YYYY",
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
