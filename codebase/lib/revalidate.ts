import { revalidatePath } from "next/cache";

// Refresh the public ISR pages affected by a catalog change so edits show up
// without waiting for the revalidate window to elapse.
export function revalidateCatalog(categorySlug?: string, productSlug?: string) {
  revalidatePath("/"); // home (featured)
  revalidatePath("/sitemap.xml");
  if (categorySlug) revalidatePath(`/${categorySlug}`);
  if (productSlug) revalidatePath(`/produit/${productSlug}`);
}
