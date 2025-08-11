// utils/indexedDbFiles.ts
import { openDB } from 'idb'

const DB_NAME = 'ai-junshi-db'
const STORE_NAME = 'chatScreenshots'

export async function initDB() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })
}

// 保存文件到 IndexedDB
export async function saveFile(id: string, file: Blob) {
  const db = await initDB()
  await db.put(STORE_NAME, file, id)
}

// 从 IndexedDB 获取文件
export async function getFile(id: string): Promise<Blob | undefined> {
  const db = await initDB()
  return await db.get(STORE_NAME, id)
}

// 删除文件
export async function deleteFile(id: string) {
  const db = await initDB()
  await db.delete(STORE_NAME, id)
}

// 清空所有文件
export async function clearFiles() {
  const db = await initDB()
  await db.clear(STORE_NAME)
}
