import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  deleteDoc,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";

export async function archievePatient(doctorId, patientId) {
  //TODO : Get Doctor Ref
  const doctorRef = await doc(firestore, "doctors", doctorId);

  const doctorDoc = await getDoc(doctorRef);

  const doctorData = await doctorDoc.data();

  //TODO : Get Patient Ref
  const patientRef = await doc(firestore, "patients", patientId);

  //TODO : Get Patient Data
  const patientDoc = await getDoc(patientRef);

  const patientData = await patientDoc.data();

  //TODO : Get Patient Notes
  const patientNotesRef = collection(firestore, "patients", patientId, "notes");

  const notesDocs = await getDocs(patientNotesRef);

  let notes = [];

  notesDocs.forEach((doc) => {
    notes.push(doc.data());
  });

  //TODO : Get Patient Past Therapies

  const pastTherapiesRef = collection(
    firestore,
    "patients",
    patientId,
    "Past Therapies"
  );

  const pastTherapiesDocs = await getDocs(pastTherapiesRef);

  let pastTherapies = [];

  pastTherapiesDocs.forEach((doc) => {
    pastTherapies.push(doc.data());
  });

  //TODO : Get Patient  Therapies
  const therapiesRef = collection(
    firestore,
    "patients",
    patientId,
    "therapies"
  );

  const therapiesDocs = await getDocs(therapiesRef);

  let therapies = [];

  therapiesDocs.forEach((doc) => {
    therapies.push(doc.data());
  });

  //TODO : Save my Notes on Patient

  const notesRef = collection(firestore, `doctors/${doctorId}/notes`);
  const q = query(notesRef, where("patientId", "==", patientId));
  const querySnapshot = await getDocs(q);

  const myNotes = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  //TODO : Combine the info and save it to the archive of the Doc

  const data = {
    patient: patientData,
    notes: notes,
    pastTherapies: pastTherapies,
    therapies: therapies,
    myNotes: myNotes,
  };

  const archiveRef = doc(
    firestore,
    "doctors",
    doctorId,
    "archievedPatients",
    patientId
  );

  await setDoc(archiveRef, data);

  return true;
}

export async function getArchievedPatients(doctorId) {
  const archiveRef = collection(
    firestore,
    "doctors",
    doctorId,
    "archievedPatients"
  );

  const archiveDocs = await getDocs(archiveRef);

  let patients = [];

  archiveDocs.forEach((doc) => {
    patients.push({ ...doc.data(), id: doc.id });
  });

  return patients;
}
