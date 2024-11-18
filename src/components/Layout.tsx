import Nav from "./Nav";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-grow h-full flex flex-col bg-[#FFFFE4]">{children}</main>

      <footer className="py-6 text-center bg-red-600 backdrop-blur-sm">
        <p className="font-mono text-yellow-200">
          © 2024 Bach's. All rights reserved. 🍕
        </p>
      </footer>
    </div>
  );
}
