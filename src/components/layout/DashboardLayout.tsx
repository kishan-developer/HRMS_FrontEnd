import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import { type Role } from './Sidebar/sidebar.config';

export default function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: Role;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar fixedRole={role} />
      <div className="flex-1 flex flex-col">
        <Navbar role={role} />
        <main className="flex-1 p-6">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
