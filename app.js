(() => {
  const data = window.OLD_SOUL_GEM;
  if (!data) return;

  const imageSource = data.imageSource;
  const byId = (id) => document.getElementById(id);

  document.querySelectorAll('[data-collage]').forEach((element) => {
    element.style.backgroundImage = `url("${imageSource}")`;
  });

  document.querySelectorAll('[data-image-position]').forEach((element) => {
    element.style.backgroundImage = `url("${imageSource}")`;
    element.style.backgroundPosition = element.dataset.imagePosition;
  });

  const applyLinks = (selector, url) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (url) {
        element.href = url;
        element.hidden = false;
      } else {
        element.hidden = true;
      }
    });
  };

  applyLinks('[data-etsy-link]', data.links.etsy);
  applyLinks('[data-facebook-link]', data.links.facebook);
  applyLinks('[data-instagram-link]', data.links.instagram);

  const filterRow = byId('filter-row');
  const pieceGrid = byId('piece-grid');
  const dialog = byId('piece-dialog');
  const dialogContent = byId('dialog-content');
  const dialogClose = byId('dialog-close');

  const collectionName = (id) => {
    const collection = data.collections.find((item) => item.id === id);
    return collection ? collection.name : 'Collection';
  };

  const renderFilters = () => {
    const filters = [{ id: 'all', name: 'All pieces' }, ...data.collections];
    filterRow.innerHTML = filters.map((filter, index) => (
      `<button class="filter-button${index === 0 ? ' is-active' : ''}" type="button" data-filter="${filter.id}">${filter.name}</button>`
    )).join('');

    filterRow.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      filterRow.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      renderPieces(button.dataset.filter);
    });
  };

  const renderPieces = (filter = 'all') => {
    const pieces = filter === 'all'
      ? data.pieces
      : data.pieces.filter((piece) => piece.collection === filter);

    pieceGrid.innerHTML = pieces.map((piece) => `
      <article class="piece-card">
        <div class="piece-image" role="img" aria-label="${piece.name}" style="background-image:url('${imageSource}');background-position:${piece.imagePosition}"></div>
        <div class="piece-body">
          <span class="piece-meta">${collectionName(piece.collection)} · ${piece.category}</span>
          <h3>${piece.name}</h3>
          <p>${piece.description}</p>
          <div class="piece-links">
            <button type="button" data-piece="${piece.id}">View details</button>
            <a href="${piece.shopUrl || data.links.etsy}" target="_blank" rel="noopener noreferrer">Shop ↗</a>
          </div>
        </div>
      </article>
    `).join('');
  };

  const openPiece = (id) => {
    const piece = data.pieces.find((item) => item.id === id);
    if (!piece) return;

    dialogContent.innerHTML = `
      <div class="dialog-layout">
        <div class="dialog-image" role="img" aria-label="${piece.name}" style="background-image:url('${imageSource}');background-position:${piece.imagePosition}"></div>
        <div class="dialog-copy">
          <p class="eyebrow">${collectionName(piece.collection)}</p>
          <h2>${piece.name}</h2>
          <p>${piece.story}</p>
          <dl>
            <div><dt>Category</dt><dd>${piece.category}</dd></div>
            <div><dt>Details</dt><dd>${piece.materials}</dd></div>
            <div><dt>Availability</dt><dd>${piece.status}</dd></div>
          </dl>
          <a class="button button-dark" href="${piece.shopUrl || data.links.etsy}" target="_blank" rel="noopener noreferrer">View on Etsy ↗</a>
        </div>
      </div>
    `;

    if (typeof dialog.showModal === 'function') dialog.showModal();
  };

  pieceGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-piece]');
    if (button) openPiece(button.dataset.piece);
  });

  dialogClose.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  const menuButton = byId('menu-button');
  const mainNav = byId('main-nav');
  menuButton.addEventListener('click', () => {
    const open = mainNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  mainNav.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });

  byId('year').textContent = new Date().getFullYear();
  renderFilters();
  renderPieces();
})();
