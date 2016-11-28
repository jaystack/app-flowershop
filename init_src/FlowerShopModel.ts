import * as mongoose from 'mongoose'

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    Name: String,
    DisplayName: String
});

const flowerSchema = new Schema({
    Name: String,
    ImgUrl: String,
    Price: Number,
    Category: String
});

export class CategoriesModel {
    private model

    constructor(connection) {
        this.model = connection.model('Categories', categorySchema)
    }

    addCategory (category: any) {
        console.log(category)
        return new Promise((resolve, reject) => {
            this.getCategory(category.Name).then((res: any) => {
                if (!res) {
                    try {
                        if (!category) throw new Error('empty category is not supported')
                        let view = new this.model(category)
                        view.save((err, result) => {
                            if (err) return reject(err)
                            console.log(result.Name + ' saved')
                            resolve(result)
                        })
                    } catch (e) {
                        console.log('error at save: ', e)
                        reject(e)
                    }
                    return
                }
                res.save((err, result) => {
                    if (err) return reject(err)
                    console.log(result.Name + ' updated')
                    resolve(result)
                })
                resolve(null)
            }).catch((err) => { console.log('Error:', err) })
        })
    }

    public getCategory(name: string) {
        return new Promise((resolve, reject) => {
            this.model.findOne({ $or: [{ Name: name }] }, (err, res) => {
                if (err) return console.log(err), reject(err)
                resolve(res)
            })
        })
    }
}

export class FlowersModel {
    private model

    constructor(connection) {
        this.model = connection.model('Flowers', flowerSchema);
    }

    addFlower (flower: any) {
        console.log(flower)
        return new Promise((resolve, reject) => {
            this.getFlower(flower.Name).then((res: any) => {
                if (!res) {
                    try {
                        if (!flower) throw new Error('empty flower is not supported')
                        let view = new this.model(flower)
                        view.save((err, result) => {
                            if (err) return reject(err)
                            console.log(result.Name + ' saved')
                            resolve(result)
                        })
                    } catch (e) {
                        console.log('error at save: ', e)
                        reject(e)
                    }
                    return
                }
                res.save((err, result) => {
                    if (err) return reject(err)
                    console.log(result.Name + ' updated')
                    resolve(result)
                })
                resolve(null)
            }).catch((err) => { console.log('Error:', err) })
        })
    }

    public getFlower(name: string) {
        return new Promise((resolve, reject) => {
            this.model.findOne({ $or: [{ Name: name }] }, (err, res) => {
                if (err) return console.log(err), reject(err)
                resolve(res)
            })
        })
    }
}