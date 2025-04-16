export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-full min-h-[80vh]">
      {children}
    </div>
  );
}
