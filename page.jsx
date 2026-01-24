import { supabase } from "@/lib/supabase";

export default async function StorePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Failed to load products
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-10 text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 p-4"
        >
          <img
            src={p.image || "/placeholder.png"}
            alt={p.name}
            className="h-48 w-full object-contain mb-4"
          />

          <h3 className="font-bold text-lg">{p.name}</h3>
          <p className="text-sm text-gray-500">{p.brand}</p>

          <p className="text-blue-600 font-semibold mt-2">
            ${p.price}
          </p>

          <span
            className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
              p.stock > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
          </span>

          <button
            disabled={p.stock === 0}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded"
          >
            Buy
          </button>
        </div>
      ))}
    </div>
  );
}
