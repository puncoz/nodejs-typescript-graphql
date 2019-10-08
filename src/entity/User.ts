import { hash } from "bcryptjs"
import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("varchar", {length: 255, unique: true})
    email: string

    @Column("text")
    password: string

    @Column("boolean", {default: false})
    verified: boolean

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10)
    }
}
