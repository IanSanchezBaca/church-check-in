import { doc, runTransaction } from 'firebase/firestore';
import { db } from './firebase'; // adjust if your firebase config is in a different file

export async function getNextKidId() {
    const counterRef = doc(db, 'counters', 'lastKidId');

    const newId = await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(counterRef);
        if (!docSnap.exists()) {
            throw 'Counter document does not exist!';
        }

        const currentValue = docSnap.data().value;
        const nextValue = currentValue + 1;

        transaction.update(counterRef, { value: nextValue });

        // Return as a zero-padded 5-digit string
        return nextValue.toString().padStart(5, '0');
    });

    return newId;
}
