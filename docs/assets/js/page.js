// back to top 按钮
{
  const backtotop = document.getElementById('backtotop');
  const scr = () => {
    if (document.documentElement.scrollTop > 210) {
      backtotop.className = '';
    } else {
      backtotop.className = 'btt-hidden';
    }
  };
  scr();
  backtotop.addEventListener('click', () => document.documentElement.scrollTo({ top: 210 }));
  document.addEventListener('scroll', scr);
}

// 锚
{
  const main_content = document.getElementById('main_content');
  main_content.addEventListener('click', ({ target }) => {
    if (!/^H[1-6]$/.test(target.tagName)) return;
    const id = target.getAttribute('id');
    if (!id) return;
    location.hash = id;
  });
}
