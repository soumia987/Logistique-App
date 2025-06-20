import React, { useState } from "react";

export default function TransportForm() {
  const [formData, setFormData] = useState({
    id: "",
    conducteurId: "",
    startPoint: "",
    intermediateSteps: "",
    destination: "",
    typeMarchandise: [],
    capacity: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "select-multiple") {
      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
      setFormData({ ...formData, [name]: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-[#171717] p-8 rounded-2xl shadow-lg text-white space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Transport Form</h2>

      <Input label="ID" name="id" value={formData.id} onChange={handleChange} />
      <Input label="Conducteur ID" name="conducteurId" value={formData.conducteurId} onChange={handleChange} />
      <Input label="Start Point" name="startPoint" value={formData.startPoint} onChange={handleChange} />
      <Input label="Intermediate Steps" name="intermediateSteps" value={formData.intermediateSteps} onChange={handleChange} />
      <Input label="Destination" name="destination" value={formData.destination} onChange={handleChange} />

      <div>
        <label className="block mb-1">Type Marchandise</label>
        <select
          multiple
          name="typeMarchandise"
          onChange={handleChange}
          className="w-full bg-[#252525] text-white rounded-md p-2"
        >
          <option value="Fruits">Fruits</option>
          <option value="Légumes">Légumes</option>
          <option value="Textiles">Textiles</option>
          <option value="Électronique">Électronique</option>
        </select>
        <p className="text-sm text-gray-400 mt-1">Maintenez Ctrl (Windows) ou ⌘ (Mac) pour sélection multiple</p>
      </div>

      <Input label="Capacity (en Kg)" name="capacity" type="number" value={formData.capacity} onChange={handleChange} />
      <Input label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition"
      >
        Envoyer
      </button>
    </form>
  );
}

function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="block mb-1">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#252525] text-white rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
}
