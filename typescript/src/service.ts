import { getModelForClass, ReturnModelType, DocumentType } from '@typegoose/typegoose'

/**
 * Basic Example of a MongoDB Service
 */
export default class Service {
    public Model: ReturnModelType<any>

    /**
    * Constructor
    */
    constructor(Collection: DocumentType<any>) {
        this.Model = getModelForClass(Collection)
    }

    /**
     * Get all document based on cursor and limit.
     */
    public async findAll(cursor: number) {
        const res = await this.Model.find()
            .sort({ value: 1 })
            .skip((cursor - 1) * 2)
            .limit(2)

        return res
    }

    /**
     * Example of insert document
     */
    public async insertOne(args: any) {
        await this.Model.create(args)

        return true
    }

    /**
    * Example of full text search.
    */
    public async search(term: string) {
        const pipeline = [
            {
                $search: {
                    index: 'default',
                    compound: {
                        should: [
                            {
                                text: {
                                    query: term,
                                    path: 'name', /* Change path name here for full text search */
                                    fuzzy: {},
                                    score: { boost: { value: 5 } }
                                }
                            }
                        ]
                    }
                }
            },
            { $limit: 2 }
        ]

        const result = await this.Model.aggregate(pipeline)

        return result
    }


}