import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase-doctors.fly.dev/");

function getPbDateString(date) {
  return date
    .toISOString()
    .replace(".", "T")
    .split("T")
    .filter((str, i) => i !== 2)
    .join(" ");
}

async function start() {
  await pb.admins.authWithPassword("gabrielnpoa@gmail.com", "gajana090903");
  setInterval(async () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dateString = getPbDateString(now);

    const surgeriesToDelete = await pb
      .collection("surgeries")
      .getFullList(undefined, {
        filter: `startDate < "${dateString}"`,
      });

    if (surgeriesToDelete.length > 0) {
      surgeriesToDelete.forEach(async (surgery) => {
        await pb.collection("surgeries").delete(surgery.id);
      });
    }
  }, 24 * 60 * 60 * 1000);
}

start();
