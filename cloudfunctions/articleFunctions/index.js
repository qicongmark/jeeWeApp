
const addArticle = require('./addArticle/index');
const deleteArticle = require('./deleteArticle/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'addArticle':
      return await addArticle.main(event, context);
    case 'deleteArticle':
      return await deleteArticle.main(event, context);
       
  }
};