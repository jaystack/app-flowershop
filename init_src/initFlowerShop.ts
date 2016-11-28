import { FlowersModel, CategoriesModel } from './FlowerShopModel'
import * as mongoose from 'mongoose'

const con = mongoose.createConnection('mongodb://127.0.0.1:27017/flowershop', {})

let categories = require('../public/images/categories.json')
let flowers = require('../public/images/flowers.json')

let categoriesModel = new CategoriesModel(con)
let flowersModel = new FlowersModel(con)

let isCategoriesInitFinished = false
let isFlowersInitFinished = false

let addCategories = (callback) => {
  if (!categories.length) {
    console.log('Categories init finished')
    return flowersModel.addFlower(flowers.pop()).then(addFlowers).catch(addFlowers)
  }
  categoriesModel.addCategory(categories.pop()).then(addCategories).catch((err) => {
    console.log('err', err)
  })
}

let addFlowers = () => {
  if (!flowers.length) {
    console.log('Flowers init finished')
    process.exit()
  }
  flowersModel.addFlower(flowers.pop()).then(addFlowers).catch((err) => {
    console.log('err', err)
  })
}

categoriesModel.addCategory(categories.pop()).then(addCategories).catch(addCategories)