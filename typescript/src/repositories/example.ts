import { prop } from '@typegoose/typegoose'

export class Example {
    @prop()
    message!: string
}

