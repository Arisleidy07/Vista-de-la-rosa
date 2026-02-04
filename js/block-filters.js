// Sistema de Filtros por Bloques para Villas
// Maneja el filtrado de villas por bloques (dropdown móvil y botones desktop)

document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".block-filter-btn");
  const dropdownBtn = document.getElementById("blockDropdownBtn");
  const dropdownMenu = document.getElementById("blockDropdownMenu");
  const dropdownItems = document.querySelectorAll(".block-dropdown-item");
  const selectedBlockText = document.getElementById("selectedBlockText");
  const villasGrid = document.getElementById("villas-grid");
  const noResults = document.getElementById("no-results");

  // Función para filtrar villas por bloque
  function filterVillasByBlock(blockNumber) {
    const villaCards = villasGrid.querySelectorAll(".col-12.col-md-6");
    let visibleCount = 0;

    villaCards.forEach((card) => {
      const villaBlock = card.getAttribute("data-block");

      if (blockNumber === "todos" || villaBlock === blockNumber) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Mostrar mensaje si no hay resultados
    if (visibleCount === 0) {
      noResults.style.display = "block";
      villasGrid.style.display = "none";
    } else {
      noResults.style.display = "none";
      villasGrid.style.display = "";
    }
  }

  // Toggle dropdown móvil
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdownBtn.classList.toggle("open");
      dropdownMenu.classList.toggle("open");
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener("click", function (e) {
      if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownBtn.classList.remove("open");
        dropdownMenu.classList.remove("open");
      }
    });
  }

  // Event listeners para items del dropdown móvil
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remover clase active de todos los items
      dropdownItems.forEach((i) => i.classList.remove("active"));

      // Agregar clase active al item clickeado
      this.classList.add("active");

      // Obtener el bloque seleccionado
      const selectedBlock = this.getAttribute("data-block");

      // Actualizar texto del botón
      const itemText = this.textContent.trim();
      if (selectedBlockText) {
        selectedBlockText.textContent = itemText;
      }

      // Cerrar dropdown
      if (dropdownBtn && dropdownMenu) {
        dropdownBtn.classList.remove("open");
        dropdownMenu.classList.remove("open");
      }

      // Filtrar villas
      filterVillasByBlock(selectedBlock);
    });
  });

  // Event listeners para los botones de filtro desktop
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remover clase active de todos los botones
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Agregar clase active al botón clickeado
      this.classList.add("active");

      // Obtener el bloque seleccionado
      const selectedBlock = this.getAttribute("data-block");

      // Filtrar villas
      filterVillasByBlock(selectedBlock);
    });
  });
});
