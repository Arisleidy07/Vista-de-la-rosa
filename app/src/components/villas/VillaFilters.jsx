import { useState } from 'react';

const BLOCKS = ['todos', '1', '2', '3', '4', '5', '6', '7', '8'];

export default function VillaFilters({ selectedBlock, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    selectedBlock === 'todos' ? 'Todos los bloques' : `Bloque ${selectedBlock}`;

  return (
    <div className="villas-filters">
      <div className="villas-filters-inner villas-filters-desktop">
        {BLOCKS.map((block) => (
          <button
            key={block}
            type="button"
            className={
              'chip-button' + (selectedBlock === block ? ' chip-button-active' : '')
            }
            onClick={() => onChange(block)}
          >
            {block === 'todos' ? 'Todos los bloques' : `Bloque ${block}`}
          </button>
        ))}
      </div>

      <div className="villas-filters-mobile">
        <button
          type="button"
          className="villas-filters-mobile-button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="villa-filters-menu"
        >
          <span>{currentLabel}</span>
          <span className="villas-filters-mobile-chevron" aria-hidden="true">▾</span>
        </button>

        {isOpen && (
          <div
            id="villa-filters-menu"
            className="villas-filters-mobile-menu"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="villas-filters-mobile-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="villas-filters-mobile-title">Selecciona un bloque</p>
              <div className="villas-filters-mobile-list">
                {BLOCKS.map((block) => {
                  const label =
                    block === 'todos' ? 'Todos los bloques' : `Bloque ${block}`;
                  const isActive = selectedBlock === block;
                  return (
                    <button
                      key={block}
                      type="button"
                      className={
                        'villas-filters-mobile-option' +
                        (isActive ? ' villas-filters-mobile-option-active' : '')
                      }
                      onClick={() => {
                        onChange(block);
                        setIsOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
