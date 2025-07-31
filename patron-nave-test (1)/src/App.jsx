
import React, { useState, useEffect } from 'react';

const bancos = {
  "RIPAP y reglas de navegación": [...Array(50).keys()].map(i => ({
    pregunta: `Pregunta RIPAP #${i + 1}`,
    opciones: ["A", "B", "C", "D"],
    correcta: "A",
    explicacion: `Según RIPAP, sección X página Y. Ver guía oficial.`
  })),
};

export default function App() {
  const [tema, setTema] = useState("RIPAP y reglas de navegación");
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(900);

  useEffect(() => {
    let timer;
    if (!mostrarResultado) {
      timer = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setMostrarResultado(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mostrarResultado]);

  const iniciarTest = () => {
    const seleccionadas = [...bancos[tema]].sort(() => 0.5 - Math.random()).slice(0, 10);
    setPreguntas(seleccionadas);
    setRespuestas({});
    setMostrarResultado(false);
    setTiempoRestante(900);
  };

  const finalizarTest = () => setMostrarResultado(true);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simulador Patrón de Nave Menor</h1>
      <select value={tema} onChange={e => setTema(e.target.value)} className="mb-4 p-2 border rounded">
        {Object.keys(bancos).map(t => <option key={t}>{t}</option>)}
      </select>
      {!preguntas.length && <button onClick={iniciarTest} className="px-4 py-2 bg-blue-600 text-white rounded">Iniciar Test</button>}
      {preguntas.length > 0 && !mostrarResultado && (
        <div>
          <div className="mb-2">Tiempo restante: {Math.floor(tiempoRestante / 60)}:{String(tiempoRestante % 60).padStart(2, '0')}</div>
          {preguntas.map((p, idx) => (
            <div key={idx} className="mb-4 border p-3 rounded shadow">
              <p><strong>{idx + 1}. {p.pregunta}</strong></p>
              {p.opciones.map((op, i) => (
                <div key={i}>
                  <label>
                    <input
                      type="radio"
                      name={`pregunta-${idx}`}
                      value={op}
                      checked={respuestas[idx] === op}
                      onChange={() => setRespuestas(prev => ({ ...prev, [idx]: op }))}
                    /> {op}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button onClick={finalizarTest} className="px-4 py-2 bg-green-600 text-white rounded">Finalizar Test</button>
        </div>
      )}
      {mostrarResultado && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Resultados</h2>
          {preguntas.map((p, idx) => (
            <div key={idx} className="mb-2">
              <p><strong>{idx + 1}. {p.pregunta}</strong></p>
              <p className={respuestas[idx] === p.correcta ? 'text-green-600' : 'text-red-600'}>
                Tu respuesta: {respuestas[idx] || '(no respondida)'} – Correcta: {p.correcta}
              </p>
              {respuestas[idx] !== p.correcta && <p className="text-sm text-gray-600">{p.explicacion}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
