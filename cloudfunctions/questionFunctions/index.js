const cloud = require('wx-server-sdk');

const addQuestion = require('./addQuestion/index');
const deleteQuestion = require('./deleteQuestion/index');
const updateQuestion = require('./updateQuestion/index');

// 云函数入口函数
exports.main = async (event, context) => {


  switch (event.type) {
    case 'addQuestion':
      return await addQuestion.main(event, context);
    case 'deleteQuestion':
      return await deleteQuestion.main(event, context);
    case 'updateQuestion':
      return await updateQuestion.main(event, context);
  }

};