import { openDB } from 'idb'

const dbPromise = openDB('markdown-annotation-db', 1, {
  upgrade(db) {
    db.createObjectStore('annotations', { keyPath: 'id', autoIncrement: true })
  },
})

export const saveAnnotation = async (data: any) => {
  const db = await dbPromise
  await db.add('annotations', data)
}

export const getAnnotations = async () => {
  const db = await dbPromise
  return await db.getAll('annotations')
}
