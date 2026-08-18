import { useState, useMemo } from 'react';
import { useVillas } from '../../hooks/useVillas.js';
import VillaFilters from '../villas/VillaFilters.jsx';
import VillaCard from '../villas/VillaCard.jsx';
import VillaDetailModal from '../villas/VillaDetailModal.jsx';

export default function VillasPage() {
  const { villas, loading } = useVillas();
  const [selectedBlock, setSelectedBlock] = useState('todos');
  const [activeVilla, setActiveVilla] = useState(null);

  const filteredVillas = useMemo(() => {
    if (selectedBlock === 'todos') return villas;
    return villas.filter((v) => String(v.block) === selectedBlock);
  }, [selectedBlock, villas]);

  if (loading) {
    return (
      <section className="section villas-page">
        <div className="section-inner">
          <div className="page-loader" aria-live="polite">
            <div className="page-loader-spinner" />
            <span className="sr-only">Cargando villas...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section villas-page">
      <div className="section-inner">
        <header className="villas-header">
          <div>
            <h1 className="section-title">Nuestras Villas</h1>
            <p className="section-text">
              Explora las distintas villas por bloque y descubre la opción ideal
              para tu estadía en Jarabacoa.
            </p>
          </div>
        </header>

        <VillaFilters selectedBlock={selectedBlock} onChange={setSelectedBlock} />

        {filteredVillas.length === 0 ? (
          <div className="villas-empty">
            <p>No hay villas disponibles para este bloque.</p>
          </div>
        ) : (
          <div className="villas-grid">
            {filteredVillas.map((villa) => (
              <VillaCard
                key={villa.id}
                villa={villa}
                onOpen={() => setActiveVilla(villa)}
              />
            ))}
          </div>
        )}

        {activeVilla && (
          <VillaDetailModal
            villa={activeVilla}
            onClose={() => setActiveVilla(null)}
          />
        )}
      </div>
    </section>
  );
}
