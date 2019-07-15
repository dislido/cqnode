{
  const dir = [['/', '首页'], ['/docs/', '文档'], ['/tutorial/', '教程']];
  const mainDirectory = document.getElementById('main_directory');
  const leftCurr = dir.length - 1 - dir.reverse().findIndex(it => pageConf.dir.startsWith(it[0]));
  dir.reverse();
  
  dir.forEach((it, index) => {
    const p = document.createElement('p');
    const title = document.createElement(index === leftCurr ? 'strong' : 'a');
    if (index !== leftCurr) title.setAttribute('href', `/cqnode${it[0]}`);
    title.innerText = it[1];
    p.append(title);
    mainDirectory.append(p);
  })

}