import { EntitySchema } from 'typeorm'

const Attachment = new EntitySchema({
  name: 'Attachment',
  tableName: 'attachments',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    filename: {
      type: 'varchar',
    },
    mimeType: {
      type: 'varchar',
    },
    url: {
      type: 'varchar',
    },
  },
  relations: {
    comment: {
      target: 'Comment',
      type: 'many-to-one',
    },
  },
})

export default Attachment
