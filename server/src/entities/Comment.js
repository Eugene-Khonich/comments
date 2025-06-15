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
    text: {
      type: 'text',
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      eager: true,
      cascade: true,
    },
    parent: {
      target: 'Comment',
      type: 'many-to-one',
      nullable: true,
    },
    children: {
      target: 'Comment',
      type: 'one-to-many',
      inverseSide: 'parent',
    },
    attachments: {
      target: 'Attachment',
      type: 'one-to-many',
      inverseSide: 'comment',
      cascade: true,
    },
  },
})

export default Comment
