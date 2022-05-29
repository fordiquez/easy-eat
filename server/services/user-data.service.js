const db = require("helpers/db.helper");

const getAll = async () => await db.UserData.find()

const getById = async (id) => await getUserData(id)

const create = async (params) => {
  const existedUserData = await db.UserData.findOne({ accountId: params.accountId })
  if (existedUserData) existedUserData.remove()
  const newUserData = new db.UserData(params)
  await newUserData.save()
  return {
    newUserData,
    message: 'The user data has been successfully created'
  }
}

const update = async (id, params) => {
  const updatedUserData = await getUserData(id)
  Object.assign(updatedUserData, params)
  updatedUserData.updated = Date.now()
  await updatedUserData.save()

  const userData = await getUserData(id)
  console.log(userData)

  return {
    userData,
    message: 'The user data has been successfully updated'
  }
}

const _delete = async (id) => {
  const userData = await getUserData(id)
  await userData.remove()

  return {
    message: 'The user data has been successfully deleted'
  }
}

const getUserData = async (accountId) => {
  if (!db.isValidId(accountId)) throw 'User data not found'
  const userData = await db.UserData.findOne({ accountId }).populate('selectedPlan')
  if (!userData) throw 'User data not found'
  if (userData.customProportions) userData.selectedPlan.proportions = userData.customProportions
  return userData
}


module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
}