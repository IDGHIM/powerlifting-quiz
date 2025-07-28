import React, { useState } from "react";

function IPFCalculator() {
  const [bodyweight, setBodyweight] = useState("");
  const [total, setTotal] = useState("");
  const [sex, setSex] = useState("male");
  const [ipfPoints, setIpfPoints] = useState(null);

  const handleCalculate = () => {
    const points = calculateIPFPoints({
      bodyweight: parseFloat(bodyweight),
      total: parseFloat(total),
      sex,
    });
    setIpfPoints(points?.toFixed(2));
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Calculateur IPF Points</h1>

      <label className="block mb-2">
        Poids corporel (kg) :
        <input
          type="number"
          value={bodyweight}
          onChange={(e) => setBodyweight(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Total (kg) :
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-4">
        Sexe :
        <select
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="male">Homme</option>
          <option value="female">Femme</option>
        </select>
      </label>

      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Calculer
      </button>

      {ipfPoints && (
        <div className="mt-4 text-lg font-semibold">
          IPF Points : {ipfPoints}
        </div>
      )}
    </div>
  );
}

// N'oublie pas d'inclure la fonction dans le même fichier ou l'importer
function calculateIPFPoints({ bodyweight, total, sex }) {
  const x = bodyweight;
  let a, b, c, d, e, f;

  if (sex === "male") {
    a = 310.67;
    b = -857.785;
    c = 1080.57;
    d = -897.935;
    e = 358.875;
    f = -59.3954;
  } else if (sex === "female") {
    a = 125.1435;
    b = -228.0303;
    c = 441.1161;
    d = -333.6383;
    e = 102.0217;
    f = -11.147;
  } else {
    return null;
  }

  const coeff =
    a +
    b * x +
    c * Math.pow(x, 2) +
    d * Math.pow(x, 3) +
    e * Math.pow(x, 4) +
    f * Math.pow(x, 5);

  return (total / coeff) * 500;
}

export default IPFCalculator;
