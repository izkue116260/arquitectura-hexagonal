import { useState } from 'react';

interface Zone {
  id: string;
  label: string;
  color: string;
  analogy: string;
  description: string;
  file: string;
  code: string;
}

const ZONES: Zone[] = [
  {
    id: 'dominio',
    label: 'Dominio',
    color: 'var(--domain)',
    analogy: 'Las reglas del juego.',
    description:
      'Aquí viven las reglas de tu aplicación. Es TypeScript normal: no sabe nada de React ni de dónde se guardan los datos.',
    file: 'dominio/tarea.ts',
    code: `export const MAX_TAREAS = 5;

export function puedeAgregarTarea(titulo: string, totalTareas: number) {
  const tituloValido = titulo.trim() !== '';
  const hayHueco = totalTareas < MAX_TAREAS;
  return tituloValido && hayHueco;
}`,
  },
  {
    id: 'aplicacion',
    label: 'Aplicación',
    color: 'var(--app)',
    analogy: 'El camarero: lleva los pedidos y sigue las reglas.',
    description:
      'Aquí está cada cosa que el usuario puede hacer ("agregar una tarea"). Usa las reglas del dominio y pide los datos a través de un puerto.',
    file: 'aplicacion/agregarTarea.ts',
    code: `export async function agregarTarea(repo: TareaRepository, titulo: string) {
  const tareas = await repo.obtenerTodas();

  if (!puedeAgregarTarea(titulo, tareas.length)) {
    throw new Error('No se puede agregar la tarea');
  }

  await repo.guardar([...tareas, titulo]);
}`,
  },
  {
    id: 'adaptadores',
    label: 'Adaptadores',
    color: 'var(--adapter)',
    analogy: 'Los enchufes y aparatos del mundo real.',
    description:
      'Aquí está todo lo "de fuera": React, localStorage, una API. Se conectan al resto a través de los puertos.',
    file: 'adaptadores/localStorageTareaRepository.ts',
    code: `export const localStorageTareaRepository: TareaRepository = {
  async obtenerTodas() {
    return JSON.parse(localStorage.getItem('tareas') ?? '[]');
  },
  async guardar(tareas) {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  },
};`,
  },
];

export function HexagonDiagram() {
  const [active, setActive] = useState<Zone>(ZONES[0]);

  return (
    <figure style={{ margin: '1.5rem 0' }}>
      <div role="tablist" aria-label="Zonas del hexágono" style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        {ZONES.map((zone) => (
          <button
            key={zone.id}
            role="tab"
            aria-selected={zone.id === active.id}
            onClick={() => setActive(zone)}
            style={{
              padding: '.4rem .8rem',
              border: `2px solid ${zone.color}`,
              borderRadius: 6,
              background: zone.id === active.id ? zone.color : 'transparent',
              color: zone.id === active.id ? '#fff' : 'inherit',
              cursor: 'pointer',
            }}
          >
            {zone.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        <p>
          <strong>{active.analogy}</strong>
        </p>
        <p>{active.description}</p>
        <p>
          <small>
            Fichero: <code>{active.file}</code>
          </small>
        </p>
        <pre>
          <code>{active.code}</code>
        </pre>
      </div>
    </figure>
  );
}
