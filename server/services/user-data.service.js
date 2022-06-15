const db = require("utils/db");

const getAll = async () => await db.UserData.find()

const getById = async (id) => await getUserData(id)

const create = async (params) => {
  const existedUserData = await db.UserData.findOne({ accountId: params.accountId })
  if (existedUserData) existedUserData.remove()
  const userData = new db.UserData(params)
  await userData.save()
  return {
    userData,
    message: 'The user data created successfully'
  }
}

const update = async (id, params) => {
  const updatedUserData = await getUserData(id)
  Object.assign(updatedUserData, params)
  updatedUserData.updated = Date.now()
  await updatedUserData.save()

  const userData = await getUserData(id)

  return {
    userData,
    message: 'The user data updated successfully'
  }
}

const _delete = async (id) => {
  const userData = await getUserData(id)
  await userData.remove()

  return {
    message: 'The user data deleted successfully'
  }
}

const getUserData = async (accountId) => {
  if (!db.isValidId(accountId)) throw 'User data not found'
  const userData = await db.UserData.findOne({ accountId }).populate('selectedPlan')
  if (!userData) throw 'User data not found'
  if (userData.customProportions && userData.selectedPlan) userData.selectedPlan.proportions = userData.customProportions
  else if (!userData.selectedPlan) userData.selectedPlan = null
  return userData
}


module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
}