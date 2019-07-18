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
  backtotop.addEventListener('click', () => document.documentElement.scrollTo({ top: 0 }))
  document.addEventListener('scroll', scr);
}