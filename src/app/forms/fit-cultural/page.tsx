'use client'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

interface Pergunta {
  texto: string;
  porcentagem: number;
}

interface Perguntas {
  [categoria: string]: Pergunta[];
}

const FitCultural = () => {
  const [perguntas, setPerguntas] = useState<Perguntas>({});
  const [respostas, setRespostas] = useState<{ [categoria: string]: { [index: number]: number } }>({});
  const [categoriaAtual, setCategoriaAtual] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [indiceCategoria, setIndiceCategoria] = useState<number>(0);

  useEffect(() => {
    fetch('/perguntas-fit-cultural.json')
      .then(response => response.json())
      .then((data: Perguntas) => {
        setPerguntas(data);
        const categorias = Object.keys(data);
        setCategorias(categorias);
        if (categorias.length > 0) {
          setCategoriaAtual(categorias[0]);
        }
      });
  }, []);

  const handleChange = (categoria: string, index: number, value: number) => {
    setRespostas(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [index]: value,
      }
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(respostas);
    // Adicione aqui a lógica para calcular o fit cultural com base nas respostas
  };

  const handleNext = () => {
    if (indiceCategoria < categorias.length - 1) {
      setIndiceCategoria(indiceCategoria + 1);
      setCategoriaAtual(categorias[indiceCategoria + 1]);
    }
  };

  const handlePrevious = () => {
    if (indiceCategoria > 0) {
      setIndiceCategoria(indiceCategoria - 1);
      setCategoriaAtual(categorias[indiceCategoria - 1]);
    }
  };

  const todasPerguntasRespondidas = () => {
    if (!categoriaAtual) return false;
    const perguntasCategoria = perguntas[categoriaAtual];
    const respostasCategoria = respostas[categoriaAtual] || {};
    return perguntasCategoria.every((_, index) => respostasCategoria[index] !== undefined);
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold mb-6">Fit Cultural</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
          {categoriaAtual && (
            <div key={categoriaAtual} className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">{categoriaAtual}</h2>
              {perguntas[categoriaAtual].map((pergunta, index) => (
                <div key={index} className="mb-4">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {pergunta.texto}
                  </label>
                  <div className="flex space-x-4">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(nota => (
                      <label key={nota} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`${categoriaAtual}-${index}`}
                          value={nota}
                          checked={respostas[categoriaAtual]?.[index] === nota}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(categoriaAtual, index, parseInt(e.target.value))}
                          className="form-radio text-blue-500"
                        />
                        <span>{nota}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={indiceCategoria === 0}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Anterior
            </button>
            {indiceCategoria < categorias.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!todasPerguntasRespondidas()}
                className={`py-2 px-4 rounded-md ${todasPerguntasRespondidas() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
              >
                Próxima
              </button>
            ) : (
              <button
                type="submit"
                disabled={!todasPerguntasRespondidas()}
                className={`py-2 px-4 rounded-md ${todasPerguntasRespondidas() ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                onClick={()=>{
                 setRespostas(respostas);
                 console.log(respostas)
                 alert('Fit cultural realizado com sucesso!')
                }}
             >
                Enviar
              </button>
            )}
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default FitCultural;
