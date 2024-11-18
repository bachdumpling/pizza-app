import { pizzaApi } from "@/hooks/usePizzaApi";
import { SpecialtyPizza } from "@/types";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PizzaCard from "./PizzaCard";
import { GetPizzaPricingResponse } from "@/types/api";
import CustomPizzaBuilder from "./CustomPizzaBuilder";

function Menu() {
  const [specialtyPizzas, setSpecialtyPizzas] = useState<SpecialtyPizza[]>([]);
  const [pricing, setPricing] = useState<GetPizzaPricingResponse>();
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  useEffect(() => {
    pizzaApi.getSpecialtyPizzas().then((data) => {
      const { specialtyPizzas } = data;
      setSpecialtyPizzas(specialtyPizzas);
    });

    pizzaApi.getPizzaPricing().then((data) => {
      setPricing(data);
    });
  }, []);

  // Get unique groups
  const groups = [
    "all",
    ...new Set(specialtyPizzas.map((pizza) => pizza.group)),
  ];

  // Filter pizzas based on selected group
  const filteredPizzas =
    selectedGroup === "all"
      ? specialtyPizzas
      : specialtyPizzas.filter((pizza) => pizza.group === selectedGroup);

  return (
    <div className="w-full min-h-screen p-4 bg-[#FFFFE4] mb-10">
      <h2 className="text-4xl font-rushford tracking-widest leading-none font-bold text-center text-red-600 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] my-8">
        Our Menu 🍕
      </h2>

      {/* Tabs for Specialty Pizzas & Custom Pizzas */}
      <Tabs
        defaultValue="specialty"
        className="w-full flex flex-col justify-center items-center"
      >
        <TabsList className="w-full md:w-1/2 h-full mb-8 bg-red-100 p-3 border-4 border-yellow-400 rounded-full">
          <TabsTrigger
            value="specialty"
            className="w-full rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-red-600 data-[state=active]:shadow-[4px_4px_0px_rgba(0,0,0,0.3)] font-bold text-lg py-3"
          >
            Specialty Pizzas 🍕
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="w-full rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-red-600 data-[state=active]:shadow-[4px_4px_0px_rgba(0,0,0,0.3)] font-bold text-lg py-3"
          >
            Create Your Own 🛠️
          </TabsTrigger>
        </TabsList>

        {/* Specialty Pizzas */}
        <TabsContent value="specialty" className="w-full">
          <div className="flex justify-center mb-8 gap-4 flex-wrap">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-6 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105
                  ${
                    selectedGroup === group
                      ? "bg-yellow-400 text-red-600 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
              >
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </button>
            ))}
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-2 gap-10">
            {filteredPizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        </TabsContent>

        {/* Custom Pizzas */}
        <TabsContent value="custom" className="w-full">
          {pricing && <CustomPizzaBuilder pricing={pricing} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Menu;
