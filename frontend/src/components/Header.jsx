function Header() {
  return (
    <div className="bg-blue-600 text-white text-center py-16 px-4">
      {/* Profile Picture */}
      <img
        src="https://via.placeholder.com/120"
        alt="Profile Picture"
        className="rounded-full mx-auto mb-4"
      />

      {/* Name */}
      <h1 className="text-4xl font-bold">Your Name</h1>

      {/* Title */}
      <p className="text-xl mt-2">Student | Developer</p>
    </div>
  );
}

export default Header;
