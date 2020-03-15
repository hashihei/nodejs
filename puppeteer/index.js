const puppeteer = require('puppeteer');
const weburl ='';
//スクレイピングするaタグのクラス名
const csss_classname = '.class-name';

let page;

async function createBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  return browser.newPage();
}

exports.getWebPage = async (req, res) => {

  if (!page) {
    page = await createBrowserPage();
  }

  await page.goto(weburl, {
		'waitUntil' : 'networkidle0'
	  });

  const result = await page.evaluate(getJson);
  const u_result = await getUnique(result);

  res.set('Content-Type', 'application/json');
  res.send(u_result);
};

//重複の削除
function getUnique(contentList){
  const r_array = {}, result = [];
  let i;

  for (i = 0; i < contentList.length; i++){
    var href = contentList[i]['href'];
    var title = contentList[i]['title'];

    if(!r_array[href]){
      r_array[href] = true;
      result.push({href,title});
    }
  }
  return result;
}

//指定したクラス名が付与されたaタグのhref , text情報を取得
function getJson() {
    return [...document.querySelectorAll(csss_classname)].map(article => {
      //const a = article.querySelector('.fundDetailLink');
      const a = article;
      const href = a.href;
      const title = a.textContent;
  
      return {href, title};
    });
  }
