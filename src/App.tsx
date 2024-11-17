import Menu from "./components/customer/menu/Menu";
import "./index.css";

export default function App() {

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-8">Sparrow Pizza</h1>

        {/* Menu */}
        <Menu />
      </div>
    </div>
  );
}
