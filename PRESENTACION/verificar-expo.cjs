const { chromium } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    const errors=[];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(path.join(__dirname,'EXPO.html')).href);
    const count=await page.locator('#rows tr').count();
    if(count!==32) throw new Error('Filas inesperadas: '+count);
    await page.selectOption('#status','fail');
    if(await page.locator('#rows tr').count()!==9) throw new Error('Filtro de fallos incorrecto');
    await page.selectOption('#group','P5');
    if(await page.locator('#rows tr').count()!==6) throw new Error('Filtro de P5 incorrecto');
    await page.selectOption('#status','');
    await page.selectOption('#group','');
    await page.fill('#search','inexistente');
    if(await page.locator('#rows tr').count()!==2) throw new Error('Búsqueda incorrecta');
    await page.fill('#search','zzzz-no-existe');
    if(!await page.locator('#empty').isVisible()) throw new Error('Estado vacío incorrecto');
    await page.fill('#search','');
    for(const width of [1440,390]){
      await page.setViewportSize({width,height:1000});
      if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw new Error('Desbordamiento global a '+width);
    }
    for(const href of await page.locator('#evidencias a').evaluateAll(links=>links.map(a=>a.getAttribute('href')))){
      if(!fs.existsSync(path.resolve(__dirname,href))) throw new Error('Evidencia ausente: '+href);
    }
    if(errors.length) throw new Error(errors.join('\n'));
    await page.setViewportSize({width:1440,height:1000});
    await page.screenshot({path:path.join(__dirname,'EXPO_preview.png'),fullPage:false});
    console.log('OK: 32 filas, filtros, búsqueda, estado vacío, 8 evidencias y diseño a 1440/390 px; sin errores JS.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
