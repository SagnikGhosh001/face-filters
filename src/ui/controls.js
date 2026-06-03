export function initControls(onToggle) {
  const buttons = document.querySelectorAll('[data-filter]');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.filter;

      if (name === 'none') {
        // Clear all active states
        buttons.forEach(b => b.classList.remove('active'));
      } else {
        btn.classList.toggle('active');
      }

      onToggle(name);
    });
  });
}
