import { db } from '../config/firebase.js';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { COLLECTIONS } from '../lib/constants.js';

function createCrudService(collectionName) {
  const col = () => collection(db, collectionName);

  return {
    getAll: async (options = {}) => {
      let q = query(col());
      if (options.where) {
        options.where.forEach(([field, op, value]) => {
          q = query(q, where(field, op, value));
        });
      }
      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
      }
      if (options.limit) {
        q = query(q, limit(options.limit));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    },

    getById: async (id) => {
      const snapshot = await getDoc(doc(db, collectionName, id));
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    },

    create: async (id, data) => {
      const now = Date.now();
      const payload = { ...data, updatedAt: now };
      if (id) {
        await setDoc(doc(db, collectionName, id), payload);
        return { id, ...payload };
      }
      payload.createdAt = now;
      const ref = await addDoc(col(), payload);
      return { id: ref.id, ...payload };
    },

    update: async (id, data) => {
      const payload = { ...data, updatedAt: Date.now() };
      await updateDoc(doc(db, collectionName, id), payload);
      return { id, ...payload };
    },

    remove: async (id) => {
      await deleteDoc(doc(db, collectionName, id));
    },
  };
}

export const villasService = createCrudService(COLLECTIONS.VILLAS);
export const servicesService = createCrudService(COLLECTIONS.SERVICES);
export const locationsService = createCrudService(COLLECTIONS.LOCATIONS);
export const configService = createCrudService(COLLECTIONS.CONFIG);
export const mediaService = createCrudService(COLLECTIONS.MEDIA);

export async function getActiveVillas() {
  return villasService.getAll({
    where: [['active', '==', true]],
    orderBy: { field: 'order', direction: 'asc' },
  });
}

export async function getPublishedServices() {
  return servicesService.getAll({
    where: [['active', '==', true]],
    orderBy: { field: 'order', direction: 'asc' },
  });
}

export async function getAppConfig() {
  const snapshot = await getDoc(doc(db, COLLECTIONS.CONFIG, 'public'));
  return snapshot.exists() ? snapshot.data() : null;
}
