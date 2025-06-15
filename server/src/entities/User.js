import { EntitySchema } from 'typeorm'

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    userName: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
      unique: true,
    },
  },
  relations: {
    comments: {
      type: 'one-to-many',
      target: 'Comment',
      inverseSide: 'user',
    },
  },
})

export default User
