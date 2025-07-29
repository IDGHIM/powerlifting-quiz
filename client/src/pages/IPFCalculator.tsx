import React, { useState } from "react";
import "./IPFCalculator.css";

const IPFCalculator: React.FC = () => {
  const [bodyweight, setBodyweight] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [ipfPoints, setIpfPoints] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    setError("");
    const bw = parseFloat(bodyweight);
    const t = parseFloat(total);

    if (isNaN(bw) || isNaN(t) || bw <= 0 || t <= 0) {
      setError("Veuillez entrer des valeurs valides et positives");
      setIpfPoints(null);
      return;
    }

    if (bw < 30 || bw > 200) {
      setError("Le poids corporel doit être entre 30 et 200 kg");
      setIpfPoints(null);
      return;
    }

    try {
      const points = calculateIPFPoints({ bodyweight: bw, total: t, sex });
      if (points === null || isNaN(points)) {
        setError("Erreur dans le calcul des points IPF");
        setIpfPoints(null);
      } else {
        setIpfPoints(points.toFixed(2));
      }
    } catch {
      setError("Erreur lors du calcul");
      setIpfPoints(null);
    }
  };

  return (
    <div className="container">
      <h1>Calculateur IPF Points</h1>
      <h2>(Coefficients IPF Goodlift 2020)</h2>

      <div className="card">
        <label>
          <span>Poids corporel (kg) :</span>
          <input
            className="input"
            type="number"
            value={bodyweight}
            onChange={(e) => setBodyweight(e.target.value)}
            placeholder="Ex: 75"
            min="30"
            max="200"
            step="0.1"
          />
        </label>

        <label>
          <span>Total (kg) :</span>
          <input
            className="input"
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Ex: 500"
            min="1"
            step="0.1"
          />
        </label>

        <label>
          <span>Sexe :</span>
          <select
            className="input"
            value={sex}
            onChange={(e) => setSex(e.target.value as "male" | "female")}
          >
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </label>

        <button className="btn" onClick={handleCalculate}>
          Calculer les Points IPF
        </button>

        {error && <div className="alert alert-error">{error}</div>}
        {ipfPoints && !error && (
          <div className="alert alert-success">
            Points IPF : <strong>{ipfPoints}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

// Fonction de calcul IPF Points (Goodlift 2020)
function calculateIPFPoints({
  bodyweight,
  total,
  sex,
}: {
  bodyweight: number;
  total: number;
  sex: "male" | "female";
}): number | null {
  const x = bodyweight;
  let a, b, c, d, e, f;

  if (sex === "male") {
    a = 310.67;
    b = -857.785;
    c = 53.216;
    d = 147.0835;
    e = -31.23;
    f = 1.213;
  } else if (sex === "female") {
    a = 125.1435;
    b = -228.03;
    c = 34.5246;
    d = 86.8301;
    e = -19.1583;
    f = 0.7133;
  } else {
    return null;
  }

  const lnx = Math.log(x);
  const coeff =
    a +
    b * lnx +
    c * Math.pow(lnx, 2) +
    d * Math.pow(lnx, 3) +
    e * Math.pow(lnx, 4) +
    f * Math.pow(lnx, 5);

  if (coeff <= 0 || isNaN(coeff)) return null;
  return (total / coeff) * 500;
}

export default IPFCalculator;
