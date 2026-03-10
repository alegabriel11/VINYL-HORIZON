import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching orders...');
  const orders = await prisma.order.findMany();
  let updatedCount = 0;

  for (const order of orders) {
    let needsUpdate = false;
    const newItems = [];
    
    // Some older records might have an array, some might be parsed. Prisma jsonb handles it.
    let itemsArray = order.items;
    
    // If it's a string, parse it (though Prisma JSON should give an array/object)
    if (typeof itemsArray === 'string') {
        try { itemsArray = JSON.parse(itemsArray); } catch (e) {}
    }

    if (Array.isArray(itemsArray)) {
      for (const item of itemsArray) {
        if (!item.title) {
          const vinyl = await prisma.vinyl.findUnique({ where: { id: item.id } });
          if (vinyl) {
            newItems.push({
              ...item,
              title: vinyl.title,
              artist: vinyl.artist
            });
            needsUpdate = true;
          } else {
            // Vinyl deleted or not found
            newItems.push({
              ...item,
              title: 'Vinilo Clásico',
              artist: 'Colección'
            });
            needsUpdate = true;
          }
        } else {
          newItems.push(item);
        }
      }
    }

    if (needsUpdate) {
       await prisma.order.update({
         where: { id: order.id },
         data: { items: newItems }
       });
       updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} orders to include titles and artists.`);
}

main().catch(console.error).finally(async () => {
    await prisma.$disconnect();
});
