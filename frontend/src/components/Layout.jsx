import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}