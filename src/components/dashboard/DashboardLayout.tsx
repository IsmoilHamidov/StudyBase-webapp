type DashboardLayoutProps = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default function DashboardLayout({
  sidebar,
  children,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-100">
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[256px_1fr]">
      <aside className="bg-slate-900 border-b border-slate-800 lg:border-b-0 lg:border-r lg:border-slate-800">
        <div className="sticky top-0 h-screen p-5 lg:p-6 flex flex-col overflow-hidden">
          {sidebar}
        </div>
      </aside>
      <section className="p-5 lg:p-8">
        {children}
      </section>
    </div>
  </main>
  );
}