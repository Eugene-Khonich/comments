import { EntitySchema } from 'typeorm'

const Comment = new EntitySchema({
  name: 'Comment',
  tableName: 'comments',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    userName: {
      type: 'varchar',
      length: 100,
    },
    email: {
      type: 'varchar',
      length: 255,
    },
    homePage: {
      type: 'varchar',
      nullable: true,
    },
    text: {
      type: 'text',
    },
    attachment: {
      type: 'varchar',
      nullable: true,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
  },
  relations: {
    parent: {
      target: 'Comment',
      type: 'many-to-one',
      nullable: true,
      inverseSide: 'children',
    },
    children: {
      target: 'Comment',
      type: 'one-to-many',
      inverseSide: 'parent',
    },
  },
})

export default Comment
