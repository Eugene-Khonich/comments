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
    filePath: {
      type: 'varchar',
    },
    fileType: {
      type: 'varchar',
    },
    mimeType: {
      type: 'varchar',
    },
    size: {
      type: 'int',
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
  },
  relations: {
    comment: {
      target: 'Comment',
      type: 'many-to-one',
      joinColumn: true,
    },
  },
})

export default Attachment
