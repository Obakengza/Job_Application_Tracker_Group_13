import { useEffect, useState } from "react";

function ProfilePage() {
  const [isEditingTop, setIsEditingTop] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    role: "Job Seeker",
    location: "South Africa",
  });

  const [personal, setPersonal] = useState({
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    province: "",
    country: "",
    bio: "",
  });

  const [education, setEducation] = useState({
    university: "North West University",
    qualification: "Bsc Computer Science & Mathematics",
    certificates: "Microsoft AI Fluency",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await fetch("http://127.0.0.1:8000/api/auth/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        setProfile({
          name: `${data.first_name} ${data.last_name}`,
          role: "Job Seeker",
          location: "South Africa",
        });

        setPersonal({
          firstName: data.first_name,
          surname: data.last_name,
          email: data.email,
          phone: "",
          province: "",
          country: "South Africa",
          bio: "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="mx-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Profile
          </h1>
        </header>

        {/* Top card */}
        <div className="p-8">
          <div className="bg-white border-2 border-yellow-400 rounded-2xl p-8 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Profile picture - click to change */}
              <div className="relative">
                <img
                  src={profile.picture || "https://via.placeholder.com/80"}
                  alt="Profile"
                  className="rounded-full w-20 h-20 object-cover cursor-pointer"
                  onClick={() =>
                    document.getElementById("pictureInput").click()
                  }
                />
                <input
                  id="pictureInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setProfile({ ...profile, picture: imageUrl });
                    }
                  }}
                />
                {/* Small camera icon on the image */}
                <div
                  className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-1 cursor-pointer"
                  onClick={() =>
                    document.getElementById("pictureInput").click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>
              <div>
                {isEditingTop ? (
                  <div className="flex flex-col gap-2">
                    <input
                      className="border border-gray-300 rounded px-2 py-1"
                      value={profile.name}
                      placeholder="Full Name"
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                    <input
                      className="border border-gray-300 rounded px-2 py-1"
                      value={profile.role}
                      placeholder="Role e.g. Data Analyst"
                      onChange={(e) =>
                        setProfile({ ...profile, role: e.target.value })
                      }
                    />
                    <input
                      className="border border-gray-300 rounded px-2 py-1"
                      value={profile.location}
                      placeholder="City, Country"
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    <p className="text-gray-500">{profile.role}</p>
                    <p className="text-gray-500">{profile.location}</p>
                  </div>
                )}
              </div>
            </div>

            {isEditingTop ? (
              <button
                onClick={() => setIsEditingTop(false)}
                className="bg-yellow-400 rounded-lg px-4 py-1 text-sm font-bold"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditingTop(true)}
                className="border border-gray-300 rounded-lg px-4 py-1 text-sm flex items-center gap-1"
              >
                Edit
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
          </div>

          {/* Personal Information card */}
          <div className="bg-white border-2 border-yellow-400 rounded-2xl p-8 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Personal Information</h3>

              {isEditingPersonal ? (
                <button
                  onClick={() => setIsEditingPersonal(false)}
                  className="bg-yellow-400 rounded-lg px-4 py-1 text-sm font-bold"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="border border-gray-300 rounded-lg px-4 py-1 text-sm flex items-center gap-1"
                >
                  Edit
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                {isEditingPersonal ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={personal.firstName}
                    placeholder="First Name"
                    onChange={(e) =>
                      setPersonal({ ...personal, firstName: e.target.value })
                    }
                  />
                ) : (
                  <p>{personal.firstName}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Surname</p>
                {isEditingPersonal ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={personal.surname}
                    placeholder="Surname"
                    onChange={(e) =>
                      setPersonal({ ...personal, surname: e.target.value })
                    }
                  />
                ) : (
                  <p>{personal.surname}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email Address</p>
                {isEditingPersonal ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={personal.email}
                    placeholder="Email Address"
                    onChange={(e) =>
                      setPersonal({ ...personal, email: e.target.value })
                    }
                  />
                ) : (
                  <p>{personal.email}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone Number</p>
                {isEditingPersonal ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={personal.phone}
                    placeholder="Phone Number"
                    onChange={(e) =>
                      setPersonal({ ...personal, phone: e.target.value })
                    }
                  />
                ) : (
                  <p>{personal.phone}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Province</p>
                {isEditingPersonal ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={personal.province}
                    placeholder="Province"
                    onChange={(e) =>
                      setPersonal({ ...personal, province: e.target.value })
                    }
                  />
                ) : (
                  <p>{personal.province}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Country</p>
                {isEditingPersonal ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={personal.country}
                    placeholder="Country"
                    onChange={(e) =>
                      setPersonal({ ...personal, country: e.target.value })
                    }
                  />
                ) : (
                  <p>{personal.country}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Bio</p>
                {isEditingPersonal ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={personal.bio}
                    placeholder="Short bio"
                    onChange={(e) =>
                      setPersonal({ ...personal, bio: e.target.value })
                    }
                  />
                ) : (
                  <p>{personal.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Education card */}
          <div className="bg-white border-2 border-yellow-400 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Education</h3>

              {isEditingEducation ? (
                <button
                  onClick={() => setIsEditingEducation(false)}
                  className="bg-yellow-400 rounded-lg px-4 py-1 text-sm font-bold"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingEducation(true)}
                  className="border border-gray-300 rounded-lg px-4 py-1 text-sm flex items-center gap-1"
                >
                  Edit
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">University</p>
                {isEditingEducation ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={education.university}
                    placeholder="University"
                    onChange={(e) =>
                      setEducation({ ...education, university: e.target.value })
                    }
                  />
                ) : (
                  <p>{education.university}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Qualification</p>
                {isEditingEducation ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={education.qualification}
                    placeholder="Qualification"
                    onChange={(e) =>
                      setEducation({
                        ...education,
                        qualification: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{education.qualification}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Certificates</p>
                {isEditingEducation ? (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={education.certificates}
                    placeholder="Certificates"
                    onChange={(e) =>
                      setEducation({
                        ...education,
                        certificates: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{education.certificates}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
