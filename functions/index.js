const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Filter = require("bad-words");
admin.initializeApp();

const filter = new Filter();

exports.createUser = functions.auth.user().onCreate((user) => {
  const colors = [
    "red",
    "pink",
    "grape",
    "violet",
    "indigo",
    "cyan",
    "teal",
    "green",
    "lime",
    "yellow",
    "orange",
  ];
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set({
      color: colors[Math.floor(Math.random() * colors.length)],
      msgCount: 0,
    });
});

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const doc = admin.firestore().collection("users").doc(user.uid);
  await doc.delete();

  const query = admin
    .firestore()
    .collection("messages")
    .where("uid", "==", user.uid);

  const result = await query.get();
  result.forEach((doc) => doc.ref.delete());
});

// Filter message text and add ban user to banned-users collection
exports.newDoc = functions.firestore
  .document("/messages/{docID}")
  .onCreate(async (snapshot) => {
    const { body, uid } = snapshot.data();

    if (filter.isProfane(body)) {
      await snapshot.ref.update({
        body: filter.clean(body) + ": I was just banned for life :(",
      });
      await admin.firestore().collection("banned").doc(uid).set({});
    }

    const userRef = admin.firestore().collection("users").doc(uid);

    const userData = (await userRef.get()).data();

    if (userData.msgCount >= 7) {
      await admin.firestore().collection("banned").doc(uid).set({});
    } else {
      await userRef.set({ ...userData, msgCount: userData.msgCount + 1 });
    }
  });

// Delete all messages daily
