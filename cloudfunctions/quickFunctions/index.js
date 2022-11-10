// 云函数入口文件
const incArticle = require('./incArticle/index');
const incQuestion = require('./incQuestion/index');
const getSite = require('./getSite/index');
const incSiteAv = require('./incSiteAv/index');
const incSiteQa = require('./incSiteQa/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'incArticle':
      return await incArticle.main(event, context);
    case 'incQuestion':
      return await incQuestion.main(event, context);
    case 'getSite':
      return await getSite.main(event, context);
    case 'incSiteAv':
      return await incSiteAv.main(event, context);
    case 'incSiteQa':
      return await incSiteQa.main(event, context);
  }
}

